import { ApiPromise } from '@polkadot/api'
import { Vec } from '@polkadot/types'
import { EventRecord, Hash, BlockHash } from '@polkadot/types/interfaces'
import db from '../db'
import { formatBalance } from '@polkadot/util'
import { isNullOrUndefined } from 'util'

let maxHeaderBatch = 100

export const getBlockHeader = async (api: ApiPromise, blockNumber: number) => {
  return (await getBlockHeaders(api, [blockNumber]))[0]
}

export const getBlockHeaders = async (
  api: ApiPromise,
  blockNumbers: number[]
) => {
  let blocksAvailable = true
  if (blockNumbers.length > 1) {
    blocksAvailable = await testPruning(
      api,
      blockNumbers[blockNumbers.length - 1]
    )
    console.log(
      'getting block headers:',
      JSON.stringify(blockNumbers[0]),
      '...',
      JSON.stringify(blockNumbers[blockNumbers.length - 1])
    )
  }

  if (!blocksAvailable) return []

  let blockHashes: BlockHash[] = await Promise.all(
    blockNumbers.map((blockNumber) =>
      api.rpc.chain.getBlockHash(blockNumber).catch(() => null)
    )
  )

  blockHashes = blockHashes.filter((block) => !!block)

  let headers = await Promise.all(
    blockHashes.map((blockHash) =>
      api.derive.chain.getHeader(blockHash.toString())
    )
  )

  let timestamps = await Promise.all(
    headers.map((header) =>
      header ? api.query.timestamp.now.at(header.hash) : null
    )
  )

  let events: Vec<EventRecord>[] = await Promise.all(
    headers.map((header) =>
      header ? api.query.system.events.at(header.hash) : null
    )
  )

  let enhancedHeaders: EnhancedHeader[] = await Promise.all(
    headers.map(async (header, index) => {
      if (!header) return null

      const eventWrapper = events[index]
      const timestamp: number = timestamps[index].toNumber()
      const number: number = header.number.toNumber()
      const hash: string = header.hash.toString()
      const author: string = header.author?.toString()
      const slashes: EventSlash[] = []
      const rewards: EventReward[] = []
      const offences: EventOffence[] = []
      let sessionInfo: HeaderSessionInfo = null

      for (const record of eventWrapper) {
        const { event } = record

        if (event.method === 'NewSession') {
          sessionInfo = {
            sessionIndex: api
              .createType('SessionIndex', event.data[0])
              .toNumber(),
            eraIndex: (await api.query.staking.currentEra.at(hash))
              .unwrap()
              .toNumber(),
          }
          await db.bulkSave('Validator', await getValidators(api, hash))
        }
        if (event.method === 'Slash') {
          slashes.push({
            accountId: api.createType('AccountId', event.data[0]).toString(),
            amount: formatBalance(api.createType('Balance', event.data[1])),
          })
        }
        if (event.method === 'Reward') {
          rewards.push({
            amount: formatBalance(api.createType('Balance', event.data[0])),
          })
        }
        if (event.method === 'Offence') {
          offences.push({
            kind: api.createType('Kind', event.data[0]).toString(),
            timeSlot: api
              .createType('OpaqueTimeSlot', event.data[1])
              .toString(),
          })
        }
      }

      if (sessionInfo) {
        sessionInfo = { ...sessionInfo, rewards, offences, slashes }
        console.log(
          'Got session info for block: #',
          header.number.toNumber(),
          sessionInfo
        )
      }

      return {
        author,
        number,
        hash,
        timestamp,
        sessionInfo,
      }
    })
  )

  return enhancedHeaders
}

