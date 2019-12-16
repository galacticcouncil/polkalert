import db from '../db'
import connector from './connector'
import { ApiPromise } from '@polkadot/api'
import { formatBalance } from '@polkadot/util'
import { isNullOrUndefined } from 'util'
import { Vec } from '@polkadot/types'
import { DerivedStakingQuery } from '@polkadot/api-derive/types'
import { ValidatorId, EventRecord } from '@polkadot/types/interfaces'
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

let maxHeaderBatch = 100
let maxBlockHistory = 15000

let api: ApiPromise | null = null
let sessionInfo: SessionInfo = null
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
      let slashes: EventSlash[] = []
      let rewards: EventReward[] = []
      let offences: EventOffence[] = []
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
          slashes = [
            ...slashes,
            {
              accountId: api.createType('AccountId', event.data[0]).toString(),
              amount: formatBalance(api.createType('Balance', event.data[1]))
            }
          ]
        }
        if (event.method === 'Reward') {
          rewards = [
            ...rewards,
            {
              amount: formatBalance(api.createType('Balance', event.data[0]))
            }
          ]
        }
        if (event.method === 'Offence') {
          offences = [
            ...offences,
            {
              kind: api.createType('Kind', event.data[0]).toString(),
              timeSlot: api
                .createType('OpaqueTimeSlot', event.data[1])
                .toString()
            }
          ]
        }
      }

      if (sessionInfo)
        sessionInfo = { ...sessionInfo, rewards, offences, slashes }

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

async function getDerivedStaking(accounts: Vec<ValidatorId>) {
  const derivedStakingRequests: Promise<DerivedStakingQuery>[] = accounts.map(
    account => {
      return api.derive.staking.query(account)
    }
  )

  return await Promise.all(derivedStakingRequests)
}

async function subscribeEvents() {
  const unsubscribe = await api.query.system.events(async events => {
    events.forEach(async record => {
      const { event } = record

      if (event.method === 'Reward') {
        console.log('Session #', sessionInfo.sessionIndex, ' ended')
        console.log(
          'validators were rewarded:',
          formatBalance(api.createType('Balance', event.data[0]))
        )
      }

      if (event.method === 'NewSession') {
        console.log('new session #:', event.data[0].toString())
        await updateSessionInfo()
        console.log(JSON.stringify(sessionInfo, null, 1))
      }

      if (event.method === 'Slash') {
        console.log(
          'validator #',
          event.data[0].toString(),
          'was slashed: ',
          event.data[1].toString()
        )
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
    let enhancedHeader = (await getBlockHeaders([number]))[0]
    watcher.ping(enhancedHeader.timestamp)

    console.log('new header #:', number, 'with hash:', hash)

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

    //we got duplicate blocks, first received block is saved right now
    if (missing < 0) {
      let duplicateHeaders = missing * -1
      console.log(duplicateHeaders, 'duplicate headers found')
      return
    }

    await db.saveHeader(enhancedHeader)

    return
  })

  connector.addSubscription(unsubscribe)
  return
}

async function getValidators(at?: string) {
  console.log('getting validators for', at ? 'block ' + at : 'current era')

  const validators = at
    ? await api.query.session.validators.at(at)
    : await api.query.session.validators()

  const validatorInfo = await getDerivedStaking(validators)
  let eraIndex = sessionInfo.eraIndex
  let sessionIndex = sessionInfo.sessionIndex
  let enhancedValidatorInfo: EnhancedDerivedStakingQuery[] = validatorInfo.map(
    validatorInfo => {
      return { ...validatorInfo, eraIndex, sessionIndex }
    }
  )

  return enhancedValidatorInfo
}

async function updateSessionInfo() {
  let [derivedSessionInfo, newEraIndex] = await Promise.all([
    api.derive.session.info(),
    api.query.staking.currentEra()
  ])

  sessionInfo = {
    eraIndex: newEraIndex.toNumber(),
    eraLength: derivedSessionInfo.eraLength.toNumber(),
    eraProgress: derivedSessionInfo.eraProgress.toNumber(),
    isEpoch: derivedSessionInfo.isEpoch,
    sessionIndex: derivedSessionInfo.currentIndex.toNumber(),
    sessionLength: derivedSessionInfo.sessionLength.toNumber(),
    sessionProgress: derivedSessionInfo.sessionProgress.toNumber(),
    sessionsPerEra: derivedSessionInfo.sessionsPerEra.toNumber()
  }

  console.log(sessionInfo)

  return sessionInfo
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

  let nodeInfo = connector.getNodeInfo()

  formatBalance.setDefaults({
    decimals: nodeInfo.tokenDecimals,
    unit: nodeInfo.tokenSymbol
  })

  let savedNodeInfo = await db.getNodeInfo()
  if (savedNodeInfo) {
    if (
      savedNodeInfo.genesisHash !== nodeInfo.genesisHash ||
      savedNodeInfo.implementationName !== nodeInfo.implementationName ||
      savedNodeInfo.specName !== nodeInfo.specName
    ) {
      console.log('Chain switched, clearing database...')
      await db.clearDB()
    }
  }

  await db.setNodeInfo(nodeInfo)

  await waitUntilSynced()
  startDataService()

  return nodeUrl
}

async function waitUntilSynced() {
  const health = await api.rpc.system.health()
  if (health.isSyncing.toString() === 'true') {
    console.log('Node is syncing, waiting to finish')
    console.log(
      'Current block height:',
      (await api.rpc.chain.getHeader()).number.toNumber()
    )
    await new Promise(resolve => setTimeout(resolve, 3000))
    await waitUntilSynced()
  } else return
}

async function startDataService() {
  await updateSessionInfo()
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
    let firstBlockData = (await getBlockHeaders([lastBlockNumber]))[0]
    if (firstBlockData) {
      firstSavedBlock = {
        number: firstBlockData.number,
        hash: firstBlockData.hash,
        timestamp: firstBlockData.timestamp
      }

      lastSavedBlock = { ...firstSavedBlock }
    }
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
