import { DerivedStakingQuery } from '@polkadot/api-derive/types'
import { HeaderExtended } from '@polkadot/api-derive/type'

export declare type SessionInfo = {
  eraIndex: number
  eraLength?: number
  eraProgress?: number
  isEpoch?: boolean
  sessionIndex: number
  sessionLength?: number
  sessionProgress?: number
  sessionsPerEra?: number
}

export declare type EnhancedSlash = {
  amount: string
  who: string
}

export declare type BlockInfo = {
  number: number
  hash: string
  timestamp: number
}

export interface EnhancedDerivedStakingQuery extends DerivedStakingQuery {
  eraIndex: number
  sessionIndex: number
}

export interface EventSlash {
  accountId: string
  amount: string
}

export interface EventReward {
  amount: string
}

export interface EventOffence {
  kind: string
  timeSlot: string
}

export interface HeaderSessionInfo {
  sessionIndex: number
  eraIndex: number
  slashes?: EventSlash[]
  rewards?: EventReward[]
  offences?: EventOffence[]
}

export interface EnhancedHeader {
  author: string
  number: number
  hash: string
  timestamp: number
  sessionInfo: HeaderSessionInfo
}
