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
  send('offline', offlineMessage)
  logger.warn('Validator offline', offlineMessage)
  return
}

async function sendSlashMessage(slash: string) {
  const slashMessage = getSlashMessage(slash)
  send('slash', slashMessage)
  logger.warn('Validator slashed', slashMessage)
  return
}

async function sendNominatedMessage(signer: string) {
  const nominatedMessage = getNominatedMessage(signer)
  send('nominated', nominatedMessage)
  logger.log('Validator nominated', nominatedMessage)
  return
}

async function sendBondedMessage(signer: string, amount: string) {
  send('bonded', getBondedMessage(signer, amount))
  logger.log('Nominator bonded', getBondedMessage(signer, amount))
  return
}

async function sendBondedExtraMessage(signer: string, amount: string) {
  send('bondedExtra', getBondedExtraMessage(signer, amount))
  logger.log('Nominator bonded', getBondedExtraMessage(signer, amount))
  return
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

export default {
  init,
  send,
  sendOfflineMessage,
  sendSlashMessage,
  sendNominatedMessage,
  sendBondedMessage,
  sendBondedExtraMessage
}
