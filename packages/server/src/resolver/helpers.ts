import connector from '../connector'
import { Validator } from '../entity/Validator'
import scraper from '../scraper'

export const addCurrentEraInfoToValidators = async (
  validators: Validator[]
) => {
  const api = connector.getApi()
  const currentValidators = await scraper.getValidators(api)
  const validatorsWithCurrentEraInfo = validators.map(validator => {
    const isCurrent =
      currentValidators.findIndex(
        currentValidator =>
          currentValidator.accountId.toString() ===
          validator.accountId.toString()
      ) >= 0
    let currentValidator = isCurrent

    return { ...validator, currentValidator }
  })

  return validatorsWithCurrentEraInfo
}

export const addDerivedHeartbeatsToValidators = async (
  validators: Validator[]
) => {
  const api = connector.getApi()
  if (!api) return validators

  const onlineStatus = await api.derive.imOnline.receivedHeartbeats()

  return validators.map(validator => {
    let recentlyOnline = false

    if (onlineStatus[validator.accountId])
      recentlyOnline = onlineStatus[validator.accountId].isOnline

    return { ...validator, recentlyOnline }
  })
}
