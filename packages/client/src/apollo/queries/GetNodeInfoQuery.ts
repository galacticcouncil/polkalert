import gql from 'graphql-tag'

export default gql`
  query GetNodeInfo {
    nodeInfo {
      chain
      nodeUrl
    }
  }
`
