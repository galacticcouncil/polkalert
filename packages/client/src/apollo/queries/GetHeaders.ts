import gql from 'graphql-tag'

export default gql`
  query GetHeaders {
    headers {
      id
      blockHash
      author
    }
  }
`