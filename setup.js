const prompts = require('prompts')
const yaml = require('yaml')
const fs = require('fs')

const serverPath = './packages/server/'

const dbDockerFile = serverPath + 'docker-compose.yml'
const defaultDbDockerFile = serverPath + 'docker-compose.default.yml'

const ormConfigFile = serverPath + 'ormconfig.json'
const defaultOrmConfigFile = serverPath + 'ormconfig.default.json'

const serverConfigFile = serverPath + 'server-config.json'
const defaultServerConfigFile = serverPath + 'server-config.default.json'

const dbSettings = yaml.parse(
  fs.readFileSync(defaultDbDockerFile, {
    encoding: 'utf8'
  })
)
const ormSettings = JSON.parse(
  fs.readFileSync(defaultOrmConfigFile, {
    encoding: 'utf8'
  })
)
const serverSettings = JSON.parse(
  fs.readFileSync(defaultServerConfigFile, {
    encoding: 'utf8'
  })
)

const questions = [
  // {
  //   type: 'number',
  //   name: 'clientPort',
  //   message: 'Set port for client app',
  //   initial: 8080
  // },
  {
    type: 'number',
    name: 'serverPort',
    message: 'Set port for server app',
    initial: serverSettings.serverPort
  },
  {
    type: 'number',
    name: 'databasePort',
    message: 'Set port for database app',
    initial: ormSettings.port
  }
]

;(async () => {
  console.log('Polkalert setup')
  const response = await prompts(questions)
  console.log(response)

  let { /* clientPort, */ serverPort, databasePort } = response

  serverSettings.serverPort = serverPort

  ormSettings.port = databasePort

  dbSettings.services['monitor-db'].ports = [databasePort + ':5432']
  dbSettings.services['monitor-db'].expose = [databasePort]

  fs.writeFileSync(dbDockerFile, yaml.stringify(dbSettings, null, 2))
  fs.writeFileSync(ormConfigFile, JSON.stringify(ormSettings, null, 2))
  fs.writeFileSync(serverConfigFile, JSON.stringify(serverSettings, null, 2))
})()
