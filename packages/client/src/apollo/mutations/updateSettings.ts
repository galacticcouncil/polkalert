import gql from 'graphql-tag'

import settingsFragment from 'apollo/fragments/settings'

export default gql`
  mutation UpdateSettings(
    $blockReceivedLagNotificationDelay: Int
    $noBlocksReceivedNotificationDelay: Int
    $serverPort: Int
    $emailNotifications: Boolean
    $emailPort: Int
    $emailHost: String
    $emailRecipient: String
    $emailUsername: String
    $emailPassword: String
    $webHooks: [String]
    $maxDataAge: Float
    $validatorId: String
  ) {
    updateSettings(
      blockReceivedLagNotificationDelay: $blockReceivedLagNotificationDelay
      noBlocksReceivedNotificationDelay: $noBlocksReceivedNotificationDelay
      serverPort: $serverPort
      emailNotifications: $emailNotifications
      emailPort: $emailPort
      emailHost: $emailHost
      emailRecipient: $emailRecipient
      emailUsername: $emailUsername
      emailPassword: $emailPassword
      webHooks: $webHooks
      maxDataAge: $maxDataAge
      validatorId: $validatorId
    ) {
      ...SettingsFragment
    }
  }
  ${settingsFragment}
`
