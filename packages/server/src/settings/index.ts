import { writeFileSync, existsSync, readFileSync } from 'fs'
import EventEmitter from 'events'

const configFile: string = './server-config.json'
const defaultConfigFile: string = './server-config.default.json'

const defaultConfig: Settings = JSON.parse(
  readFileSync(defaultConfigFile, {
    encoding: 'utf8'
  })
)

const config: Settings = existsSync(configFile)
  ? JSON.parse(readFileSync(configFile, { encoding: 'utf8' }))
  : null

if (!config) {
  console.log(
    console.log(
      '\x1b[31m%s\x1b[0m',
      'Server settings not initialized, please run "yarn setup" command in the root directory'
    )
  )
  process.exit(0)
}

let change = new EventEmitter()
let settings: Settings = Object.assign(defaultConfig, config)

function set(options: Settings) {
  console.log('updating settings', options)

  settings = Object.assign(settings, options)
  writeFileSync('./server-config.json', JSON.stringify(settings, null, 2), {
    encoding: 'utf8'
  })

  change.emit('change')

  return settings
}

function get() {
  return settings
}

function onChange(listener: () => void) {
  change.addListener('change', listener)
  return true
}

export default {
  set,
  get,
  onChange
}
