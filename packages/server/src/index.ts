import app from './api'
import db from './db'
import connector from './connector'
import settings from './settings'
import { readFileSync } from 'fs'

process.on('unhandledRejection', error => {
  console.log('unhandledRejection')
  console.error(error)
})

async function main() {
  await db.init()

  const oldAppVersion = await db.getAppVersion().catch(() => {
    return null
  })

  const version = JSON.parse(readFileSync('package.json', 'utf8')).version
  const config = settings.get()

  if (version !== oldAppVersion) {
    await db.clearDB()
    db.setAppVersion(version)
  }

  const oldNodeInfo = await db.getNodeInfo().catch(() => {
    console.log('error getting node info')
  })

  console.log('*****************')
  console.log('*** POLKALERT ***')
  console.log('version:', version)

  if (oldNodeInfo) {
    await connector
      .connect(oldNodeInfo.nodeUrl)
      .catch(e => console.log('unable to connect to previously connected node'))
  }

  app.listen({ port: config.serverPort || 4000 }).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`)
  })
}

main().catch(e => {
  console.log('error detected', e)
})
