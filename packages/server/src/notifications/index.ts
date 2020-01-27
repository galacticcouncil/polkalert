import settings from '../settings'
import email from './email'
import webhooks from './webhooks'
import logger from '../logger'

let settingsListener: boolean = false

async function init() {
  email.init(settings.get())
  webhooks.init(settings.get())

  if (!settingsListener) {
    settingsListener = settings.onChange(init)
  }

  return
}

async function send(type: string, message: string) {
  email.send(type, message)
  webhooks.send(type, message)

  return
}

async function sendOfflineMessage() {
  const offlineMessage = getOfflineMessage()
  logger.warn('Validator offline', offlineMessage)
  return send('offline', offlineMessage)
}

async function sendSlashMessage(slash: string) {
  const slashMessage = getSlashMessage(slash)
  logger.warn('Validator slashed', slashMessage)
  return send('slash', slashMessage)
}

async function sendNominatedMessage(signer: string) {
  const nominatedMessage = getNominatedMessage(signer)
  logger.warn('Validator nominated', nominatedMessage)
  return send('nominated', nominatedMessage)
}

async function sendBondedMessage(signer: string, amount: string) {
  logger.warn('Nominator bonded', getBondedMessage(signer, amount))
  return send('bonded', getBondedMessage(signer, amount))
}

async function sendBondedExtraMessage(signer: string, amount: string) {
  logger.warn('Nominator bonded', getBondedExtraMessage(signer, amount))
  return send('bondedExtra', getBondedExtraMessage(signer, amount))
}

async function sendUnbondedMessage(signer: string, amount: string) {
  logger.warn('Nominator unbonded', getUnbondedMessage(signer, amount))
  return send('unbonded', getUnbondedMessage(signer, amount))
}

async function sendDenominateMessage(signer: string) {
  logger.warn('Nominator denominated', getDenominateMessage(signer))
  return send('denominated', getDenominateMessage(signer))
}

async function sendUnbondedEverythingMessage(signer: string) {
  logger.warn('Nominator unbonded', getUnbondedEverythingMessage(signer))
  return send('unbonded', getUnbondedEverythingMessage(signer))
}

function sendEquivocatingMessage(
  validator: string,
  hash1: string,
  hash2: string
) {
  const equivocatingMessage = getEquivocatingMessage(validator, hash1, hash2)
  console.log(equivocatingMessage)
  return send('equivocating', equivocatingMessage)
}

function getSlashMessage(slash: String) {
  return `The validator with ID ${
    settings.get().validatorId
  } was slashed for ${slash}`
}

function getOfflineMessage() {
  return `The validator with ID ${
    settings.get().validatorId
  } was reported offline`
}

function getNominatedMessage(sender: string) {
  return `The validator with ID ${
    settings.get().validatorId
  } was nominated by ${sender}`
}

function getBondedMessage(sender: string, amount: string) {
  return `Nominator ${sender} has bonded ${amount} to validator with ID ${
    settings.get().validatorId
  }`
}

function getBondedExtraMessage(sender: string, amount: string) {
  return `Nominator ${sender} has bonded extra ${amount} to validator with ID ${
    settings.get().validatorId
  }`
}

function getUnbondedMessage(sender: string, amount: string) {
  return `The account ${sender} has unbonded ${amount} from validator with ID ${
    settings.get().validatorId
  }`
}

function getDenominateMessage(sender: string) {
  return `The account ${sender} is no longer nominating validator with ID ${
    settings.get().validatorId
  }`
}

function getUnbondedEverythingMessage(sender: string) {
  return `The account ${sender} has unbonded everything from validator with ID ${
    settings.get().validatorId
  }`
}

function getEquivocatingMessage(
  validator: string,
  hash1: string,
  hash2: string
) {
  return `Validator ${validator} is equivocating with blocks ${hash1} and ${hash2}`
}

export default {
  init,
  send,
  sendEquivocatingMessage,
  sendOfflineMessage,
  sendSlashMessage,
  sendNominatedMessage,
  sendBondedMessage,
  sendBondedExtraMessage,
  sendUnbondedMessage,
  sendDenominateMessage,
  sendUnbondedEverythingMessage
}
