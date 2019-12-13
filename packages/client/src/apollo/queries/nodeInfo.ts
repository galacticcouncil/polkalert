import gql from 'graphql-tag'

export default gql`
  query NodeInfo {
    nodeInfo {
      chain
      nodeUrl
    }
  }
`
