import React from 'react'
import { storiesOf } from '@storybook/react'
import { text } from '@storybook/addon-knobs'

import { Divider } from 'ui'

storiesOf('UI|Divider', module).add('default', () => {
  const paddingKnob = text('padding', '0 0 16px 0', 'props')
  const childrenKnob = text('children', 'Divider', 'props')

  return (
    <div style={{ padding: '24px' }}>
      <Divider padding={paddingKnob}>{childrenKnob}</Divider>
    </div>
  )
})
