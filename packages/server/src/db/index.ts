import 'reflect-metadata'
import settings from '../settings'
import {
  createConnection,
  Connection,
  EntityManager,
  LessThan,
  getConnectionOptions
} from 'typeorm'
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

let connection: Connection = null
let manager: EntityManager = null
let nodeInfo: NodeInfo = null
let validatorMap: { [key: string]: Validator } = {}
let retryInterval: number = 5000
let settingsListener: boolean = null

//TODO: Config
//number of seconds to prune blocks
let pruning = 180
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
  await init()
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
  return humanizeDuration(Date.now() - firstHeader.timestamp, { round: true })
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

  if (!connection) {
    if (!reset) {
      console.log('Cannot create connection to database, retrying...')
      console.log('Please make sure the database is running')
      await new Promise(resolve => setTimeout(resolve, retryInterval))
    }
    await init(reset)
  } else {
    manager = connection.manager

    startPruningInterval()

    if (!settingsListener) {
      settingsListener = settings.onChange(startPruningInterval)
    }
  }

  return
}

async function startPruningInterval() {
  maxDataAge = settings.get().maxDataAge

  if (manager) {
    manager
      .delete(Header, {
        timestamp: LessThan(Date.now() - maxDataAge * 3600 * 1000)
      })
      .catch(e => {})

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

async function removeComissionObject(data: EnhancedDerivedStakingQuery) {
  const commissionData = await manager.find(CommissionData, {
    relations: ['validator'],
    where: {
      validator: {
        accountId: data.accountId.toString()
      },
      sessionIndex: data.sessionIndex
    }
  })

  await manager
    .remove(commissionData, {
      transaction: true
    })
    .catch(e => console.log('Error removing commissionData'))

  return
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

  if (validator) {
    await removeComissionObject(data)
  } else {
    validator = createValidatorObject(data)
  }

  let commission: CommissionData = createCommissionObject(data)
  commission.validator = validator

  await manager.save(validator)
  await manager.save(commission)

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
  return await manager.findOne(Validator, id, {
    relations: ['commissionData', 'blocksProduced']
  })
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
    relations: ['commissionData', 'blocksProduced', 'slashes']
  })

  allValidators = allValidators.map(validator => {
    let blocksProducedCount = validator.blocksProduced
      ? validator.blocksProduced.length
      : 0
    return { ...validator, blocksProducedCount }
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
  if (appVersion) {
    return appVersion.version
  } else return null
}

async function setAppVersion(newAppVersion: string) {
  let appVersion = (await manager.findOne(AppVersion, 1)) || new AppVersion()
  appVersion.version = newAppVersion
  appVersion.id = 1
  await manager.save(appVersion)

  return
}

export default {
  init,
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
