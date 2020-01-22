declare type NodeInfo = {
  chain: string
  genesisHash: string
  implementationName: string
  implementationVersion: number
  metadataVersion: number
  nodeUrl: string
  specName: string
  specVersion: number
  ss58Format: number
  systemName: string
  systemVersion: string
  tokenDecimals: number
  tokenSymbol: string
}

declare type Message = {
  id?: number
  content: string
  timestamp?: number
  title: string
  type: string
}
