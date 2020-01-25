import settings from '../settings'
import notifications from '../notifications'
import logger from '../logger'

let settingsListener: boolean = null
let blockReceivedLagNotificationDelay: number = null
let noBlocksReceivedNotificationDelay: number = null
let notFinalizingNotificationDelay: number = null
let noBlocksReceivedNotificationTimeout: NodeJS.Timeout = null
let notFinalizingNotificationTimeout: NodeJS.Timeout = null
let lastFinalizedBlock: string = null

//TODO: figure out how block time settings are changed on the network
//so we don't fire false positives if block time changes - start watcher and update as required

function init() {
  blockReceivedLagNotificationDelay =
    settings.get().blockReceivedLagNotificationDelay * 1000
  noBlocksReceivedNotificationDelay =
    settings.get().noBlocksReceivedNotificationDelay * 1000
  notFinalizingNotificationDelay =
    settings.get().notFinalizingNotificationDelay * 1000

  clearTimeout(noBlocksReceivedNotificationTimeout)
  startNoBlocksNotificationTimeout()
  startNotFinalizingNotificationTimeout()

  if (!settingsListener) {
    settingsListener = settings.onChange(init)
  }
}

function getNoBlocksMessage() {
  return `node didn't receive blocks for ${noBlocksReceivedNotificationDelay /
    1000} seconds, check your connection.
    If you think this message is false alarm check your settings`
}

function getNotFinalizingMessage() {
  return `blocks were not finalized for ${notFinalizingNotificationDelay /
    1000} seconds, check your connection and chain state.
    If you think this message is false alarm check your settings`
}

function getBlockTimeMessage(blockReceivedTimeDifference: number) {
  return `node received block after ${blockReceivedTimeDifference} ms check your connection.
    If you think this message is false alarm check your settings`
}

function startNotFinalizingNotificationTimeout() {
  notFinalizingNotificationTimeout = setTimeout(() => {
    notifications.send('connection', getNotFinalizingMessage())

    logger.warn('Blocks are not being finalized', getNotFinalizingMessage())
  }, notFinalizingNotificationDelay)
}

function startNoBlocksNotificationTimeout() {
  noBlocksReceivedNotificationTimeout = setTimeout(() => {
    notifications.send('connection', getNoBlocksMessage())

    logger.warn('No blocks received', getNoBlocksMessage())
  }, noBlocksReceivedNotificationDelay)
}

function ping(timestamp: number, finalizedHash: string) {
  const blockReceivedTimeDifference = Date.now() - timestamp

  if (lastFinalizedBlock !== finalizedHash) {
    lastFinalizedBlock = finalizedHash
    clearTimeout(notFinalizingNotificationTimeout)
    startNotFinalizingNotificationTimeout()
  }

  if (blockReceivedTimeDifference > blockReceivedLagNotificationDelay) {
    notifications.send(
      'connection',
      getBlockTimeMessage(blockReceivedTimeDifference)
    )
    logger.warn(
      'High network lag',
      getBlockTimeMessage(blockReceivedTimeDifference)
    )
  }

  clearTimeout(noBlocksReceivedNotificationTimeout)
  startNoBlocksNotificationTimeout()
}

export default {
  init,
  ping
}
