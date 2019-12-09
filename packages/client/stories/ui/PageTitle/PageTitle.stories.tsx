import React from 'react'
import { storiesOf } from '@storybook/react'
import { text } from '@storybook/addon-knobs'

import { PageTitle } from 'ui'

storiesOf('UI|PageTitle', module).add('default', () => {
  const childrenKnob = text('children', 'Page title', 'props')

  return (
    <div style={{ padding: '24px' }}>
      <PageTitle>{childrenKnob}</PageTitle>
    </div>
  )
})
