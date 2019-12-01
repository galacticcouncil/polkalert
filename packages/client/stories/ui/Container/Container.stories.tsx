import React from 'react'
import { storiesOf } from '@storybook/react'
import { text } from '@storybook/addon-knobs'

import { Container } from 'ui'

storiesOf('UI|Container', module).add('default', () => {
  const maxWidthKnob = text('maxWidth', '', 'props')

  return (
    <Container maxWidth={maxWidthKnob} style={{ background: 'black' }}>
      <div style={{ padding: '16px 0', color: 'white' }}>
        Content Of The Container
      </div>
    </Container>
  )
})
