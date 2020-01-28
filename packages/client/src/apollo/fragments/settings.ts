import gql from 'graphql-tag'

export default gql`
  fragment SettingsFragment on Settings {
    blockReceivedLagNotificationDelay
    noBlocksReceivedNotificationDelay
    notFinalizingNotificationDelay
    serverPort
    emailNotifications
    emailFrom
    emailPort
    emailHost
    emailRecipient
    emailUsername
    emailPassword
    webHooks
    maxDataAge
    validatorId
  }
`
