import gql from 'graphql-tag'

export default gql`
  query GetValidators {
    validators {
      accountId
      commissionData {
        controllerId
        bondedSelf
        nominatorData
        commission
        sessionId
      }
      blocksProduced {
        id
        blockHash
      }
      slashes
      recentlyOnline
    }
  }
`
