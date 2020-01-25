import gql from 'graphql-tag'

export default gql`
  fragment SettingsFragment on Settings {
    blockReceivedLagNotificationDelay
    noBlocksReceivedNotificationDelay
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
