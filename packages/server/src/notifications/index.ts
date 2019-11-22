import settings from '../settings'
import email from './email'
import webhooks from './webhooks'

let settingsListener = null

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

export default {
  init,
  send
}
