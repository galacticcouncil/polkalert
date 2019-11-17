import gql from 'graphql-tag'

export default gql`
  query GetSettingsQuery {
    settings {
      serverPort
      emailPort
      emailHost
      emailUsername
      emailPassword
    }
  }
`
