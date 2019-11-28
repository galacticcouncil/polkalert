export interface SettingsInterface {
  serverPort: number
  blockTimeNotificationRatio: number
  emailNotifications: boolean
  emailPort: number
  emailHost: string
  emailRecipient: string
  emailUsername: string
  emailPassword: string
  webHooks: string[]
}
