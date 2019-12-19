import gql from 'graphql-tag'

export default gql`
  query ValidatorInfo($accountId: String!) {
    validator(accountId: $accountId) {
      commissionData {
        sessionIds
        nextSessionIds
      }
      blocksProduced {
        timestamp
        blockHash
      }
      slashes {
        amount
        sessionIndex
      }
    }
  }
`
