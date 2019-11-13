import app from './api'
import db from './db'
import connector from './connector'

async function main() {
  await db.init()

  let oldNodeInfo = await db.getNodeInfo()
  if (oldNodeInfo) {
    console.log('connecting to', oldNodeInfo.nodeUrl)
    await connector
      .connect(oldNodeInfo.nodeUrl)
      .catch(e => console.log('unable to connect to previously connected node'))
  }

  app.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`)
  })
}

main().catch(e => {
  console.log('error detected', e)
})
