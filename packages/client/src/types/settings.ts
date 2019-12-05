export interface SettingsInterface {
  blockReceivedLagNotificationDelay: number
  noBlocksReceivedNotificationDelay: number
  serverPort: number
  emailNotifications: boolean
  emailPort: number
  emailHost: string
  emailRecipient: string
  emailUsername: string
  emailPassword: string
  webHooks: string[]
}
