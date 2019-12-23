import { gql } from 'apollo-server'

export const typeDefs = gql`
  type CommissionData {
    id: String
    eraIndex: String
    sessionIndex: String
    controllerId: String
    bondedSelf: String
    nominatorData: String
    commission: String
    validator: Validator
    sessionIds: [String]
    nextSessionIds: [String]
  }

  type Header {
    id: String
    timestamp: String
    blockHash: String
    validator: Validator
  }

  type Slash {
    id: String
    amount: String
    sessionIndex: String
  }

  type Validator {
    accountId: String
    commissionData: [CommissionData]
    currentValidator: Boolean
    blocksProducedCount: String
    blocksProduced: [Header]
    slashes: [Slash]
    recentlyOnline: Boolean
  }

  type NodeInfo {
    chain: String
    genesisHash: String
    implementationName: String
    implementationVersion: String
    metadataVersion: String
    nodeUrl: String
    specName: String
    specVersion: String
    ss58Format: String
    systemName: String
    systemVersion: String
    tokenDecimals: String
    tokenSymbol: String
  }

  type Settings {
    blockReceivedLagNotificationDelay: Int
    noBlocksReceivedNotificationDelay: Int
    serverPort: Int
    emailNotifications: Boolean
    emailPort: Int
    emailHost: String
    emailRecipient: String
    emailUsername: String
    emailPassword: String
    webHooks: [String]
    maxDataAge: Float
  }

  type Mutation {
    connect(nodeUrl: String!): String
    updateSettings(
      blockReceivedLagNotificationDelay: Int
      noBlocksReceivedNotificationDelay: Int
      serverPort: Int
      emailNotifications: Boolean
      emailPort: Int
      emailHost: String
      emailRecipient: String
      emailUsername: String
      emailPassword: String
      webHooks: [String]
      maxDataAge: Float
    ): Settings
  }

  type Query {
    nodeInfo: NodeInfo
    validators: [Validator]
    validator(accountId: String!): Validator
    dataAge: String
    settings: Settings
  }
`
