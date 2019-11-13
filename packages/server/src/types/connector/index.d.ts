declare type SessionInfo = {
  eraIndex: number
  eraLength: number
  eraProgress: number
  isEpoch: boolean
  lastEraLengthChange: number
  lastSessionLengthChange: number
  sessionIndex: number
  sessionLength: number
  sessionProgress: number
  sessionsPerEra: number
}

declare type EnhancedSlash = {
  amount: string
  who: string
}

declare type BlockInfo = {
  number: number
  hash: string
  timestamp: number
}
