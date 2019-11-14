import db from '../db'
import connector from './connector'
import { ApiPromise } from '@polkadot/api'
import { formatBalance } from '@polkadot/util'
import { isNullOrUndefined } from 'util'
import { Vec } from '@polkadot/types'
import { DerivedStaking } from '@polkadot/api-derive/types'
import {
  ValidatorId,
  Moment,
  SlashJournalEntry
} from '@polkadot/types/interfaces'

let maxHeaderBatch = 250
let maxBlockHistory = 15000

let api: ApiPromise = null
let sessionInfo: SessionInfo = null
let eraIndex: number = null
let firstSavedBlock: BlockInfo = null
let lastSavedBlock: BlockInfo = null

async function getPreviousHeaders(
  numberOfHeaders: number,
  startFromBlock: number
) {
  let oldHeaders = []
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

async function getBlockHeaders(blockNumbers: Array<number>) {
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

  let enhancedHeaders = await Promise.all(
    blockHashes.map(blockHash =>
      api.derive.chain.getHeader(blockHash.toString()).catch(e => {
        console.log('Error getting block', blockHash.toJSON())
      })
    )
  )

  enhancedHeaders = enhancedHeaders.filter(header => (header ? true : false))

  let timestamps = api.createType(
    'Vec<Moment>',
    await Promise.all(
      enhancedHeaders.map(header => {
        if (header) return api.query.timestamp.now.at(header.hash)
        return null
      })
    )
  )
  enhancedHeaders = enhancedHeaders.map((header, index) => {
    header['timestamp'] = formatTimestamp(timestamps[index])
    return header
  })

  return enhancedHeaders
}

function formatTimestamp(timestamp: Moment) {
  if (timestamp && timestamp.toNumber) return timestamp.toNumber()
  return timestamp
}

async function getDerivedStaking(accounts: Vec<ValidatorId>) {
  const derivedStakingRequests: Promise<DerivedStaking>[] = accounts.map(
    account => {
      //TODO: BUG: when switching chains 1.x -> 2.x this crashes.
      return api.derive.staking.info(account.toJSON())
    }
  )

  return await Promise.all(derivedStakingRequests)
}

async function subscribeEvents() {
  const unsubscribe = await api.query.system.events(async eventsCodec => {
    let events = api.createType('Vec<EventRecord>', eventsCodec)
    events.forEach(async record => {
      // extract the phase, event and the event types
      const { event, phase } = record
      const types = event.typeDef

      if (event.method === 'Reward') {
        console.log('Era #', eraIndex, ' ended')
        console.log(
          'validators were rewarded:',
          formatBalance(api.createType('Balance', event.data[0]))
        )
      }

      if (event.method === 'NewSession') {
        console.log('new session #:', event.data[0].toString())
        await updateSessionInfo()
        await db.bulkSave('Validator', await getValidators())
        console.log(JSON.stringify(sessionInfo, null, 1))
      }

      //TODO: Save this?
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

    console.log('new header #:', number, 'with hash:', hash)

    if (!firstSavedBlock.number) {
      firstSavedBlock.number = number
      firstSavedBlock.hash = hash
      firstSavedBlock.timestamp = enhancedHeader['timestamp']
    }

    missing = lastSavedBlock.number
      ? number - lastSavedBlock.number - 1
      : number - firstSavedBlock.number

    lastSavedBlock.number = number
    lastSavedBlock.hash = hash
    lastSavedBlock.timestamp = enhancedHeader['timestamp']

    //GET Missing blocks, TODO: this could make hole in the data if missing blocks are pruned
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

    await db.save('Header', enhancedHeader)

    return
  })

  connector.addSubscription(unsubscribe)
  return
}

async function getValidators(at?: number) {
  console.log('getting validators for', at ? 'block ' + at : 'current era')
  let blockHash = lastSavedBlock.hash
  if (at) blockHash = (await api.rpc.chain.getBlockHash(at).catch()).toJSON()

  const validators = api.createType(
    'Vec<ValidatorId>',
    blockHash
      ? await api.query.session.validators.at(blockHash).catch()
      : await api.query.session.validators()
  )
  const validatorInfo = await getDerivedStaking(validators)
  let enhancedValidatorInfo = validatorInfo.map(validatorInfo => {
    validatorInfo['eraIndex'] = sessionInfo.eraIndex
    validatorInfo['sessionIndex'] = sessionInfo.sessionIndex
    return validatorInfo
  })

  return enhancedValidatorInfo
}

async function updateSessionInfo() {
  let [derivedSessionInfo, newEraIndex] = await Promise.all([
    api.derive.session.info(),
    api.query.staking.currentEra()
  ])

  sessionInfo = {
    eraIndex: api.createType('EraIndex', newEraIndex).toNumber(),
    eraLength: derivedSessionInfo.eraLength.toNumber(),
    eraProgress: derivedSessionInfo.eraProgress.toNumber(),
    isEpoch: derivedSessionInfo.isEpoch,
    lastEraLengthChange: derivedSessionInfo.lastEraLengthChange.toNumber(),
    lastSessionLengthChange: derivedSessionInfo.lastLengthChange.toNumber(),
    sessionIndex: derivedSessionInfo.currentIndex.toNumber(),
    sessionLength: derivedSessionInfo.sessionLength.toNumber(),
    sessionProgress: derivedSessionInfo.sessionProgress.toNumber(),
    sessionsPerEra: derivedSessionInfo.sessionsPerEra.toNumber()
  }

  if (!eraIndex) eraIndex = sessionInfo.eraIndex
  else if (eraIndex < sessionInfo.eraIndex) {
    eraIndex = sessionInfo.eraIndex
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

/*
  recursive function for getting headers
  eraOffset - how much we want to go into era history from current era
  sessionIndex - snapshot of current session variables
  lastBlockNumber - last block we got in previous iteration
*/
async function getAndSaveHeadersRecursive(
  sessionIndex,
  lastBlockNumber,
  eraOffset: number = 0
) {
  //block number of the beginning of era we want to fetch
  let eraStart =
    lastBlockNumber -
    sessionIndex.eraProgress -
    sessionIndex.eraLength * eraOffset

  //limit number of blocks we'll be getting
  if (lastBlockNumber - eraStart > maxBlockHistory)
    eraStart = lastBlockNumber - maxBlockHistory

  //number of headers we'll be getting in this era
  let numberOfHeaders = eraOffset
    ? sessionIndex.eraLength
    : firstSavedBlock.number - eraStart

  //last block number of the era we want to get
  let eraEnd = lastBlockNumber - sessionIndex.eraProgress * eraOffset
  let eraFetchEnd = eraEnd

  let headersTotal = 0

  console.log('Getting data history for era', sessionInfo.eraIndex - eraOffset)

  //check if first block is in this era
  if (firstSavedBlock.number < eraStart) {
    numberOfHeaders = 0
  }

  //check if the first saved block is in this range, TODO: make first block a param ?
  else if (firstSavedBlock.number < eraFetchEnd) {
    if (eraFetchEnd - firstSavedBlock.number > 0) {
      eraFetchEnd = firstSavedBlock.number
    }

    numberOfHeaders = firstSavedBlock.number - eraStart
  }

  /* DEBUG
  console.log({
    eraEnd,
    eraFetchEnd,
    eraStart,
    numberOfHeaders,
    lastBlockNumber,
    sessionIndex,
    eraOffset
  })
  */

  if (numberOfHeaders < 0) {
    numberOfHeaders = 0
  }

  //if eraIndex is 0 and we're not getting all the blocks soft launch was probably made, get all remaining blocks
  //TODO debug (missing blocks blocks on alexander at the start of each era)
  //TODO era length check and get new era info and new validators
  if (sessionIndex.eraIndex === 0 && eraStart > 0) {
    console.log(
      'Era 0 detected being longer than eraLength, assuming soft launch'
    )
    eraStart = lastBlockNumber - 1
    numberOfHeaders = eraStart
  }

  let headers = []
  //TODO Get staking reward for prev era + validator list for this era at this block
  //get slashing info at prev block?
  //let eraStartHash = await api.rpc.chain.getBlockHash(eraStart)

  if (numberOfHeaders > 0) {
    console.log('number of headers history to get', numberOfHeaders)

    db.bulkSave('Validator', await getValidators(eraEnd))

    headers = headers.concat(
      await getPreviousHeaders(numberOfHeaders, eraFetchEnd)
    )
    headers = headers.filter(header => !isNullOrUndefined(header))

    console.log('Got', headers.length, 'headers for era', eraIndex - eraOffset)
    await db.bulkSave('Header', headers)

    const firstBlock = headers[headers.length - 1]

    if (firstBlock && firstBlock.number < firstSavedBlock.number) {
      firstSavedBlock.number = firstBlock.number
      firstSavedBlock.hash = firstBlock.hash
      firstSavedBlock.timestamp = firstBlock.timestamp
    }
  } else {
    console.log('Data already saved, skipping...')
  }

  headersTotal = headers.length

  // if we got all the headers we sought to get, get headers of previous era
  if (
    numberOfHeaders === headers.length &&
    eraStart !== lastBlockNumber - maxBlockHistory
  )
    headersTotal =
      headersTotal +
      (await getAndSaveHeadersRecursive(
        sessionIndex,
        lastBlockNumber,
        eraOffset + 1
      ))

  return headersTotal
}

async function getHeaderDataHistory(currentSessionInfo) {
  let lastBlockNumber = api
    .createType('Header', await api.rpc.chain.getHeader())
    .number.toNumber()

  let headersTotal = await getAndSaveHeadersRecursive(
    currentSessionInfo,
    lastBlockNumber
  )

  console.log('Got data history of', headersTotal, 'headers')

  return
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

  startDataService()

  return nodeUrl
}

async function startDataService() {
  const currentSessionInfo = await updateSessionInfo()
  const validators = await getValidators()

  await db.bulkSave('Validator', validators)

  let firstBlock = await db.getFirstHeader()

  if (firstBlock) {
    firstSavedBlock.number = firstBlock.id
    firstSavedBlock.hash = firstBlock.blockHash
    firstSavedBlock.timestamp = firstBlock.timestamp

    let lastBlock = await db.getLastHeader()
    lastSavedBlock.number = lastBlock.id
    lastSavedBlock.hash = lastBlock.blockHash
    lastSavedBlock.timestamp = lastBlock.timestamp

    console.log('got blocks from db: ', firstBlock, '...', lastBlock)
  } else {
    let lastBlockNumber = (await api.rpc.chain.getHeader()).number.toNumber()
    let firstBlockData = (await getBlockHeaders([lastBlockNumber]))[0]
    if (firstBlockData) {
      firstSavedBlock.number = firstBlockData.number.toNumber()
      firstSavedBlock.hash = firstBlockData.hash.toString()
      firstSavedBlock.timestamp = firstBlockData['timestamp']

      lastSavedBlock = Object.assign({}, firstSavedBlock)
    }
  }

  getHeaderDataHistory(currentSessionInfo)

  await subscribeEvents()
  await subscribeHeaders()

  return
}

//TODO MOVE/REFACTOR
async function getEraSlashJournal(eraIndex: number): Promise<EnhancedSlash[]> {
  let slashJournal: Vec<SlashJournalEntry> = api.createType(
    'Vec<SlashJournalEntry>',
    await api.query.staking.eraSlashJournal(eraIndex)
  )

  let enhancedSlashes: EnhancedSlash[] = slashJournal.map(slash => {
    let enhancedSlash: EnhancedSlash = {
      amount: formatBalance(slash.amount),
      who: slash.who.toJSON()
    }
    return enhancedSlash
  })
  return enhancedSlashes
}

//TODO MOVE/REFACTOR
async function addDerivedHeartbeatsToValidators(validators) {
  let accountIds = validators.map(validator => validator.accountId)
  let onlineStatus = await api.derive.imOnline
    .receivedHeartbeats(accountIds)
    .catch(e => {
      console.log('Error getting heartbeats:', e)
    })

  return validators.map(validator => {
    if (onlineStatus[validator.accountId])
      validator.recentlyOnline = onlineStatus[validator.accountId].isOnline
    return validator
  })
}

export default {
  connect,
  getEraSlashJournal,
  //TODO refactor
  getNodeInfo: connector.getNodeInfo,
  addDerivedHeartbeatsToValidators
}
