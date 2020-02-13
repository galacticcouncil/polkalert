const prompts = require('prompts')
const yaml = require('yaml')
const fs = require('fs')

const serverPath = './packages/server/'
const clientPath = './packages/client/'

const dbDockerFile = serverPath + 'docker-compose.yml'
const defaultDbDockerFile = serverPath + 'docker-compose.default.yml'

const ormConfigFile = serverPath + 'ormconfig.json'
const defaultOrmConfigFile = serverPath + 'ormconfig.default.json'

const serverConfigFile = serverPath + 'server-config.json'
const defaultServerConfigFile = serverPath + 'server-config.default.json'

const clientConfigFile = clientPath + '/src/config/client-config.json'
const defaultClientConfigFile = clientPath + 'client-config.default.json'

const defaultDbSettings = yaml.parse(
  fs.readFileSync(defaultDbDockerFile, { encoding: 'utf8' })
)

const defaultOrmSettings = JSON.parse(
  fs.readFileSync(defaultOrmConfigFile, { encoding: 'utf8' })
)

const defaultServerSettings = JSON.parse(
  fs.readFileSync(defaultServerConfigFile, { encoding: 'utf8' })
)

const defaultClientSettings = JSON.parse(
  fs.readFileSync(defaultClientConfigFile, { encoding: 'utf8' })
)

const initialized =
  fs.existsSync(dbDockerFile) &&
  fs.existsSync(ormConfigFile) &&
  fs.existsSync(serverConfigFile) &&
  fs.existsSync(clientConfigFile)

let dbSettings = fs.existsSync(dbDockerFile)
  ? yaml.parse(fs.readFileSync(dbDockerFile, { encoding: 'utf8' }))
  : defaultDbSettings

let ormSettings = fs.existsSync(ormConfigFile)
  ? JSON.parse(fs.readFileSync(ormConfigFile, { encoding: 'utf8' }))
  : defaultOrmSettings

let serverSettings = fs.existsSync(serverConfigFile)
  ? JSON.parse(fs.readFileSync(serverConfigFile, { encoding: 'utf8' }))
  : defaultServerSettings

let clientSettings = fs.existsSync(clientConfigFile)
  ? JSON.parse(fs.readFileSync(clientConfigFile, { encoding: 'utf8' }))
  : defaultClientSettings

const questions = [
  {
    type: initialized ? 'confirm' : null,
    name: 'reset',
    message: 'Do you want to reset all settings to defaults?',
    initial: false
  },
  {
    type: 'number',
    name: 'serverPort',
    message: 'Set port for server app',
    initial: (prev, values) =>
      values.reset
        ? defaultServerSettings.serverPort
        : serverSettings.serverPort
  },
  {
    type: 'number',
    name: 'databasePort',
    message: 'Set port for database',
    initial: (prev, values) =>
      values.reset ? defaultOrmSettings.port : ormSettings.port
  },
  {
    type: 'number',
    name: 'clientPort',
    message: 'Set port for client app',
    initial: (prev, values) =>
      values.reset
        ? defaultClientSettings.clientPort
        : clientSettings.clientPort
  }
]

;(async () => {
  console.log('Polkalert setup')
  let resetArg = process.argv.indexOf('--reset') !== -1
  let updateArg = process.argv.indexOf('--update') !== -1

  let response = { serverPort: null, databasePort: null, reset: null }

  if (!resetArg && !updateArg) {
    response = await prompts(questions)
    console.log(response)
  }

  let { clientPort, serverPort, databasePort, reset } = response

  if (reset || resetArg) {
    serverSettings = defaultServerSettings
    ormSettings = defaultOrmSettings
    dbSettings = defaultDbSettings
    clientSettings = defaultClientSettings
  } else if (updateArg) {
    serverSettings = Object.assign(defaultServerSettings, serverSettings)
    ormSettings = Object.assign(defaultOrmSettings, ormSettings)
    dbSettings = Object.assign(defaultDbSettings, dbSettings)
    clientSettings = Object.assign(defaultClientSettings, clientSettings)
  }

  if (serverPort) {
    clientSettings.serverPort = serverPort
    serverSettings.serverPort = serverPort
  }

  if (databasePort) {
    ormSettings.port = databasePort
    dbSettings.services['monitor-db'].ports = [databasePort + ':5432']
    dbSettings.services['monitor-db'].expose = [databasePort]
  }

  if (clientPort) {
    clientSettings.clientPort = clientPort
  }

  fs.writeFileSync(dbDockerFile, yaml.stringify(dbSettings, null, 2))
  fs.writeFileSync(ormConfigFile, JSON.stringify(ormSettings, null, 2))
  fs.writeFileSync(serverConfigFile, JSON.stringify(serverSettings, null, 2))
  fs.writeFileSync(clientConfigFile, JSON.stringify(clientSettings, null, 2))
})()
