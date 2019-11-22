import { writeFileSync, existsSync, readFileSync } from 'fs'
import EventEmitter from 'events'

const configFile: string = './server-config.json'

const config: Settings = existsSync(configFile)
  ? JSON.parse(readFileSync(configFile, { encoding: 'utf8' }))
  : null

if (!config) {
  throw new Error(
    'Server settings not initialized, please try running "yarn setup" command in the root directory'
  )
}

let change = new EventEmitter()
let settings: Settings = Object.assign({}, config)

function set(options: Settings) {
  console.log('updating settings', options)

  settings = Object.assign(settings, options)
  writeFileSync('./server-config.json', JSON.stringify(settings, null, 2), {
    encoding: 'utf8'
  })

  change.emit('change')

  return 'success'
}

function get() {
  return settings
}

function onChange(listener) {
  return change.addListener('change', listener)
}

export default {
  set,
  get,
  onChange
}
