import db from '../db'
import connector from '../connector'
import webhooks from '../webhooks'
import { Validator } from '../entity/Validator'

async function addSlashesToValidators(validators: Validator[]) {
  let eraIndex = validators[0].commissionData[0].eraIndex
  let [slashes0, slashes1] = await Promise.all([
    connector.getEraSlashJournal(eraIndex),
    connector.getEraSlashJournal(eraIndex - 1)
  ])
  const slashes = slashes0.concat(slashes1)

  let validatorsWithSlashes = validators.map(validator => {
    validator['slashes'] = slashes
      .filter(slash => slash.who == validator.accountId)
      .map(slash => slash.amount)
    return validator
  })
  return validatorsWithSlashes
}

async function getValidators() {
  const validators = await db.getValidators()
  let validatorsWithSlashes = await addSlashesToValidators(validators)
  let validatorsWithOnlineStates = await connector.addDerivedHeartbeatsToValidators(
    validatorsWithSlashes
  )
  return validatorsWithOnlineStates
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

function getDataAge() {
  return db.getDataAge()
}

export default {
  Query: {
    validators: getValidators,
    validator: getValidatorInfo,
    dataAge: getDataAge,
    nodeInfo: connector.getNodeInfo,
    webhook: webhooks.setWebhook
  },

  Mutation: {
    connection: connect
    //Return node info?
  }
}
