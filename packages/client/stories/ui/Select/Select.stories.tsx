import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'
import { boolean, array } from '@storybook/addon-knobs'

import { Select } from 'ui'

storiesOf('UI|Select', module).add('default', () => {
  const [value, setValue] = useState('Cupcake')

  const fluidKnob = boolean('Fluid', false, 'props')
  const optionsKnob = array(
    'Options',
    ['Cupcake', 'Caramels', 'Carrot', 'Cake'],
    ', ',
    'props'
  )

  return (
    <Select
      id="demo-select"
      fluid={fluidKnob}
      value={value}
      options={optionsKnob}
      onChange={setValue}
      style={{ margin: '24px auto' }}
    />
  )
})
