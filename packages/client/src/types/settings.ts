export interface SettingsInterface {
  blockReceivedLagNotificationDelay: string
  noBlocksReceivedNotificationDelay: string
  serverPort: string
  emailNotifications: boolean
  emailPort: string
  emailHost: string
  emailRecipient: string
  emailUsername: string
  emailPassword: string
  webHooks?: string[]
}
