import db from '../db'
import connector from './connector'
import { ApiPromise } from '@polkadot/api'
import { formatBalance } from '@polkadot/util'
import { isNullOrUndefined } from 'util'
import { Vec, Option } from '@polkadot/types'
import {
  EventRecord,
  Hash,
  Nominations,
  Keys,
  StakingLedger,
  ValidatorPrefs,
  Exposure
} from '@polkadot/types/interfaces'
import notifications from '../notifications'
import watcher from '../watcher'
import settings from '../settings'
import { Validator } from '../entity/Validator'
import {
  BlockInfo,
  SessionInfo,
  EnhancedDerivedStakingQuery,
  EnhancedHeader,
  HeaderSessionInfo,
  EventOffence,
  EventReward,
  EventSlash
} from '../types/connector'
import AccountId from '@polkadot/types/primitive/Generic/AccountId'
import { pubsub } from '../api'

let maxHeaderBatch = 100
let maxBlockHistory = 15000

let api: ApiPromise = null
let firstSavedBlock: BlockInfo = null
let lastSavedBlock: BlockInfo = null

async function getPreviousHeaders(
  numberOfHeaders: number,
  startFromBlock: number
) {
  let oldHeaders: EnhancedHeader[] = []
  console.log('getting', numberOfHeaders, 'previous headers')

  let blockNumbers = Array.from(
    Array(numberOfHeaders),
    (x, index) => startFromBlock - index - 1
  )

  for (let batch = 0; batch < blockNumbers.length / maxHeaderBatch; batch++) {
    let batchHeaderNumbers = blockNumbers.slice(
      batch * maxHeaderBatch,
      (batch + 1) * maxHeaderBatch
    )
    let batchHeaders = await getBlockHeaders(batchHeaderNumbers)

    oldHeaders = oldHeaders.concat(batchHeaders)
    if (batchHeaders.length < batchHeaderNumbers.length) break
  }

  return oldHeaders
}

async function getBlockHeader(blockNumber: number) {
  return (await getBlockHeaders([blockNumber]))[0]
}

async function getBlockHeaders(blockNumbers: number[]) {
  let blocksAvailable = true
  if (blockNumbers.length > 1) {
    blocksAvailable = await testPruning(blockNumbers[blockNumbers.length - 1])
    console.log(
      'getting block headers:',
      JSON.stringify(blockNumbers[0]),
      '...',
      JSON.stringify(blockNumbers[blockNumbers.length - 1])
    )
  }

  if (!blocksAvailable) return []

  let blockHashes = await Promise.all(
    blockNumbers.map(blockNumber => api.rpc.chain.getBlockHash(blockNumber))
  )

  let headers = await Promise.all(
    blockHashes.map(blockHash =>
      api.derive.chain.getHeader(blockHash.toString())
    )
  )

  let timestamps = await Promise.all(
    headers.map(header =>
      header ? api.query.timestamp.now.at(header.hash) : null
    )
  )

  let events: Vec<EventRecord>[] = await Promise.all(
    headers.map(header =>
      header ? api.query.system.events.at(header.hash) : null
    )
  )

  let enhancedHeaders: EnhancedHeader[] = await Promise.all(
    headers.map(async (header, index) => {
      if (!header) return null

      const eventWrapper = events[index]
      const timestamp: number = timestamps[index].toNumber()
      const number: number = header.number.toNumber()
      const hash: string = header.hash.toString()
      const author: string = header.author.toString()
      const slashes: EventSlash[] = []
      const rewards: EventReward[] = []
      const offences: EventOffence[] = []
      let sessionInfo: HeaderSessionInfo = null

      for (const record of eventWrapper) {
        const { event } = record

        if (event.method === 'NewSession') {
          sessionInfo = {
            sessionIndex: (
              await api.query.session.currentIndex.at(hash)
            ).toNumber(),
            eraIndex: (await api.query.staking.currentEra.at(hash)).toNumber()
          }
          await db.bulkSave('Validator', await getValidators(hash))
        }
        if (event.method === 'Slash') {
          slashes.push({
            accountId: api.createType('AccountId', event.data[0]).toString(),
            amount: formatBalance(api.createType('Balance', event.data[1]))
          })
        }
        if (event.method === 'Reward') {
          rewards.push({
            amount: formatBalance(api.createType('Balance', event.data[0]))
          })
        }
        if (event.method === 'Offence') {
          offences.push({
            kind: api.createType('Kind', event.data[0]).toString(),
            timeSlot: api.createType('OpaqueTimeSlot', event.data[1]).toString()
          })
        }
      }

      if (sessionInfo) {
        sessionInfo = { ...sessionInfo, rewards, offences, slashes }
        console.log(
          'Got session info for block: #',
          header.number.toNumber(),
          sessionInfo
        )
      }

      return {
        author,
        number,
        hash,
        timestamp,
        sessionInfo
      }
    })
  )

  return enhancedHeaders
}

