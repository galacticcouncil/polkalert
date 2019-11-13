import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'
import { boolean, text } from '@storybook/addon-knobs'

import { Textarea } from 'ui'

storiesOf('UI|Textarea', module).add('default', () => {
  const [value, setValue] = useState<string>('')

  const fluidKnob = boolean('fluid', false, 'props')
  const labelKnob = text('label', 'Fancy textarea', 'props')
  const placeholderKnob = text(
    'placeholder',
    'Enter a short message...',
    'props'
  )
  const requiredKnob = boolean('required', false, 'props')

  return (
    <div style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
      <Textarea
        fluid={fluidKnob}
        label={labelKnob}
        placeholder={placeholderKnob}
        required={requiredKnob}
        value={value}
        onChange={e => setValue(e.target.value)}
      />
    </div>
  )
})
