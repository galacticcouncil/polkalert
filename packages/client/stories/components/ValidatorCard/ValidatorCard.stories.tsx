import React from 'react'
import { storiesOf } from '@storybook/react'
import { text, number } from '@storybook/addon-knobs'

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
  const sessionIdKnob = text(
    'sessionId',
    '5GeJHN5EcUGPoa5pUwYkXjymoDVN1DJHsBR4UGX4XRAwK1Ez',
    'props'
  )
  const bondedTotalKnob = text('bondedTotal', '600', 'props')
  const bondedSelfKnob = text('bondedSelf', '500', 'props')
  const bondedFromNominatorsKnob = text('bondedFromNominators', '100', 'props')
  const commissionKnob = text('commission', '1.000', 'props')
  const nominatorsKnob = number('Nominators amount', 10, {})

  return (
    <div style={{ padding: '0 24px' }}>
      <ValidatorCard
        stashId={stashIdKnob}
        controllerId={controllerIdKnob}
        sessionId={sessionIdKnob}
        bondedTotal={bondedTotalKnob}
        bondedSelf={bondedSelfKnob}
        bondedFromNominators={bondedFromNominatorsKnob}
        commission={commissionKnob}
        nominators={[...Array(nominatorsKnob)].map(_ => ({
          accountId: '5H1Dxuh2Ted6XUmAWfzeJvZWDFcNkrpCyQvV5yZafqnnd3V1',
          stake: '10'
        }))}
        style={{ margin: '24px auto' }}
      />
    </div>
  )
})