async function subscribeEvents() {
  const unsubscribe = await api.query.system.events(async events => {
    events.forEach(async record => {
      const { event } = record

      if (event.method === 'Reward') {
        console.log('Session #', await getSessionInfo(), ' ended')
        console.log(
          'validators were rewarded:',
          formatBalance(api.createType('Balance', event.data[0]))
        )
      }

      if (event.method === 'NewSession') {
        console.log('new session #:', event.data[0].toString())
        console.log(JSON.stringify(await getSessionInfo(), null, 1))
      }

      if (event.method === 'SomeOffline') {
        api
          .createType('Vec<IdentificationTuple>', event.data[0])
          .forEach(identificationTuple => {
            if (
              identificationTuple[0].toString() === settings.get().validatorId
            ) {
              notifications.sendOfflineMessage()
            }
          })
      }

      if (event.method === 'Slash') {
        if (event.data[0].toString() === settings.get().validatorId) {
          notifications.sendSlashMessage(event.data[1].toString())
        }
      }
    })
  })

  connector.addSubscription(unsubscribe)
  return
}

async function subscribeHeaders() {
  const unsubscribe = await api.rpc.chain.subscribeNewHeads(async header => {
    let hash = header.hash.toString()
    let number = header.number.toNumber()
    let missing = 0
    let enhancedHeader = await getBlockHeader(number)
    watcher.ping(enhancedHeader.timestamp)

    console.log('new header #:', number, 'with hash:', hash)

    analyzeExtrinsics(hash)

    if (!firstSavedBlock.number)
      firstSavedBlock = { number, hash, timestamp: enhancedHeader.timestamp }

    missing = lastSavedBlock.number
      ? number - lastSavedBlock.number - 1
      : number - firstSavedBlock.number

    lastSavedBlock = { number, hash, timestamp: enhancedHeader.timestamp }

    //GET Missing blocks, TODO: this could make hole in the data if missing
    //server is turned off while getting missing blocks

    if (missing > 0) {
      console.log('missing', missing, 'headers')
      let missingHeaders = await getPreviousHeaders(
        missing,
        lastSavedBlock.number
      )

      await db.bulkSave('Header', missingHeaders)
    }

    //Fork detected, first received block is saved right now
    if (missing < 0) {
      let duplicateHeaders = missing * -1
      console.log(
        duplicateHeaders,
        'fork detected, discarded block with hash',
        enhancedHeader.hash.toString()
      )
      return
    }

    await db.saveHeader(enhancedHeader)

    return
  })

  connector.addSubscription(unsubscribe)
  return
}

async function analyzeExtrinsics(blockHash: string) {
  let signedBlock = await api.rpc.chain.getBlock(blockHash)
  signedBlock.block.extrinsics.forEach(async extrinsic => {
    let methodName = extrinsic.method.methodName
    let signer = extrinsic.signer
    let args = extrinsic.method.args

    if (methodName === 'nominate') {
      api.createType('Vec<Address>', args[0]).forEach(arg => {
        if (arg.toString() === settings.get().validatorId) {
          notifications.sendNominatedMessage(signer.toString())
        }
      })
    }

    if (methodName === 'bond') {
      let controller = api.createType('Address', args[0])
      if (controller.toString() === settings.get().validatorId) {
        let amount = api.createType('Compact<Balance>', args[1])
        notifications.sendBondedMessage(
          signer.toString(),
          formatBalance(api.createType('Balance', amount))
        )
      }
    }

    if (methodName === 'bondExtra') {
      const validatorInfo = await db.getValidatorInfo(
        settings.get().validatorId
      )

      //TODO change nominator data to object
      const nominatorData = JSON.parse(
        validatorInfo.commissionData[0].nominatorData
      )
      if (nominatorData && nominatorData.stakers) {
        nominatorData.stakers.forEach((stakerData: any) => {
          if (signer.toString() === stakerData.accountId.toString()) {
            let amount = api.createType('Compact<Balance>', args[0])
            notifications.sendBondedExtraMessage(
              signer.toString(),
              formatBalance(api.createType('Balance', amount))
            )
          }
        })
      }
    }
  })
}

