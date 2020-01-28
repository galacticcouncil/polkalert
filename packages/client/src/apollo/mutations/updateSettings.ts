import gql from 'graphql-tag'

import settingsFragment from 'apollo/fragments/settings'

export default gql`
  mutation UpdateSettings(
    $blockReceivedLagNotificationDelay: Int
    $noBlocksReceivedNotificationDelay: Int
    $notFinalizingNotificationDelay: Int
    $serverPort: Int
    $emailNotifications: Boolean
    $emailFrom: String
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
      notFinalizingNotificationDelay: $notFinalizingNotificationDelay
      serverPort: $serverPort
      emailNotifications: $emailNotifications
      emailFrom: $emailFrom
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
