import React from 'react'
import { storiesOf } from '@storybook/react'

import { PageTitle, Identicon, Table } from 'ui'
import { formatAddress } from 'utils'
import { NOOP } from 'utils'

import * as S from 'components/ValidatorModal/styled'

storiesOf('COMPONENTS|ValidatorModal', module).add('default', () => {
  return (
    <S.Wrapper onClose={NOOP}>
      <S.Content>
        <PageTitle style={{ marginBottom: '24px' }}>Session IDs</PageTitle>
        <S.Addresses>
          {[...Array(7)].map((_, idx) => (
            <S.Address key={`storybook-validatorModal-sessionId-${idx}`}>
              <Identicon
                value="GARHv4dakmEBS3W4PDUtsXmnsu8NN91kGQDyP9h9FFXaTof"
                size={40}
              />
              <span>
                {formatAddress(
                  'GARHv4dakmEBS3W4PDUtsXmnsu8NN91kGQDyP9h9FFXaTof'
                )}
              </span>
            </S.Address>
          ))}
        </S.Addresses>
        <PageTitle style={{ marginBottom: '24px' }}>Next session IDs</PageTitle>
        <S.Addresses>
          {[...Array(7)].map((_, idx) => (
            <S.Address key={`storybook-validatorModal-nextSessionId-${idx}`}>
              <Identicon
                value="GARHv4dakmEBS3W4PDUtsXmnsu8NN91kGQDyP9h9FFXaTof"
                size={40}
              />
              <span>
                {formatAddress(
                  'GARHv4dakmEBS3W4PDUtsXmnsu8NN91kGQDyP9h9FFXaTof'
                )}
              </span>
            </S.Address>
          ))}
        </S.Addresses>
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
