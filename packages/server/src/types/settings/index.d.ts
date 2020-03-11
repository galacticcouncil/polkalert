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
  notificationToggles?: {
    offline?: boolean
    slash?: boolean
    nominated?: boolean
    bonded?: boolean
    bondedExtra?: boolean
    unbonded?: boolean
    denominated?: boolean
    equivocating?: boolean
    connection?: boolean
  }
}
