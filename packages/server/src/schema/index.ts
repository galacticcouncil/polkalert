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
    sessionId: String
    nextSessionId: String
    sessionIds: String
    nextSessionIds: String
  }

  type Header {
    id: String
    timestamp: String
    blockHash: String
    validator: Validator
  }

  type Validator {
    accountId: String
    commissionData: [CommissionData]
    blocksProducedCount: String
    blocksProduced: [Header]
    slashes: [String]
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

  type Mutation {
    connection(nodeUrl: String!): String
  }

  type Query {
    nodeInfo: NodeInfo
    validators: [Validator]
    validator(accountId: String!): Validator
    dataAge: String
    webhook (url: String!): Boolean
  }
`
