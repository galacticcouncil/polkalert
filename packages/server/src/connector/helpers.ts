import { ApiPromise } from '@polkadot/api'
import U32 from '@polkadot/types/primitive/U32'
import addressDefaults from '@polkadot/util-crypto/address/defaults'

export const createNodeInfo = async (api: ApiPromise, nodeUrl: string) => {
  let [properties, chain, name, version] = await Promise.all([
    api.rpc.system.properties(),
    api.rpc.system.chain(),
    api.rpc.system.name(),
    api.rpc.system.version()
  ])

  return {
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
}

export const getSyncProgress = async (api: ApiPromise) => {
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
}

export default {
  createNodeInfo,
  getSyncProgress
}
