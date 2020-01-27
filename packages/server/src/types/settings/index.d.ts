declare type Settings = {
  blockReceivedLagNotificationDelay?: number
  noBlocksReceivedNotificationDelay?: number
  notFinalizingNotificationDelay?: number
  serverPort?: number
  email?: boolean
  emailFrom?: string
  emailPort?: number
  emailHost?: string
  emailUsername?: string
  emailPassword?: string
  emailRecipient?: string
  webHooks?: string[]
  maxDataAge?: number
  validatorId?: string
}
