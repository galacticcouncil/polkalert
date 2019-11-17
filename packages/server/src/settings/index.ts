import { writeFileSync, existsSync, readFileSync } from 'fs'
const configFile = './server-config.json'

const config = existsSync(configFile)
  ? JSON.parse(readFileSync(configFile, { encoding: 'utf8' }))
  : null

if (!config) {
  throw new Error(
    'Server settings not initialized, please try running "yarn setup" command in the root directory'
  )
}

let settings: Settings = Object.assign({}, config)

function set(options) {
  console.log('updating settings', options)
  settings = Object.assign(settings, options)
  writeFileSync('./server-config.json', JSON.stringify(settings, null, 2), {
    encoding: 'utf8'
  })
  return 'success'
}

function get() {
  return settings
}

export default {
  set,
  get
}
