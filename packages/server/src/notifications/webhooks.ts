import WebHooks from 'node-webhooks'

let webHookStorage: string[] = []
let webHooks = null

function init(settings: Settings) {
  if (!webHooks) {
    webHooks = new WebHooks({
      db: { webHooks: webHookStorage }
    })
  }

  set(settings.webHooks)
}

//TODO: figure out if we want a simple filter on the server
//and send event type in payload or if we allow different
//urls for different events
async function set(urlList: string[]) {
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
  return
}

//TODO: figure out data format, i.e. - type:string, amount:number
async function send(type, message) {
  webHooks.trigger('webHooks', { type, message })
  return
}

export default {
  init,
  send
}
