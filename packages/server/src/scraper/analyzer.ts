import { ApiPromise } from '@polkadot/api'
import { Vec } from '@polkadot/types'
import { EventRecord } from '@polkadot/types/interfaces'
import notifications from '../notifications'
import settings from '../settings'
import db from '../db'
import { formatBalance } from '@polkadot/util'

export const analyzeExtrinsics = async (api: ApiPromise, blockHash: string) => {
  const signedBlock = await api.rpc.chain.getBlock(blockHash)
  //TODO should be refactored to get events only once,
  //suggest to move event analysis from subscribeEvents here
  const systemEvents = await api.query.system.events.at(blockHash)
  signedBlock.block.extrinsics.forEach(async (extrinsic, index) => {
    let methodName = extrinsic.method.methodName
    let signer = extrinsic.signer
    let args = extrinsic.method.args

    if (methodName === 'nominate') {
      let validatorFound = false
      if (isExtrinsicSucceed(index, systemEvents)) {
        api.createType('Vec<Address>', args[0]).forEach(async arg => {
          if (arg.toString() === settings.get().validatorId) {
            notifications.sendNominatedMessage(signer.toString())

            validatorFound = true
          }
        })
        if (!validatorFound) {
          //TODO cache?
          const validatorInfo = await db.getValidatorInfo(
            settings.get().validatorId
          )
          const commissionData = validatorInfo.commissionData.filter(
            data => data.nominatorData
          )
          const nominatorData = JSON.parse(commissionData[0].nominatorData)
          const ledger = await api.query.staking.ledger(signer.toString())
          const stash = ledger.unwrap().stash.toString()
          nominatorData.stakers.forEach((stakerData: any) => {
            if (stash.toString() === stakerData.accountId.toString()) {
              notifications.sendDenominateMessage(stash.toString())
            }
          })
        }
      }
    }

    if (methodName === 'bond') {
      let controller = api.createType('Address', args[0])
      if (controller.toString() === settings.get().validatorId) {
        if (isExtrinsicSucceed(index, systemEvents)) {
          let amount = api.createType('Compact<Balance>', args[1])
          notifications.sendBondedMessage(
            signer.toString(),
            formatBalance(api.createType('Balance', amount))
          )
        }
      }
    }

    if (methodName === 'bondExtra') {
      const validatorInfo = await db.getValidatorInfo(
        settings.get().validatorId
      )

      //TODO change nominator data to object
      const nominatorData = JSON.parse(
        validatorInfo.commissionData[0].nominatorData
      )
      if (nominatorData && nominatorData.stakers) {
        nominatorData.stakers.forEach((stakerData: any) => {
          if (signer.toString() === stakerData.accountId.toString()) {
            if (isExtrinsicSucceed(index, systemEvents)) {
              let amount = api.createType('Compact<Balance>', args[0])
              notifications.sendBondedExtraMessage(
                signer.toString(),
                formatBalance(api.createType('Balance', amount))
              )
            }
          }
        })
      }
    }

    if (methodName === 'unbond') {
      const validatorInfo = await db.getValidatorInfo(
        settings.get().validatorId
      )
      const ledger = await api.query.staking.ledger(signer.toString())
      const stash = ledger.unwrap().stash.toString()
      //TODO change nominator data to object
      const nominatorData = JSON.parse(
        validatorInfo.commissionData[0].nominatorData
      )
      if (nominatorData && nominatorData.stakers) {
        nominatorData.stakers.forEach((stakerData: any) => {
          console.log('nominator id ' + stakerData.accountId.toString())
          if (stash === stakerData.accountId.toString()) {
            if (isExtrinsicSucceed(index, systemEvents)) {
              let amount = formatBalance(api.createType('Balance', args[0]))
              notifications.sendUnbondedMessage(stash, amount)
              if (parseFloat(amount) >= parseFloat(stakerData.stake)) {
                notifications.sendUnbondedEverythingMessage(stash)
              }
            }
          }
        })
      }
    }
  })
}

function isExtrinsicSucceed(
  extrinsicIndex: number,
  systemEvents: Vec<EventRecord>
): boolean {
  let index = systemEvents
    .filter(event => event.phase.asApplyExtrinsic.toNumber() === extrinsicIndex)
    .filter(event => event.event.method === 'ExtrinsicSuccess')
  if (index[0]) {
    return true
  }
  return false
}

export const testEquivocation = (
  header1: EnhancedHeader,
  header2: EnhancedHeader
) => {
  if (
    header1.number === header2.number &&
    header1.author === header2.author &&
    header1.hash !== header2.hash
  ) {
    notifications.sendEquivocatingMessage(
      header1.author,
      header1.hash,
      header2.hash
    )
    return true
  } else return false
}
