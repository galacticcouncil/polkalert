import settings from '../settings'
import notifications from '../notifications'

let settingsListener: NodeJS.EventEmitter = null
let blockTimeNotificationRatio: number = null
let averageBlockTime: number = null
let notificationTimeoutTime: number = null
let notificationTimeout: NodeJS.Timeout = null

//TODO: figure out how block time settings are changed on the network
//so we don't fire false positives if block time changes - start watcher and update as required

function init() {
  blockTimeNotificationRatio = settings.get().blockTimeNotificationRatio

  if (averageBlockTime) {
    clearTimeout(notificationTimeout)
    startTimeout()
  }

  if (!settingsListener) {
    settingsListener = settings.onChange(init)
  }
}

function setAverageBlockTime(newAverageBlockTime: number) {
  averageBlockTime = newAverageBlockTime
  notificationTimeoutTime = averageBlockTime * blockTimeNotificationRatio
  return
}

function startTimeout() {
  notificationTimeout = setTimeout(() => {
    const text =
      "node didn't receive blocks for " +
      (notificationTimeoutTime / 1000).toFixed(2) +
      'seconds while average block time in the network is ' +
      (averageBlockTime / 1000).toFixed(2) +
      'seconds, check your connection.\n' +
      'If you think this message is false alarm,' +
      'check your block time notification ratio setting'

    notifications.send('connection', text)

    console.log(text)
  }, notificationTimeoutTime)
}

function ping() {
  if (averageBlockTime) {
    clearTimeout(notificationTimeout)
    startTimeout()
  }
}

export default {
  init,
  ping,
  setAverageBlockTime
}
