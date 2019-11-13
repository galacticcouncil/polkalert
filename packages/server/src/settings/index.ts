import config from '../../server-config.json'
import { writeFileSync } from 'fs'

if (!config) {
  throw new Error(
    'Server settings not present, please try running "yarn setup" command in the root directory'
  )
}

let settings = Object.assign({}, config)

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
