import React from 'react'
import { useQuery } from '@apollo/react-hooks'

import VALIDATORINFO_QUERY from 'apollo/queries/validatorInfo'
import { PageTitle, Identicon, Table } from 'ui'
import { formatAddress } from 'utils'

import * as S from './styled'

type Props = {
  onClose: () => void
  accountId: string
}

const ValidatorModal = ({ onClose, accountId }: Props) => {
  const { data } = useQuery(VALIDATORINFO_QUERY, {
    variables: {
      accountId
    }
  })

  return (
    <S.Wrapper onClose={onClose}>
      <S.Content>
        <PageTitle style={{ marginBottom: '24px' }}>Session IDs</PageTitle>
        <S.Addresses>
          {data?.validator?.commissionData ? (
            data.validator.commissionData[0].sessionIds.map((item, idx) => (
              <S.Address key={`validatorModal-sessionId-${idx}`}>
                <Identicon value={item} size={40} />
                <span>{formatAddress(item)}</span>
              </S.Address>
            ))
          ) : (
            <S.NoData>No data available.</S.NoData>
          )}
        </S.Addresses>
        <PageTitle style={{ marginBottom: '24px' }}>Next session IDs</PageTitle>
        <S.Addresses>
          {data?.validator?.commissionData ? (
            data.validator.commissionData[0].nextSessionIds.map((item, idx) => (
              <S.Address key={`validatorModal-nextSessionId-${idx}`}>
                <Identicon value={item} size={40} />
                <span>{formatAddress(item)}</span>
              </S.Address>
            ))
          ) : (
            <S.NoData>No data available.</S.NoData>
          )}
        </S.Addresses>
        <PageTitle style={{ marginBottom: '24px' }}>Slashes</PageTitle>
        <Table
          id="validatorModal-slashes"
          headers={[
            {
              text: 'Amount',
              key: 'amount'
            },
            {
              text: 'Session index',
              key: 'sessionIndex'
            }
          ]}
          data={data?.validator?.slashes}
          style={{ paddingBottom: '80px' }}
        />
        <PageTitle style={{ marginBottom: '24px' }}>Blocks Produced</PageTitle>
        <Table
          id="validatorModal-blocksProduced"
          headers={[
            {
              text: 'Timestamp',
              key: 'timestamp'
            },
            {
              text: 'Block hash',
              key: 'blockHash'
            }
          ]}
          data={data?.validator?.blocksProduced}
        />
      </S.Content>
    </S.Wrapper>
  )
}

export default ValidatorModal
