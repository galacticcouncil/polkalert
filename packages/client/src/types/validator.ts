export interface CommissionDataInterface {
  controllerId: string
  bondedSelf: string
  nominatorData: string
  commission: string
  sessionId: string
}

export interface BlockInterface {
  id: string
  blockHash: string
}

export interface ValidatorInterface {
  accountId: string
  commissionData: CommissionDataInterface[]
  blocksProduced: BlockInterface[]
  slashes: string[]
  recentlyOnline: boolean
}
