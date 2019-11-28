import gql from 'graphql-tag'

export default gql`
  mutation UpdateSettingsMutation(
    $serverPort: Int
    $blockTimeNotificationRatio: Int
    $emailNotifications: Boolean
    $emailPort: Int
    $emailHost: String
    $emailRecipient: String
    $emailUsername: String
    $emailPassword: String
    $webHooks: [String]
  ) {
    updateSettings(
      serverPort: $serverPort
      blockTimeNotificationRatio: $blockTimeNotificationRatio
      emailNotifications: $emailNotifications
      emailPort: $emailPort
      emailHost: $emailHost
      emailRecipient: $emailRecipient
      emailUsername: $emailUsername
      emailPassword: $emailPassword
      webHooks: $webHooks
    )
  }
`
