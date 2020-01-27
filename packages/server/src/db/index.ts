import 'reflect-metadata'
import settings from '../settings'
import {
  createConnection,
  Connection,
  EntityManager,
  LessThan,
  getConnectionOptions
} from 'typeorm'
import { Log } from '../entity/Log'
import { Header } from '../entity/Header'
import { Validator } from '../entity/Validator'
import { CommissionData } from '../entity/CommissionData'
import { formatBalance } from '@polkadot/util'
import { performance } from 'perf_hooks'
import { NodeInfoStorage } from '../entity/NodeInfoStorage'
import { AppVersion } from '../entity/AppVersion'
import { SessionInfo } from '../entity/SessionInfo'
import { Slash } from '../entity/Slash'
import humanizeDuration from 'humanize-duration'
import { EnhancedHeader, EnhancedDerivedStakingQuery } from '../types/connector'
import { pubsub } from '../api'
import { readFileSync } from 'fs'

let connection: Connection = null
let manager: EntityManager = null
let nodeInfo: NodeInfo = null
let validatorMap: { [key: string]: Validator } = {}
let retryInterval: number = 5000
let debugLogs = false

//number of seconds to prune blocks
let pruning = 120
//max number of hours for storing blocks
let maxDataAge: number = null
//interval function
let pruningInterval: NodeJS.Timeout = null

async function getValidator(hash: string) {
  if (!validatorMap[hash]) {
    validatorMap[hash] = await manager.findOne(Validator, hash)
  }
  return validatorMap[hash]
}

async function clearDB() {
  await connection.synchronize(true)
  return
}

async function disconnect() {
  clearTimeout(pruningInterval)
  await connection.close()
  validatorMap = {}
  manager = null
  nodeInfo = null
  return
}

async function getDataAge() {
  let firstHeader = await getFirstHeader()
  return firstHeader
    ? humanizeDuration(Date.now() - firstHeader.timestamp, { round: true })
    : null
}

async function init(reset = false) {
  if (connection) await disconnect()
  let connectionOptions = await getConnectionOptions()

  //TODO: handle connection disconnect
  connection =
    (await createConnection({
      ...connectionOptions,
      synchronize: reset
    }).catch(async error => {
      if (error.code === '23502') {
        reset = true
      } else {
        console.log(error)
      }
    })) || null

  if (connection) {
    //Check if we updated app, clear database if we did to avoid errors
    manager = connection.manager

    const version = JSON.parse(readFileSync('package.json', 'utf8')).version
    const oldAppVersion = await getAppVersion().catch(() => {
      return null
    })

    if (version !== oldAppVersion) {
      console.log(
        `App updated from ${oldAppVersion} to ${version}, clearing block database...`
      )
      await clearDB()
      await setAppVersion(version)
      await init()
    }

    startPruningInterval()
  } else {
    if (!reset) {
      console.log('Cannot create connection to database, retrying...')
      console.log('Please make sure the database is running')
      await new Promise(resolve => setTimeout(resolve, retryInterval))
    }

    await init(reset)
  }
}

async function startPruningInterval() {
  maxDataAge = settings.get().maxDataAge

  if (manager) {
    const pruningDate = Date.now() - maxDataAge * 3600 * 1000

    manager
      .delete(Header, {
        timestamp: LessThan(pruningDate)
      })
      .catch()

    manager
      .delete(Log, {
        timestamp: LessThan(pruningDate)
      })
      .catch()

    pruningInterval = setTimeout(startPruningInterval, pruning * 1000)
  }
}

function createNominatorObjectString({ stakers }: EnhancedDerivedStakingQuery) {
  if (!stakers || !stakers.others.length) return null

  const nominatorObject = {
    totalStake: formatBalance(stakers.total),
    nominatorStake: formatBalance(
      stakers.total.unwrap().sub(stakers.own.unwrap())
    ),
    stakers: stakers.others.map(staker => {
      return {
        accountId: staker.who.toString(),
        stake: formatBalance(staker.value)
      }
    })
  }

  return JSON.stringify(nominatorObject)
}

async function getCommissionData(accountId: string, sessionIndex: number) {
  return manager.find(CommissionData, {
    relations: ['validator'],
    where: { validator: accountId, sessionIndex }
  })
}

function createCommissionObject(data: EnhancedDerivedStakingQuery) {
  const commissionData = new CommissionData()

  commissionData.eraIndex = data.eraIndex
  commissionData.sessionIndex = data.sessionIndex

  commissionData.bondedSelf = data.stakingLedger
    ? formatBalance(data.stakingLedger.total)
    : undefined

  commissionData.commission = data.validatorPrefs
    ? (data.validatorPrefs.commission.toNumber() / 10000000).toFixed(2) + '%'
    : undefined

  commissionData.controllerId = data.controllerId.toString()
  commissionData.nominatorData = createNominatorObjectString(data)

  commissionData.sessionIds = data.sessionIds.map(sessionId =>
    sessionId.toString()
  )
  commissionData.nextSessionIds = data.sessionIds.map(sessionId =>
    sessionId.toString()
  )

  return commissionData
}

function createValidatorObject(data: EnhancedDerivedStakingQuery) {
  const validator = new Validator()
  validator.accountId = data.accountId.toString()
  return validator
}

function createHeaderObject(data: EnhancedHeader) {
  const header = new Header()
  header.id = data.number
  header.timestamp = data.timestamp
  header.blockHash = data.hash
  return header
}

