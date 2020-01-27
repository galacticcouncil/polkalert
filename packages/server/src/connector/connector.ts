import { ApiPromise, WsProvider } from '@polkadot/api'
import U32 from '@polkadot/types/primitive/U32'
import addressDefaults from '@polkadot/util-crypto/address/defaults'
import { IdentityTypes } from 'edgeware-node-types/dist/identity'
import { SignalingTypes } from 'edgeware-node-types/dist/signaling'
import { TreasuryRewardTypes } from 'edgeware-node-types/dist/treasuryReward'
import { VotingTypes } from 'edgeware-node-types/dist/voting'
import db from '../db'
import logger from '../logger'
import { pubsub } from '../api'

let nodeUrl: string = null
let nodeInfo: NodeInfo = null
let provider: WsProvider = null
let api: ApiPromise = null
let apiCreatePromise: Promise<ApiPromise> = null
let resolveApi: Function = null
let rejectApi: Function = null
let subscriptions: Function[] = []

function setNodeUrl(newNodeUrl: string) {
  console.log('setting url:', newNodeUrl)
  nodeUrl = newNodeUrl
  return nodeUrl
}

function getNodeInfo() {
  return nodeInfo
}

async function disconnect() {
  // test if api is connected, if not, check if provider exists and disconnect.
  // api crashes on disconnect if provider was disconnected first.
  if (!api && !provider && !subscriptions.length) return

  console.log('Disconnecting API')

  if (subscriptions.length) {
    subscriptions.forEach(async unsubscribe => await unsubscribe())
    subscriptions = []
  }

  if (api) {
    api.disconnect()
    provider = null
  }

  if (provider) {
    //disconnect will crash if provider is already disconnected
    //we don't need to do anything when it does
    try {
      provider.disconnect()
    } catch (e) {}
  }

  api = null
  provider = null
  nodeInfo = null

  pubsub.publish('action', 'disconnect')

  return
}

async function handleError(e: Error) {
  //log error and propagate notifications
  if (e) {
    logger.error('Node connection error', e)
  }

  //if we're connecting, reject the promise
  if (apiCreatePromise) {
    rejectApi(e)

    rejectApi = null
    resolveApi = null
    apiCreatePromise = null
  }

  disconnect()
  return
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

  let [properties, chain, name, version] = await Promise.all([
    api.rpc.system.properties(),
    api.rpc.system.chain(),
    api.rpc.system.name(),
    api.rpc.system.version()
  ])

  nodeInfo = {
    chain: chain.toString(),
    genesisHash: api.genesisHash.toString(),
    implementationName: api.runtimeVersion.implName.toString(),
    implementationVersion: api.runtimeVersion.implVersion.toNumber(),
    metadataVersion: api.runtimeMetadata.version,
    nodeUrl: nodeUrl,
    specName: api.runtimeVersion.specName.toString(),
    specVersion: api.runtimeVersion.specVersion.toNumber(),
    ss58Format: properties.ss58Format
      .unwrapOr(new U32(api.registry, addressDefaults.prefix))
      .toNumber(),
    systemName: name.toString(),
    systemVersion: version.toString(),
    tokenDecimals: properties.tokenDecimals
      .unwrapOr(new U32(api.registry, 12))
      .toNumber(),
    tokenSymbol: properties.tokenSymbol.unwrapOr('DEV').toString()
  }

  const savedNodeInfo = await db.getNodeInfo()
  if (savedNodeInfo) {
    if (
      savedNodeInfo.genesisHash !== nodeInfo.genesisHash ||
      savedNodeInfo.implementationName !== nodeInfo.implementationName ||
      savedNodeInfo.specName !== nodeInfo.specName
    ) {
      console.log('Chain switched, clearing database...')
      await db.init(true)
    }
  }

  await db.setNodeInfo(nodeInfo)
  console.log('Connected to:')
  console.log(nodeInfo)

  resolveApi(api)

  apiCreatePromise = null
  rejectApi = null
  resolveApi = null

  return
}

async function connect() {
  //if we're connecting to another node before we connected to first one, disconnect
  if (apiCreatePromise || api || provider) await disconnect()

  //API Promise doesn't finish if provider crashes on connection,
  //we need to handle it after connection has been made
  apiCreatePromise = new Promise(async (resolve, reject) => {
    resolveApi = resolve
    rejectApi = reject

    provider = new WsProvider(nodeUrl, false)
    provider.on('error', handleError)
    provider.on('disconnected', handleError)
    provider.on('connected', createApi)
    provider.connect()
  })

  return apiCreatePromise
}

function addSubscription(unsubscribe: Function) {
  subscriptions.push(unsubscribe)
}

export default {
  addSubscription,
  connect,
  disconnect,
  setNodeUrl,
  getNodeInfo
}
