import React from 'react'

import { ValidatorFormattedInterface } from 'types'
import { Loading } from 'ui'
import { ValidatorCard } from 'components'

import * as S from './styled'

type Props = {
  validators: ValidatorFormattedInterface[]
}

const ValidatorList = ({ validators }: Props) => (
  <S.Wrapper>
    {validators.length ? (
      validators.map((item, idx) => (
        <ValidatorCard
          key={`validatorCard-${idx}`}
          stashId={item.accountId}
          controllerId={item.commissionData[0].controllerId}
          sessionId={item.commissionData[0].sessionId}
          bondedTotal={
            item.commissionData[0].nominatorData?.totalStake || '0.000'
          }
          bondedSelf={item.commissionData[0].bondedSelf || '0.000'}
          bondedFromNominators={
            item.commissionData[0].nominatorData?.nominatorStake || '0.000'
          }
          commission={item.commissionData[0].commission}
          blocksProduced={item.blocksProduced}
          blocksProducedCount={item.blocksProducedCount}
          slashes={item.slashes}
          recentlyOnline={item.recentlyOnline}
          nominators={item.commissionData[0].nominatorData?.stakers}
          current={item.currentValidator}
        />
      ))
    ) : (
      <Loading />
    )}
  </S.Wrapper>
)

export default ValidatorList
