import WebHooks from 'node-webhooks'
import settings from '../settings'

let webHookStorage: [string] = settings.get().webHooks

var webHooks = new WebHooks({
  db: { webHooks: webHookStorage }
})

//TODO: figure out if we want a simple filter on the server
//and send event type in payload or if we allow different
//urls for different events
async function set(urlList: [string]) {
  webHookStorage.forEach(url => {
    if (!urlList.includes(url)) {
      webHooks.add('webHooks', url)
    }
  })
  urlList.forEach(url => {
    if (!webHookStorage.includes(url)) {
      webHooks.remove('webHooks', url)
    }
  })
  webHookStorage = urlList
}

//TODO: figure out data format, i.e. - type:string, amount:number
async function sendWebHookEvent(data) {
  webHooks.trigger('webHooks', data)
}

export default {
  set,
  sendWebHookEvent
}
