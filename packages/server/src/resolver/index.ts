import db from '../db'
import connector from '../connector'
import { Validator } from '../entity/Validator'
import settings from '../settings'
import { pubsub } from '../api'

async function addCurrentEraInfoToValidators(validators: Validator[]) {
  const currentValidators = await connector.getValidators()
  const validatorsWithCurrentEraInfo = validators.map(validator => {
    const isCurrent =
      currentValidators.findIndex(
        currentValidator =>
          currentValidator.accountId.toString() ===
          validator.accountId.toString()
      ) >= 0
    let currentValidator = isCurrent

    return { ...validator, currentValidator }
  })

  return validatorsWithCurrentEraInfo
}

async function getValidators() {
  const validators = await db.getValidators()
  const validatorsWithCurrentEraInfo = await addCurrentEraInfoToValidators(
    validators
  )
  const validatorsWithOnlineStates = await connector.addDerivedHeartbeatsToValidators(
    validatorsWithCurrentEraInfo
  )

  return validatorsWithOnlineStates
}

async function getValidatorInfo(_: any, { accountId }: { accountId: string }) {
  console.log('getting validator', accountId)
  return await db.getValidatorInfo(accountId)
}

async function connect(_: any, { nodeUrl }: { nodeUrl: string }) {
  return connector.connect(nodeUrl).catch(e => {
    console.log('error while connecting:', e)
  })
}

function updateSettings(_: any, config: Settings) {
  return settings.set(config)
}

function getDataAge() {
  return db.getDataAge()
}

export default {
  Query: {
    validators: getValidators,
    validator: getValidatorInfo,
    dataAge: getDataAge,
    nodeInfo: connector.getNodeInfo,
    settings: settings.get
  },
  Mutation: {
    connect,
    updateSettings
  },
  Subscription: {
    newMessage: {
      subscribe: () => pubsub.asyncIterator('newMessage')
    }
  }
}
