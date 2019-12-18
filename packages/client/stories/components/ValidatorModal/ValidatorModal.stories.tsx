import React from 'react'
import { storiesOf } from '@storybook/react'

import { PageTitle, Table } from 'ui'
import { NOOP } from 'utils'

import * as S from 'components/ValidatorModal/styled'

storiesOf('COMPONENTS|ValidatorModal', module).add('default', () => {
  return (
    <S.Wrapper onClose={NOOP}>
      <S.Content>
        <PageTitle style={{ marginBottom: '24px' }}>Slashes</PageTitle>
        <Table
          id="storybook-validatorModal-slashes"
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
          data={[
            {
              amount: '100 KSM',
              sessionIndex: '1'
            },
            {
              amount: '200 KSM',
              sessionIndex: '2'
            }
          ]}
          style={{ paddingBottom: '80px' }}
        />
        <PageTitle style={{ marginBottom: '24px' }}>Blocks Produced</PageTitle>
        <Table
          id="storybook-validatorModal-blocksProduced"
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
          data={[
            {
              timestamp: '1576688348',
              blockHash: '1234567890'
            },
            {
              timestamp: '1576688348',
              blockHash: '1234567890'
            },
            {
              timestamp: '1576688348',
              blockHash: '1234567890'
            },
            {
              timestamp: '1576688348',
              blockHash: '1234567890'
            },
            {
              timestamp: '1576688348',
              blockHash: '1234567890'
            }
          ]}
        />
      </S.Content>
    </S.Wrapper>
  )
})
