import React from 'react'
import { storiesOf } from '@storybook/react'
import { text, number, boolean } from '@storybook/addon-knobs'

import { ValidatorCard } from 'components'

storiesOf('COMPONENTS|ValidatorCard', module).add('default', () => {
  const stashIdKnob = text(
    'accountId',
    '5DuiZFa184E9iCwbh4WjXYvJ88NHvWJbS8SARY8Ev1YEqrri',
    'props'
  )
  const controllerIdKnob = text(
    'controlledId',
    '5GeJHN5EcUGPoa5pUwYkXjymoDVN1DJHsBR4UGX4XRAwK1Ez',
    'props'
  )
  const bondedTotalKnob = text('bondedTotal', '600', 'props')
  const bondedSelfKnob = text('bondedSelf', '500', 'props')
  const bondedFromNominatorsKnob = text('bondedFromNominators', '100', 'props')
  const commissionKnob = text('commission', '1.000', 'props')
  const blocksProducedCountKnob = number('blocksProducedCount', 10, {}, 'props')
  const slashesKnob = number('slashes', 10, {}, 'props')
  const recentlyOnlineKnob = boolean('recentlyOnline', true, 'props')
  const sessionIdsKnob = number('Session IDs amount', 10, {})
  const nextSessionIdsKnob = number('Next sessions IDs amount', 10, {})
  const nominatorsKnob = number('Nominators amount', 10, {})
  const currentKnob = boolean('current', true, 'props')

  return (
    <div style={{ padding: '24px' }}>
      <ValidatorCard
        hideInfoButton
        stashId={stashIdKnob}
        controllerId={controllerIdKnob}
        bondedTotal={bondedTotalKnob}
        bondedSelf={bondedSelfKnob}
        bondedFromNominators={bondedFromNominatorsKnob}
        commission={commissionKnob}
        blocksProducedCount={blocksProducedCountKnob}
        slashes={[...Array(slashesKnob)].map((_, idx) => ({
          amount: '0',
          sessionIndex: idx.toString()
        }))}
        recentlyOnline={recentlyOnlineKnob}
        sessionIds={[...Array(sessionIdsKnob)].map(
          _ => '5GeJHN5EcUGPoa5pUwYkXjymoDVN1DJHsBR4UGX4XRAwK1Ez'
        )}
        nextSessionIds={[...Array(nextSessionIdsKnob)].map(
          _ => '5GeJHN5EcUGPoa5pUwYkXjymoDVN1DJHsBR4UGX4XRAwK1Ez'
        )}
        nominators={[...Array(nominatorsKnob)].map(_ => ({
          accountId: '5H1Dxuh2Ted6XUmAWfzeJvZWDFcNkrpCyQvV5yZafqnnd3V1',
          stake: '10.000 KSM'
        }))}
        current={currentKnob}
        style={{ margin: '0 auto' }}
      />
    </div>
  )
})
