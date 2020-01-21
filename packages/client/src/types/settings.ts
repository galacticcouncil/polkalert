export interface NotificationSettingsInterface {
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
  validatorId: string
}

export interface ApplicationSettingsInterface {
  maxDataAge: string
}
