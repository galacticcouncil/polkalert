import db from '../db'
import connector from '../connector'
import { Validator } from '../entity/Validator'
import settings from '../settings'

async function addSlashesToValidators(validators: Validator[]) {
  let eraIndex = validators[0].commissionData[0].eraIndex
  let [slashes0, slashes1] = await Promise.all([
    connector.getEraSlashJournal(eraIndex),
    connector.getEraSlashJournal(eraIndex - 1)
  ])
  let allSlashes = slashes0.concat(slashes1)

  let validatorsWithSlashes = validators.map(validator => {
    const slashes = allSlashes
      .filter(slash => slash.who == validator.accountId)
      .map(slash => slash.amount)
    return { ...validator, slashes }
  })
  return validatorsWithSlashes
}

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
  const validatorsWithSlashes = await addSlashesToValidators(validators)
  const validatorsWithOnlineStates = await connector.addDerivedHeartbeatsToValidators(
    validatorsWithSlashes
  )
  const validatorsWithCurrentEraInfo = await addCurrentEraInfoToValidators(
    validatorsWithOnlineStates
  )

  return validatorsWithCurrentEraInfo
}

async function getValidatorInfo(_, { accountId }) {
  console.log('getting validator', accountId)
  return await db.getValidatorInfo(accountId)
}

async function connect(_, { nodeUrl }) {
  return connector.connect(nodeUrl).catch(e => {
    console.log('error while connecting:', e)
  })
}

function updateSettings(_, config) {
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
  }
}