async function getValidators(at?: string | Hash) {
  console.log(
    'getting validators for',
    at
      ? 'block #' +
          at +
          ' in session #' +
          (await api.query.session.currentIndex.at(at))
      : 'current era'
  )

  if (!at) {
    at = await api.rpc.chain.getBlockHash()
  }

  const validators = await api.query.session.validators.at(at)
  const eraIndex = (await api.query.staking.currentEra.at(at)).toNumber()
  const sessionIndex = (await api.query.session.currentIndex.at(at)).toNumber()
  const queuedKeys = await api.query.session.queuedKeys.at(at)
  const validatorStakingRequests = []
  const controllerIds = await Promise.all(
    validators.map(accountId => api.query.staking.bonded.at(at, accountId))
  )

  for (let index = 0; index < validators.length; index++) {
    const accountId = validators[index]
    const stashId = accountId
    const controllerId = controllerIds[index].unwrap()
    const sessionIds = (queuedKeys.find(([currentId]) =>
      currentId.eq(accountId)
    ) || [undefined, api.createType('Keys', [])])[1]

    validatorStakingRequests.push(
      Promise.all([
        //Workaround for TypeScript Bug https://github.com/microsoft/TypeScript/issues/22469
        Promise.all([
          eraIndex,
          sessionIndex,
          accountId,
          stashId,
          controllerId,
          api.query.staking.nominators.at(at, accountId),
          api.query.staking.stakers.at(at, accountId),
          sessionIds,
          api.query.session.nextKeys.at(
            at,
            api.consts.session.dedupKeyPrefix,
            accountId
          ),
          api.query.staking.ledger.at(at, controllerId)
        ]),
        //Max number of safe overloads in Promise.all is 10
        Promise.all([api.query.staking.validators.at(at, accountId)])
      ])
    )
  }

  const enhancedStakingInfo: EnhancedDerivedStakingQuery[] = (
    await Promise.all(validatorStakingRequests)
  ).map(
    ([
      [
        eraIndex,
        sessionIndex,
        accountId,
        stashId,
        controllerId,
        nominators,
        stakers,
        sessionIds,
        nextSessionIds,
        stakingLedger
      ],
      [validatorPrefs]
    ]: [
      [
        number,
        number,
        AccountId,
        AccountId,
        AccountId,
        Option<Nominations>,
        Exposure,
        Keys,
        Option<Keys>,
        Option<StakingLedger>
      ],
      ValidatorPrefs[]
    ]) => ({
      eraIndex,
      sessionIndex,
      accountId,
      stashId,
      controllerId,
      nominators: nominators.isSome ? nominators.unwrap().targets : [],
      stakers: stakers,
      sessionIds,
      nextSessionIds: nextSessionIds.isSome ? nextSessionIds.unwrap() : [],
      stakingLedger: stakingLedger.unwrap(),
      validatorPrefs: api.createType(
        'ValidatorPrefs',
        validatorPrefs.toArray()[0]
      )
    })
  )

  // TODO?
  // rewardDestination: RewardDestination
  // nextKeys: Keys
  // stakers: Exposure

  return enhancedStakingInfo
}

async function getSessionInfo(): Promise<SessionInfo> {
  let [derivedSessionInfo, newEraIndex] = await Promise.all([
    api.derive.session.info(),
    api.query.staking.currentEra()
  ])

  return {
    eraIndex: newEraIndex.toNumber(),
    eraLength: derivedSessionInfo.eraLength.toNumber(),
    eraProgress: derivedSessionInfo.eraProgress.toNumber(),
    isEpoch: derivedSessionInfo.isEpoch,
    sessionIndex: derivedSessionInfo.currentIndex.toNumber(),
    sessionLength: derivedSessionInfo.sessionLength.toNumber(),
    sessionProgress: derivedSessionInfo.sessionProgress.toNumber(),
    sessionsPerEra: derivedSessionInfo.sessionsPerEra.toNumber()
  }
}

