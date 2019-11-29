import React from 'react'
import { storiesOf } from '@storybook/react'
import { text, number, boolean } from '@storybook/addon-knobs'

import { Identicon } from 'ui'

storiesOf('UI|Identicon', module).add('default', () => {
  const valueKnob = text(
    'value',
    '5GeJHN5EcUGPoa5pUwYkXjymoDVN1DJHsBR4UGX4XRAwK1Ez',
    'props'
  )
  const sizeKnob = number('size', 48, {}, 'props')
  const whatIsCopiedKnob = text('whatIsCopied', 'Address', 'props')
  const currentKnob = boolean('current', true, 'props')

  return (
    <div
      style={{
        width: '100%',
        padding: 24,
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <Identicon
        value={valueKnob}
        size={sizeKnob}
        whatIsCopied={whatIsCopiedKnob}
        current={currentKnob}
      />
    </div>
  )
})
