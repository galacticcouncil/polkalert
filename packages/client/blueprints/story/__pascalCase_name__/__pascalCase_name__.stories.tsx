import React from 'react'
import { storiesOf } from '@storybook/react'
import { text } from '@storybook/addon-knobs'

import { {{pascalCase name}} } from '{{$category}}'

storiesOf('{{upperCase $category}}|{{pascalCase name}}', module).add('default', () => {
  const sampleKnob = text('Sample prop', 'Default value', 'props')

  return <{{pascalCase name}} sampleProp={sampleKnob} />
})
