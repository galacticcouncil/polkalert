import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'
import { text, array } from '@storybook/addon-knobs'

import { RadioGroup } from 'ui'

const options = ['Hello', 'World', 'Option 3']

storiesOf('UI|RadioGroup', module).add('default', () => {
  const [value, setValue] = useState(options[0])

  const labelKnob = text('Label', 'Radio Group Label', 'props')
  const optionsKnob = array('Options', options, ', ', 'props')

  return (
    <div style={{ padding: 24 }}>
      <RadioGroup
        id="storybook-radioGroup"
        label={labelKnob}
        options={optionsKnob}
        value={value}
        onChange={setValue}
      />
    </div>
  )
})
