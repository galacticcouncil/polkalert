import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'
import { boolean, select, text } from '@storybook/addon-knobs'

import { Button, ButtonThemes } from 'ui'

storiesOf('UI|Button', module).add('default', () => {
  const fluidKnob = boolean('Fluid', false, 'props')
  const disabledKnob = boolean('Disabled', false, 'props')
  const themeKnob = select('Theme', ButtonThemes, 'primary', 'props')
  const condensedKnob = boolean('Condensed', false, 'props')
  const textKnob = text('Text', 'Button', 'props')

  return (
    <div style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
      <Button
        fluid={fluidKnob}
        disabled={disabledKnob}
        theme={themeKnob}
        condensed={condensedKnob}
        text={textKnob}
      />
    </div>
  )
})
