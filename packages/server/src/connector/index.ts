import { pubsub } from '../api'
import { ApiPromise, WsProvider } from '@polkadot/api'
import scraper from '../scraper'

import { IdentityTypes } from 'edgeware-node-types/dist/identity'
import { SignalingTypes } from 'edgeware-node-types/dist/signaling'
import { TreasuryRewardTypes } from 'edgeware-node-types/dist/treasuryReward'
import { VotingTypes } from 'edgeware-node-types/dist/voting'
import db from '../db'
import logger from '../logger'
import eventEmitter from '../events'
import { createNodeInfo, getSyncProgress } from './helpers'

let _nodeUrl: string = null
let _reconnect: boolean = false

let reconnectTimeout: NodeJS.Timeout = null
let reconnectTime: number = 3000

let nodeInfo: NodeInfo = null
let provider: WsProvider = null
let api: ApiPromise = null
let apiCreatePromise: Promise<ApiPromise> = null
let resolveApi: Function = null
let rejectApi: Function = null
let subscriptions: Function[] = []

function setNodeUrl(nodeUrl: string) {
  console.log('setting url:', nodeUrl)
  _nodeUrl = nodeUrl
  return nodeUrl
}

function getNodeInfo() {
  return nodeInfo
}

async function connect(autoConnect: boolean = false) {
  //if we're connecting to another node before we connected to first one, disconnect
  if (apiCreatePromise || api || provider) await disconnect()

  if (autoConnect) _reconnect = true

  //API Promise doesn't finish if provider crashes on connection,
  //we need to handle it after connection has been made
  apiCreatePromise = new Promise(async (resolve, reject) => {
    resolveApi = resolve
    rejectApi = reject

    provider = new WsProvider(_nodeUrl, false)
    subscriptions.push(provider.on('error', handleError))
    subscriptions.push(provider.on('disconnected', handleError))
    subscriptions.push(provider.on('connected', createApi))
    provider.connect()
  })

  api = await apiCreatePromise

  if (!api) throw new Error('Cannot connect to API')

  // successfully connected, reconnect if something happens from this point on
  _reconnect = true

  await waitUntilSynced()

  //wait until we successfully scrape first data and save node info
  await db.setNodeInfo(nodeInfo)
  await scraper.init(api)

  return nodeInfo.nodeUrl
}

async function disconnect(clearSettings = false) {
  // test if api is connected, if not, check if provider exists and disconnect.
  // api crashes on disconnect if provider was disconnected first.

  // if clear settings is present, disconnect remove node settings
  if (clearSettings) {
    if (apiCreatePromise) rejectApi()

    _reconnect = false
    _nodeUrl = null
  }

  if (subscriptions.length) {
    subscriptions.forEach(async unsubscribe => await unsubscribe())
    subscriptions = []
  }

  // don't disconnect if node already disconnected
  if (!api && !provider && !subscriptions.length) return

  if (!_reconnect) {
    console.log('Disconnecting API')
  }

  //disconnect will crash if provider was disconnected before api
  //we don't need to do anything when it does
  if (api) {
    try {
      api.disconnect()
    } catch (e) {}
    provider = null
  }

  //disconnect will crash if provider is already disconnected
  //we don't need to do anything when it does
  if (provider) {
    try {
      provider.disconnect()
    } catch (e) {}
  }

  api = null
  provider = null
  nodeInfo = null

  eventEmitter.emit('disconnected')
  pubsub.publish('action', 'disconnected')

  return
}

async function handleError(e?: Error) {
  //log error and propagate notifications
  if (e) {
    if (reconnectTimeout) {
      console.log('API Error, reconnecting...')
    } else {
      logger.error('Node connection error', e)
    }
  }

  //if we're connecting, reject the promise
  if (apiCreatePromise) {
    rejectApi()

    rejectApi = null
    resolveApi = null
    apiCreatePromise = null
  }

  await disconnect()

  if (_reconnect) {
    await reconnect()
  }

  return
}

async function reconnect() {
  clearTimeout(reconnectTimeout)

  await new Promise(
    resolve => (reconnectTimeout = setTimeout(resolve, reconnectTime))
  )

  await connect().catch(e => {
    reconnect()
  })
}

async function waitUntilSynced() {
  const health = await api.rpc.system.health()
  if (health.isSyncing.toString() === 'true') {
    const progress = await getSyncProgress(api)
    pubsub.publish('action', {
      type: 'syncing',
      payload: progress
    })

    await new Promise(resolve => setTimeout(resolve, 3000))
    await waitUntilSynced()
  } else return
}

async function createApi() {
  console.log('creating api')

  api = await ApiPromise.create({
    typesSpec: {
      edgeware: {
        ...IdentityTypes,
        ...SignalingTypes,
        ...TreasuryRewardTypes,
        ...VotingTypes
      }
    },
    provider: provider
  }).catch(e => {
    logger.error('Error creating api', e)
    handleError(e)

    return null
  })

  if (!api) return

  console.log('API connected')

  nodeInfo = await createNodeInfo(api, _nodeUrl)

  const savedNodeInfo = await db.getNodeInfo()
  if (savedNodeInfo) {
    console.log('Got old node info for', savedNodeInfo.chain)
    if (
      savedNodeInfo.genesisHash !== nodeInfo.genesisHash ||
      savedNodeInfo.implementationName !== nodeInfo.implementationName ||
      savedNodeInfo.specName !== nodeInfo.specName ||
      savedNodeInfo.chain !== nodeInfo.chain
    ) {
      console.log('Chain switched, clearing database...')
      await db.clearDB()
    }
  }

  console.log('Connected to:')
  console.log(nodeInfo)

  resolveApi(api)

  apiCreatePromise = null
  rejectApi = null
  resolveApi = null

  return
}

function getApi() {
  return api
}

function addSubscription(unsubscribe: Function) {
  subscriptions.push(unsubscribe)
}

export default {
  connect,
  setNodeUrl,
  getApi,
  disconnect,
  getNodeInfo,
  addSubscription
}
