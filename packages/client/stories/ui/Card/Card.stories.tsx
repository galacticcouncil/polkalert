import React from 'react'
import { storiesOf } from '@storybook/react'
import { boolean, text } from '@storybook/addon-knobs'

import { Card } from 'ui'

storiesOf('UI|Card', module).add('default', () => {
  const fluidKnob = boolean('Fluid', false, 'props')
  const titleKnob = text('Title', 'Gingerbread brownie', 'props')
  const textKnob = text(
    'Text',
    'Cupcake ipsum dolor sit amet caramels carrot cake. Pie pudding oat cake gingerbread dragée cotton candy.',
    'props'
  )

  return (
    <Card fluid={fluidKnob} title={titleKnob} style={{ margin: '24px auto' }}>
      {textKnob}
    </Card>
  )
})
