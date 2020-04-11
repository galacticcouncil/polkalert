// import { DerivedStakingQuery } from '@polkadot/api-derive/types'
// import { HeaderExtended } from '@polkadot/api-derive/type'

declare type EnhancedDerivedStakingQuery = import('@polkadot/api-derive/types').DeriveStakingQuery & {
  eraIndex: number
  sessionIndex: number
}

declare interface BlockInfo {
  number: number
  hash: string
  timestamp: number
}

declare interface EventSlash {
  accountId: string
  amount: string
}

declare interface EventReward {
  amount: string
}

declare interface EventOffence {
  kind: string
  timeSlot: string
}

declare interface EnhancedHeader {
  author: string
  number: number
  hash: string
  timestamp: number
  sessionInfo: HeaderSessionInfo
}

declare interface HeaderSessionInfo {
  sessionIndex: number
  eraIndex: number
  slashes?: EventSlash[]
  rewards?: EventReward[]
  offences?: EventOffence[]
}
