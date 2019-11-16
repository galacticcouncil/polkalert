import gql from 'graphql-tag'

export default gql`
  mutation UpdateSettingsMutation(
    $serverPort: Int
    $emailPort: Int
    $emailHost: String
    $emailUsername: String
    $emailPassword: String
  ) {
    updateSettings(
      serverPort: $serverPort
      emailPort: $emailPort
      emailHost: $emailHost
      emailUsername: $emailUsername
      emailPassword: $emailPassword
    )
  }
`
