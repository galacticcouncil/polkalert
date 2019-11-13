import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'
import { boolean, text } from '@storybook/addon-knobs'

import { Input } from 'ui'

storiesOf('UI|Input', module).add('default', () => {
  const [value, setValue] = useState('This is the value of the input')

  const disabledKnob = boolean('disabled', false, 'props')
  const typeKnob = text('type', 'text', 'props')
  const placeholderKnob = text('placeholder', 'Placeholder text', 'props')
  const fluidKnob = boolean('fluid', false, 'props')
  const labelKnob = text('label', 'Fancy input', 'props')
  const requiredKnob = boolean('required', false, 'props')

  return (
    <div style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
      <Input
        disabled={disabledKnob}
        type={typeKnob}
        fluid={fluidKnob}
        label={labelKnob}
        placeholder={placeholderKnob}
        value={value}
        required={requiredKnob}
        onChange={e => setValue(e.target.value)}
      />
    </div>
  )
})
