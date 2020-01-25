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
let apiCreatorPromise: Promise<ApiPromise> = null
let resolveApi: Function = null
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

  console.log('Disconnecting API')

  if (subscriptions.length) {
    subscriptions.forEach(async unsubscribe => await unsubscribe())
    subscriptions = []
  }

  if (apiCreatorPromise) {
    resolveApi(null)
    resolveApi = null
    apiCreatorPromise = null
  }

  if (api) {
    await api.disconnect()
    provider = null
  }

  try {
    await provider.disconnect()
  } catch (e) {}

  api = null
  provider = null
  nodeInfo = null
  subscriptions = []

  return
}

async function handleError(e: Error) {
  logger.error('Node connection error', e)
  pubsub.publish('action', 'disconnect')

  disconnect()
  return
}

async function connect() {
  await disconnect()

  provider = new WsProvider(nodeUrl)
  provider.on('error', handleError)

  console.log('creating api')

  // BUG API Promise doesn't finish if provider crashes on connection
  apiCreatorPromise = new Promise(async resolve => {
    resolveApi = resolve

    const apiObject = await ApiPromise.create({
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
      pubsub.publish('action', 'disconnect')
      return null
    })

    return resolve(apiObject)
  })

  api = await apiCreatorPromise

  if (!api) {
    pubsub.publish('action', 'disconnect')
    return null
  }

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
      await db.clearDB()
    }
  }

  await db.setNodeInfo(nodeInfo)
  console.log('Connected to:')
  console.log(nodeInfo)

  return api
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
