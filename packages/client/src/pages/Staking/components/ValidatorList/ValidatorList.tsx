import React from 'react'

import { ValidatorFormattedInterface } from 'types'
import { Loading } from 'ui'
import { ValidatorCard } from 'components'

import * as S from './styled'

type Props = {
  loading: boolean
  validators: ValidatorFormattedInterface[]
}

const ValidatorList = ({ loading, validators }: Props) => (
  <S.Wrapper>
    {loading ? (
      <Loading />
    ) : validators.length ? (
      validators.map((item, idx) => (
        <ValidatorCard
          key={`validatorCard-${idx}`}
          stashId={item.accountId}
          controllerId={item.commissionData.controllerId}
          bondedTotal={item.commissionData.nominatorData?.totalStake || '0.000'}
          bondedSelf={item.commissionData.bondedSelf || '0.000'}
          bondedFromNominators={
            item.commissionData.nominatorData?.nominatorStake || '0.000'
          }
          commission={item.commissionData.commission}
          blocksProducedCount={item.blocksProducedCount}
          slashes={item.slashes}
          recentlyOnline={item.recentlyOnline}
          sessionIds={item.commissionData.sessionIds}
          nextSessionIds={item.commissionData.nextSessionIds}
          nominators={item.commissionData.nominatorData?.stakers}
          current={item.currentValidator}
        />
      ))
    ) : (
      <S.NoData>No data available.</S.NoData>
    )}
  </S.Wrapper>
)

export default ValidatorList
