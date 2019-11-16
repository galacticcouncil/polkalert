import gql from 'graphql-tag'

export default gql`
  mutation ConnectionMutation($nodeUrl: String!) {
    connection(nodeUrl: $nodeUrl)
  }
`
