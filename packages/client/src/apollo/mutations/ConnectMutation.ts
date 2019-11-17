import gql from 'graphql-tag'

export default gql`
  mutation ConnectMutation($nodeUrl: String!) {
    connect(nodeUrl: $nodeUrl)
  }
`
