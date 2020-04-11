import { ApiPromise } from '@polkadot/api'
import { formatBalance } from '@polkadot/util'

import notifications from '../notifications'
import watcher from '../watcher'
import settings from '../settings'
import connector from '../connector'
import db from '../db'

import { analyzeExtrinsics, testEquivocation } from './analyzer'
import { getBlockHeader, getPreviousHeaders, getValidators } from './getter'

let api: ApiPromise = null
let firstSavedBlock: BlockInfo = null
let lastSavedBlock: BlockInfo = null

let maxBlockHistory = 15000
const headerCache: { [key: number]: EnhancedHeader } = {}

async function subscribeEvents() {
  const unsubscribe = await api.query.system.events(async (events) => {
    events.forEach(async (record) => {
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
          .forEach((identificationTuple) => {
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
}

async function subscribeFinalizedHeaders() {
  const unsubscribe = await api.rpc.chain.subscribeFinalizedHeads(
    async (header) => {
      let hash = header.hash.toString()
      let number = header.number.toNumber()
      let missing = 0
      let enhancedHeader = await getBlockHeader(api, number)

      if (!firstSavedBlock.number)
        firstSavedBlock = { number, hash, timestamp: enhancedHeader.timestamp }

      missing = lastSavedBlock.number
        ? number - lastSavedBlock.number - 1
        : number - firstSavedBlock.number

      lastSavedBlock = { number, hash, timestamp: enhancedHeader.timestamp }

      //GET Missing blocks, TODO: this could make hole in the data if missing
      //server is turned off while getting missing blocks

      console.log('finalized header #:', number, 'with hash:', hash)

      if (headerCache[number]) {
        if (settings.get().validatorId === enhancedHeader.author)
          testEquivocation(headerCache[number], enhancedHeader)

        headerCache[number] = null
        delete headerCache[number]
      }

      if (missing > 0) {
        console.log('missing', missing, 'headers')
        let missingHeaders = await getPreviousHeaders(
          api,
          missing,
          lastSavedBlock.number
        )

        await db.bulkSave('Header', missingHeaders)
      }

      await db.saveHeader(enhancedHeader)
    }
  )

  connector.addSubscription(unsubscribe)
}

async function subscribeHeaders() {
  const unsubscribe = await api.rpc.chain.subscribeNewHeads(async (header) => {
    let hash = header.hash.toString()
    let number = header.number.toNumber()
    let enhancedHeader = await getBlockHeader(api, number)
    let finalizedHash = await api.rpc.chain.getFinalizedHead()

    analyzeExtrinsics(api, hash)

    watcher.ping(enhancedHeader.timestamp, finalizedHash.toString())

    if (headerCache[number]) {
      if (settings.get().validatorId === enhancedHeader.author)
        testEquivocation(headerCache[number], enhancedHeader)

      console.log(
        `fork detected, at: ${number} with hashes: ${hash} and ${headerCache[number].hash}`
      )
    } else {
      headerCache[number] = enhancedHeader
    }
  })

  connector.addSubscription(unsubscribe)
}

async function getSessionInfo(): Promise<SessionInfo> {
  let [derivedSessionInfo, newEraIndex] = await Promise.all([
    api.derive.session.info(),
    api.query.staking.currentEra(),
  ])

  let derivedSessionProgress = await api.derive.session.progress()

  console.log(
    'SESSION INFO=',
    derivedSessionInfo,
    newEraIndex,
    derivedSessionProgress
  )

  return {
    eraIndex: newEraIndex.unwrap().toNumber(),
    eraLength: derivedSessionInfo.eraLength.toNumber(),
    eraProgress: derivedSessionProgress.eraProgress.toNumber(),
    isEpoch: derivedSessionInfo.isEpoch,
    sessionIndex: derivedSessionInfo.currentIndex.toNumber(),
    sessionLength: derivedSessionInfo.sessionLength.toNumber(),
    sessionProgress: derivedSessionProgress.sessionProgress.toNumber(),
    sessionsPerEra: derivedSessionInfo.sessionsPerEra.toNumber(),
  }
}

async function getHeaderDataHistory() {
  let lastBlockHash = await api.rpc.chain.getFinalizedHead()
  let lastBlockNumber = (
    await api.rpc.chain.getHeader(lastBlockHash)
  ).number.toNumber()

  let firstBlock = firstSavedBlock.number

  let expectedBlockTime = api.consts.babe.expectedBlockTime.toNumber()
  maxBlockHistory = (settings.get().maxDataAge * 3600000) / expectedBlockTime

  if (lastBlockNumber - firstBlock < maxBlockHistory) {
    let headers = await getPreviousHeaders(
      api,
      maxBlockHistory - (lastBlockNumber - firstBlock),
      firstBlock
    )

    if (headers.length) {
      let firstHeader = headers[headers.length - 1]

      if (firstHeader.number < firstSavedBlock.number)
        firstSavedBlock = {
          hash: firstHeader.hash,
          number: firstHeader.number,
          timestamp: firstHeader.timestamp,
        }
    }

    await db.bulkSave('Header', headers)
  }
}

async function init(apiObject: ApiPromise) {
  api = apiObject
  firstSavedBlock = {
    number: null,
    hash: null,
    timestamp: null,
  }

  lastSavedBlock = {
    number: null,
    hash: null,
    timestamp: null,
  }

  await db.bulkSave('Validator', await getValidators(api))

  let firstBlock = await db.getFirstHeader()

  if (firstBlock) {
    firstSavedBlock = {
      number: firstBlock.id,
      hash: firstBlock.blockHash,
      timestamp: firstBlock.timestamp,
    }

    let lastBlock = await db.getLastHeader()
    lastSavedBlock = {
      number: lastBlock.id,
      hash: lastBlock.blockHash,
      timestamp: lastBlock.timestamp,
    }
  } else {
    let lastBlockHash = await api.rpc.chain.getFinalizedHead()
    let lastBlockNumber = (
      await api.rpc.chain.getHeader(lastBlockHash)
    ).number.toNumber()
    let blockData = await getBlockHeader(api, lastBlockNumber)
    firstSavedBlock = { ...blockData }
    lastSavedBlock = { ...blockData }
  }

  getHeaderDataHistory()

  notifications.init()
  watcher.init()

  subscribeEvents()
  subscribeFinalizedHeaders()
  subscribeHeaders()

  return
}

export default { init, getValidators }
