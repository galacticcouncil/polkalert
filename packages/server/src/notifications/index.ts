import settings from '../settings'
import email from './email'
import webhooks from './webhooks'

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
  await send('offline', getOfflineMessage())
  console.log(getOfflineMessage())
  return
}

async function sendSlashMessage(slash: string) {
  await send('slash', getSlashMessage(slash))
  console.log(getSlashMessage(slash))
  return
}

async function sendNominatedMessage(signer: string) {
  send('nominated', getNominatedMessage(signer))
  console.log(getNominatedMessage(signer))
  return
}

async function sendBondedMessage(signer: string, amount: string) {
  send('bonded', getBondedMessage(signer, amount))
  console.log(getBondedMessage(signer, amount))
  return
}

async function sendBondedExtraMessage(signer: string, amount: string) {
  send('bondedExtra', getBondedExtraMessage(signer, amount))
  console.log(getBondedExtraMessage(signer, amount))
  return
}

async function sendUnbondedMessage(signer: string, amount: string) {
  send('unbonded', getUnbondedMessage(signer, amount))
  console.log(getUnbondedMessage(signer, amount))
  return
}

async function sendDenominateMessage(signer: string) {
  send('unbonded', getDenominateMessage(signer))
  console.log(getDenominateMessage(signer))
  return
}

async function sendUnbondedEverythingMessage(signer: string) {
  send('unbonded', getUnbondedEverythingMessage(signer))
  console.log(getUnbondedEverythingMessage(signer))
  return
}

function getSlashMessage(slash: String) {
  return (
    'The validator with ID ' +
    settings.get().validatorId +
    ' was slashed for ' +
    slash
  )
}

function getOfflineMessage() {
  return (
    'The validator with ID ' +
    settings.get().validatorId +
    ' was reported offline'
  )
}

function getNominatedMessage(sender: string) {
  return (
    'The validator with ID ' +
    settings.get().validatorId +
    ' was nominated by ' +
    sender
  )
}

function getBondedMessage(sender: string, amount: string) {
  return (
    'The account ' +
    sender +
    ' has bonded ' +
    amount +
    ' to validator with ID ' +
    settings.get().validatorId
  )
}

function getBondedExtraMessage(sender: string, amount: string) {
  return (
    'The account ' +
    sender +
    ' has bonded extra ' +
    amount +
    ' to validator with ID ' +
    settings.get().validatorId
  )
}

function getUnbondedMessage(sender: string, amount: string) {
  return (
    'The account ' +
    sender +
    ' has unbonded ' +
    amount +
    ' from validator with ID ' +
    settings.get().validatorId
  )
}

function getDenominateMessage(sender: string) {
  return (
    'The account ' +
    sender +
    ' is no longer nominating validator with ID ' +
    settings.get().validatorId
  )
}

function getUnbondedEverythingMessage(sender: string) {
  return (
    'The account ' +
    sender +
    ' has unbonded everything from validator with ID ' +
    settings.get().validatorId
  )
}

export default {
  init,
  send,
  sendOfflineMessage,
  sendSlashMessage,
  sendNominatedMessage,
  sendBondedMessage,
  sendBondedExtraMessage,
  sendUnbondedMessage,
  sendDenominateMessage,
  sendUnbondedEverythingMessage
}
