import gql from 'graphql-tag'

export default gql`
  mutation Connect($nodeUrl: String!) {
    connect(nodeUrl: $nodeUrl)
  }
`
