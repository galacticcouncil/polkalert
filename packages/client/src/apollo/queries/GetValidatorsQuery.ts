import gql from 'graphql-tag'

export default gql`
  query GetValidatorsQuery {
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
