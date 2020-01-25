export interface NotificationSettingsInterface {
  blockReceivedLagNotificationDelay: string
  noBlocksReceivedNotificationDelay: string
  notFinalizingNotificationDelay: string
  serverPort: string
  emailNotifications: boolean
  emailFrom: string
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
