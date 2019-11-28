import gql from 'graphql-tag'

export default gql`
  query GetSettingsQuery {
    settings {
      serverPort
      blockTimeNotificationRatio
      emailNotifications
      emailPort
      emailHost
      emailRecipient
      emailUsername
      emailPassword
      webHooks
    }
  }
`