async function testPruning(blockNumber: number) {
  let headerHash = await api.rpc.chain.getBlockHash(blockNumber)
  let gotBlock = !isNullOrUndefined(
    await api.derive.chain.getHeader(headerHash).catch(e => {
      console.log('pruning test failed on block', blockNumber)
    })
  )
  return gotBlock
}

async function getHeaderDataHistory() {
  let lastBlockNumber = (await api.rpc.chain.getHeader()).number.toNumber()
  let firstBlock = firstSavedBlock.number
  let expectedBlockTime = api.consts.babe.expectedBlockTime.toNumber()
  maxBlockHistory = (settings.get().maxDataAge * 3600000) / expectedBlockTime

  if (lastBlockNumber - firstBlock < maxBlockHistory) {
    let headers = await getPreviousHeaders(
      maxBlockHistory - (lastBlockNumber - firstBlock),
      firstBlock
    )

    if (headers.length) {
      let firstHeader = headers[headers.length - 1]

      if (firstHeader.number < firstSavedBlock.number)
        firstSavedBlock = {
          hash: firstHeader.hash,
          number: firstHeader.number,
          timestamp: firstHeader.timestamp
        }
    }

    await db.bulkSave('Header', headers)
  }
}

async function connect(nodeUrl: string) {
  connector.setNodeUrl(nodeUrl)
  api = await connector.connect()

  if (!api) throw new Error('Cannot connect to API')

  firstSavedBlock = {
    number: null,
    hash: null,
    timestamp: null
  }

  lastSavedBlock = {
    number: null,
    hash: null,
    timestamp: null
  }

  await waitUntilSynced()
  startDataService()

  return nodeUrl
}

async function waitUntilSynced() {
  const health = await api.rpc.system.health()
  if (health.isSyncing.toString() === 'true') {
    const currentBlock = await api.rpc.chain.getHeader()
    const currentBlockTime = (await api.query.timestamp.now()).toNumber()
    const firstBlockHash = await api.rpc.chain.getBlockHash(1)
    const firstBlockTime = (
      await api.query.timestamp.now.at(firstBlockHash)
    ).toNumber()
    const currentTime = await Date.now()
    const currentBlockHeight = currentBlock.number.toNumber()
    const progress = (
      ((currentTime - currentBlockTime) / (currentTime - firstBlockTime)) *
      100
    ).toFixed(1)

    console.log('Node is syncing, waiting to finish')
    console.log('Current block height:', currentBlockHeight, ':', progress, '%')

    pubsub.publish('action', {
      type: 'syncing',
      payload: JSON.stringify({ currentBlockHeight, progress })
    })
    await new Promise(resolve => setTimeout(resolve, 3000))
    await waitUntilSynced()
  } else return
}

async function startDataService() {
  await db.bulkSave('Validator', await getValidators())

  let firstBlock = await db.getFirstHeader()

  if (firstBlock) {
    firstSavedBlock = {
      number: firstBlock.id,
      hash: firstBlock.blockHash,
      timestamp: firstBlock.timestamp
    }

    let lastBlock = await db.getLastHeader()
    lastSavedBlock = {
      number: lastBlock.id,
      hash: lastBlock.blockHash,
      timestamp: lastBlock.timestamp
    }
  } else {
    let lastBlockNumber = (await api.rpc.chain.getHeader()).number.toNumber()
    let blockData = await getBlockHeader(lastBlockNumber)
    firstSavedBlock = { ...blockData }
    lastSavedBlock = { ...blockData }
  }

  getHeaderDataHistory()

  notifications.init()
  watcher.init()

  await subscribeEvents()
  await subscribeHeaders()

  return
}

async function addDerivedHeartbeatsToValidators(validators: Validator[]) {
  let onlineStatus = await api.derive.imOnline.receivedHeartbeats()

  return validators.map(validator => {
    let recentlyOnline = false

    if (onlineStatus[validator.accountId])
      recentlyOnline = onlineStatus[validator.accountId].isOnline

    return { ...validator, recentlyOnline }
  })
}

export default {
  connect,
  getValidators,
  getNodeInfo: connector.getNodeInfo,
  addDerivedHeartbeatsToValidators
}
