import gql from 'graphql-tag'

export default gql`
  fragment SettingsFragment on Settings {
    blockReceivedLagNotificationDelay
    noBlocksReceivedNotificationDelay
    serverPort
    emailNotifications
    emailPort
    emailHost
    emailRecipient
    emailUsername
    emailPassword
    webHooks
  }
`