export const getValidators = async (api: ApiPromise, at?: string | Hash) => {
  console.log(
    'getting validators for',
    at
      ? 'block #' +
          at +
          ' in session #' +
          (await api.query.session.currentIndex.at(at))
      : 'current era'
  )

  if (!at) {
    at = await api.rpc.chain.getBlockHash()
  }

  const validators = await api.query.session.validators.at(at)
  const eraIndex = (await api.query.staking.currentEra.at(at))
    .unwrap()
    .toNumber()
  const sessionIndex = (await api.query.session.currentIndex.at(at)).toNumber()
  const queuedKeys = await api.query.session.queuedKeys.at(at)
  const validatorStakingRequests = []
  const controllerIds = await Promise.all(
    validators.map((accountId) => api.query.staking.bonded.at(at, accountId))
  )

  for (let index = 0; index < validators.length; index++) {
    const accountId = validators[index]
    const stashId = accountId
    const controllerId = controllerIds[index].unwrap()
    const sessionIds = (queuedKeys.find(([currentId]) =>
      currentId.eq(accountId)
    ) || [undefined, api.createType('Keys', [])])[1]

    validatorStakingRequests.push(
      Promise.all([
        //Workaround for TypeScript Bug https://github.com/microsoft/TypeScript/issues/22469
        Promise.all([
          eraIndex,
          sessionIndex,
          accountId,
          stashId,
          controllerId,
          api.query.staking.nominators.at(at, accountId),
          api.query.staking.erasStakers(eraIndex, accountId),
          sessionIds,
          api.query.session.nextKeys.at(at, accountId),
          api.query.staking.ledger.at(at, controllerId),
        ]),
        //Max number of safe overloads in Promise.all is 10
        Promise.all([api.query.staking.validators.at(at, accountId)]),
      ])
    )
  }

  const enhancedStakingInfo: EnhancedDerivedStakingQuery[] = (
    await Promise.all(validatorStakingRequests)
  ).map(
    ([
      [
        eraIndex,
        sessionIndex,
        accountId,
        stashId,
        controllerId,
        nominators,
        stakers,
        sessionIds,
        nextSessionIds,
        stakingLedger,
      ],
      [validatorPrefs],
    ]) => ({
      eraIndex,
      sessionIndex,
      accountId,
      stashId,
      controllerId,
      nominators: nominators.isSome ? nominators.unwrap().targets : [],
      exposure: stakers,
      sessionIds,
      nextSessionIds: nextSessionIds.isEmpty
        ? []
        : api.createType('Vec<AccountId>', nextSessionIds.unwrap()),
      stakingLedger: stakingLedger.unwrap(),
      validatorPrefs: api.createType(
        'ValidatorPrefs',
        validatorPrefs.toArray()[0]
      ),
    })
  )

  return enhancedStakingInfo
}

export const testPruning = async (api: ApiPromise, blockNumber: number) => {
  let headerHash = await api.rpc.chain.getBlockHash(blockNumber)
  let gotBlock = !isNullOrUndefined(
    await api.derive.chain.getHeader(headerHash).catch((e) => {
      console.log('pruning test failed on block', blockNumber)
    })
  )
  return gotBlock
}

export const getPreviousHeaders = async (
  api: ApiPromise,
  numberOfHeaders: number,
  startFromBlock: number
) => {
  let oldHeaders: EnhancedHeader[] = []

  let blockNumbers = Array.from(
    Array(numberOfHeaders),
    (x, index) => startFromBlock - index - 1
  )

  //Stop getting headers at 1, we don't need initial block
  blockNumbers = blockNumbers.filter((blockNumber) => blockNumber > 0)

  console.log('getting', blockNumbers.length, 'previous headers')

  for (let batch = 0; batch < blockNumbers.length / maxHeaderBatch; batch++) {
    let batchHeaderNumbers = blockNumbers.slice(
      batch * maxHeaderBatch,
      (batch + 1) * maxHeaderBatch
    )
    let batchHeaders = await getBlockHeaders(api, batchHeaderNumbers)

    oldHeaders = oldHeaders.concat(batchHeaders)
    if (batchHeaders.length < batchHeaderNumbers.length) break
  }

  return oldHeaders
}