function createSessionInfoEntity({ sessionInfo: data }: EnhancedHeader) {
  const sessionInfo = new SessionInfo()
  sessionInfo.eraIndex = data.eraIndex
  sessionInfo.id = data.sessionIndex
  sessionInfo.offences = JSON.stringify(data.offences)
  sessionInfo.rewards = JSON.stringify(data.rewards)
  return sessionInfo
}

async function saveHeader(data: EnhancedHeader) {
  let header = await manager.findOne(Header, data.number)

  if (header) return

  const validator: Validator = await getValidator(data.author)
  header = createHeaderObject(data)

  if (data.sessionInfo) {
    const sessionInfo = createSessionInfoEntity(data)
    header.sessionInfo = sessionInfo
    await manager.save(sessionInfo)

    const slashes = data.sessionInfo.slashes
    if (slashes && slashes.length) {
      for (const slashData of slashes) {
        const slash = new Slash()
        slash.amount = slashData.amount
        slash.sessionIndex = data.sessionInfo.sessionIndex
        slash.validator = await getValidator(slashData.accountId)
        slash.sessionInfo = sessionInfo
        manager.save(slash)
      }
    }
  }

  header.validator = validator
  await manager.save(header)

  return
}

async function saveValidator(data: EnhancedDerivedStakingQuery) {
  let validator: Validator = await manager.findOne(
    Validator,
    data.accountId.toString()
  )

  if (!validator) {
    validator = createValidatorObject(data)
    await manager.save(validator)
  }

  let commission: CommissionData = (
    await getCommissionData(data.accountId.toString(), data.sessionIndex)
  )[0]

  if (!commission) {
    commission = createCommissionObject(data)
    commission.validator = validator
    await manager.save(commission)
  }

  return
}

async function bulkSave(
  type: string,
  data: EnhancedDerivedStakingQuery[] | EnhancedHeader[]
) {
  console.log('DB: bulk saving', data.length, type + 's')
  let performanceStart = performance.now()
  for (const record of data) {
    if ('number' in record) await saveHeader(record)
    if ('accountId' in record) await saveValidator(record)
  }

  console.log(
    'DB: bulk saving finished:Performance',
    performance.now() - performanceStart,
    'ms'
  )
  return
}

async function getValidatorInfo(id: string) {
  const validator = await manager.findOne(Validator, id, {
    relations: ['commissionData', 'blocksProduced', 'slashes']
  })

  validator.commissionData = validator.commissionData.sort((a, b) => {
    return b.sessionIndex - a.sessionIndex
  })

  return validator
}

async function getFirstHeader() {
  return await manager.findOne(Header, null, { order: { id: 'ASC' } })
}

async function getLastHeader() {
  return await manager.findOne(Header, null, { order: { id: 'DESC' } })
}

async function getValidators() {
  console.log('DB: getting all validators')
  let performanceStart = performance.now()
  //TODO limit commissionData and slashes
  let allValidators: Validator[] = await manager.find(Validator, {
    relations: ['commissionData', 'slashes']
  })

  allValidators.forEach(validator => {
    validator.commissionData = validator.commissionData.sort((a, b) => {
      return b.sessionIndex - a.sessionIndex
    })
  })

  console.log(
    'DB: got all validators:Performance',
    performance.now() - performanceStart,
    'ms'
  )

  return allValidators
}

async function setNodeInfo(newNodeInfo: NodeInfo) {
  nodeInfo = newNodeInfo

  formatBalance.setDefaults({
    decimals: nodeInfo.tokenDecimals,
    unit: nodeInfo.tokenSymbol
  })

  const nodeInfoStorage =
    (await manager.findOne(NodeInfoStorage, 1)) || new NodeInfoStorage()

  nodeInfoStorage.data = JSON.stringify(nodeInfo)
  nodeInfoStorage.id = 1

  await manager.save(nodeInfoStorage)

  return
}

async function getNodeInfo(): Promise<NodeInfo> {
  let oldNodeInfo = await manager.findOne(NodeInfoStorage, 1)
  if (oldNodeInfo) {
    return JSON.parse(oldNodeInfo.data)
  } else return null
}

async function getAppVersion() {
  let appVersion = await manager.findOne(AppVersion, 1)
  console.log('got version', appVersion)
  if (appVersion) {
    return appVersion.version
  } else return null
}

async function setAppVersion(newAppVersion: string) {
  let appVersion = (await manager.findOne(AppVersion, 1)) || new AppVersion()
  appVersion.version = newAppVersion
  appVersion.id = 1
  console.log('setting version', appVersion)
  await manager.save(appVersion)

  return
}

async function log(message: Message) {
  const logMessage = new Log()
  if (!message.timestamp) message.timestamp = Date.now()

  Object.assign(logMessage, message)
  const log = await manager.save(logMessage)

  if (debugLogs || message.type !== 'debug') {
    pubsub.publish('newMessage', log)
  }

  return log
}

async function getLogs(debug: boolean = false) {
  if (debug) debugLogs = true

  return (await manager.find(Log)).filter(message =>
    debugLogs ? true : message.type !== 'debug'
  )
}

export default {
  init,
  log,
  getLogs,
  saveHeader,
  saveValidator,
  getAppVersion,
  setAppVersion,
  setNodeInfo,
  getNodeInfo,
  getDataAge,
  clearDB,
  getFirstHeader,
  getLastHeader,
  bulkSave,
  getValidators,
  getValidatorInfo
}
