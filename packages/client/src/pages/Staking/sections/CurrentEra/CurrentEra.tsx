import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { useSelector } from 'react-redux'

// import { UiOptionType } from 'types'
import { ValidatorInterface } from 'types'
// import { Loading, Select } from 'ui'
import { Loading } from 'ui'
import { ValidatorCard } from 'components'
import { GetValidatorsQuery } from 'apollo/queries'
import { apiSelector } from 'selectors'
import stakingDemo from 'mocks/staking'

import * as S from './styled'

type Data = {
  validators: ValidatorInterface[]
}

type QueryResult = {
  data: Data
}

const CurrentEra = () => {
  // const filterOptions = [
  //   'Show all validators and intentions',
  //   'Show only my nominations',
  //   'Show only with nominators',
  //   'Show only without nominators',
  //   'Show only with warnings',
  //   'Show only without warnings'
  // ]

  // const [filter, setFilter] = useState<UiOptionType>(filterOptions[0])

  const api = useSelector(apiSelector)

  const query = useQuery(GetValidatorsQuery, {
    pollInterval: 10000
  })

  const { data } = api.demo ? (stakingDemo as QueryResult) : query

  return (
    <S.Wrapper>
      {data?.validators?.length ? (
        data.validators
          .filter(item => item.currentValidator)
          .map((item, idx) => {
            // TEMP SOLUTION, THE DATA STRUCTURE WILL CHANGE
            const itemFormatted = {
              ...item,
              commissionData: item.commissionData?.length
                ? item.commissionData.map(data => ({
                  ...data,
                  nominatorData: data.nominatorData
                    ? JSON.parse(data.nominatorData)
                    : {}
                }))
                : [{}]
            }

            return (
              <ValidatorCard
                key={`validatorCard-${idx}`}
                stashId={itemFormatted.accountId}
                controllerId={itemFormatted.commissionData[0].controllerId}
                sessionId={itemFormatted.commissionData[0].sessionId}
                bondedTotal={
                  itemFormatted.commissionData[0].nominatorData?.totalStake ||
                  '0.000'
                }
                bondedSelf={
                  itemFormatted.commissionData[0].bondedSelf || '0.000'
                }
                bondedFromNominators={
                  itemFormatted.commissionData[0].nominatorData
                    ?.nominatorStake || '0.000'
                }
                commission={itemFormatted.commissionData[0].commission}
                blocksProduced={itemFormatted.blocksProduced}
                slashes={itemFormatted.slashes}
                recentlyOnline={itemFormatted.recentlyOnline}
                nominators={
                  itemFormatted.commissionData[0].nominatorData?.stakers
                }
                current={itemFormatted.currentValidator}
              />
            )
          })
      ) : (
        <Loading />
      )}
    </S.Wrapper>
  )
}

export default CurrentEra
