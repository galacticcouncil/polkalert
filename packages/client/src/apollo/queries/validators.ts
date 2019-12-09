import gql from 'graphql-tag'

export default gql`
  query Validators {
    validators {
      accountId
      commissionData {
        controllerId
        bondedSelf
        nominatorData
        commission
        sessionId
      }
      currentValidator
      blocksProduced {
        id
        blockHash
      }
      slashes {
        amount
        sessionIndex
      }
      recentlyOnline
    }
  }
`
