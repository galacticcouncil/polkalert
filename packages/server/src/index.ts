import { server } from './api'
import db from './db'
import connector from './connector'
import settings from './settings'
import { readFileSync } from 'fs'
import http from 'http'
import express from 'express'

process.on('unhandledRejection', (error) => {
  console.log('unhandledRejection')
  console.error(error)
})

async function main() {
  await db.init()

  const version = JSON.parse(readFileSync('package.json', 'utf8')).version
  const config = settings.get()

  const oldNodeInfo = await db.getNodeInfo().catch(() => {
    console.log('error getting node info')
    return null
  })

  console.log('*****************')
  console.log('*** POLKALERT ***')
  console.log('version:', version)

  const app = express()
  server.applyMiddleware({ app })
  const httpServer = http.createServer(app)
  server.installSubscriptionHandlers(httpServer)

  if (oldNodeInfo && oldNodeInfo.nodeUrl) {
    connector.setNodeUrl(oldNodeInfo.nodeUrl)
    await connector
      .connect(true)
      .catch((e) =>
        console.log(e, 'unable to connect to previously connected node')
      )
  }

  httpServer.listen({ port: config.serverPort || 4000 }, () => {
    console.log(
      `🚀 Server ready at http://0.0.0.0:${config.serverPort}${server.graphqlPath}`
    )
    console.log(
      `🚀 Subscriptions ready at ws://0.0.0.0:${config.serverPort}${server.subscriptionsPath}`
    )
  })
}

main().catch((e) => {
  console.log('error detected', e)
})
