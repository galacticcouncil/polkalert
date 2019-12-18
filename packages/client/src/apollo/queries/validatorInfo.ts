import gql from 'graphql-tag'

export default gql`
  query ValidatorInfo($accountId: String!) {
    validator(accountId: $accountId) {
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
