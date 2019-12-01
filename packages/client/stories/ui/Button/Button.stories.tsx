import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'
import { boolean, select, text } from '@storybook/addon-knobs'

import { Button, ButtonThemes } from 'ui'

storiesOf('UI|Button', module).add('default', () => {
  const fluidKnob = boolean('fluid', false, 'props')
  const disabledKnob = boolean('disabled', false, 'props')
  const themeKnob = select('theme', ButtonThemes, 'primary', 'props')
  const condensedKnob = boolean('condensed', false, 'props')
  const pulsingKnob = boolean('pulsing', false, 'props')
  const textKnob = text('Text', 'Button', 'props')

  return (
    <div style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
      <Button
        fluid={fluidKnob}
        disabled={disabledKnob}
        theme={themeKnob}
        condensed={condensedKnob}
        pulsing={pulsingKnob}
        text={textKnob}
      />
    </div>
  )
})
