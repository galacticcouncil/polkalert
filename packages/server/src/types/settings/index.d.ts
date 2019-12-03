declare type Settings = {
  blockReceivedLagNotificationDelay?: number
  noBlocksReceivedNotificationDelay?: number
  serverPort?: number
  email?: boolean
  emailPort?: number
  emailHost?: string
  emailUsername?: string
  emailPassword?: string
  emailRecipient?: string
  webHooks?: string[]
}
