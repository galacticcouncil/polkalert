import { ApiPromise, WsProvider } from '@polkadot/api'
import U32 from '@polkadot/types/primitive/U32'
import addressDefaults from '@polkadot/util-crypto/address/defaults'

let nodeUrl: string = null
let nodeInfo: NodeInfo = null
let provider: WsProvider = null
let api: ApiPromise = null
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

  if (subscriptions.length)
    subscriptions.forEach(async unsubscribe => await unsubscribe())

  if (api) {
    await api.disconnect()
    provider = null
  }

  if (provider && provider.isConnected()) await provider.disconnect()

  api = null
  provider = null
  nodeInfo = null
  subscriptions = []

  return
}

async function handleError() {
  console.error('Error connecting to: ', nodeUrl)
  disconnect()
  return
}

async function connect() {
  await disconnect()

  provider = new WsProvider(nodeUrl)

  // TODO Proper error handling
  provider.on('error', handleError)

  console.log('creating api')

  // BUG API Promise doesn't finish if provider crashes on connection
  api = await ApiPromise.create({ provider }).catch(e => {
    console.log(e)
    return null
  })

  if (!api) return null

  let [properties, chain, name, version] = await Promise.all([
    api.rpc.system.properties(),
    api.rpc.system.chain(),
    api.rpc.system.name(),
    api.rpc.system.version()
  ])

  // Got default info from https://github.com/polkadot-js/apps/blob/master/packages/react-api/src/Api.tsx

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
