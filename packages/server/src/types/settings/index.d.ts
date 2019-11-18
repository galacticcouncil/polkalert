declare type Settings = {
  serverPort: number
  emailPort?: number
  emailHost?: string
  emailUsername?: string
  emailPassword?: string
  emailRecipient?: string
  webHooks?: [string?]
}
