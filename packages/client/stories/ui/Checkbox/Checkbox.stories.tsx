import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'
import { text } from '@storybook/addon-knobs'

import { Checkbox } from 'ui'

storiesOf('UI|Checkbox', module).add('default', () => {
  const [value, setValue] = useState(false)

  const labelKnob = text('label', 'Checkbox', 'props')

  return (
    <div style={{ padding: '24px', display: 'flex', justifyContent: 'center' }}>
      <Checkbox label={labelKnob} value={value} onChange={setValue} />
    </div>
  )
})
