import React, { useRef, useEffect } from 'react'
import { storiesOf } from '@storybook/react'
import { select, text } from '@storybook/addon-knobs'

import { Snackbar, SnackbarThemes } from 'ui'
import { useBooleanState } from 'hooks'

storiesOf('UI|Snackbar', module)
  .add('permanent', () => {
    const themeKnob = select('Theme', SnackbarThemes, 'success', 'props')
    const textKnob = text('Text', 'I am a snackbar :)', 'props')

    return (
      <Snackbar theme={themeKnob} permanent>
        {textKnob}
      </Snackbar>
    )
  })
  .add('with animation', () => {
    const snackbarRef = useRef()
    const [buttonVisible, showButton] = useBooleanState()

    const themeKnob = select('Theme', SnackbarThemes, 'success', 'props')
    const textKnob = text('Text', 'I am a snackbar :)', 'props')

    useEffect(() => {
      if (snackbarRef.current) showButton()
    }, [snackbarRef])

    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {buttonVisible && (
          <button
            onClick={() => snackbarRef.current.open()}
            style={{ color: 'white', fontSize: '24px' }}
          >
            Show Snackbar
          </button>
        )}
        <Snackbar ref={snackbarRef} theme={themeKnob}>
          {textKnob}
        </Snackbar>
      </div>
    )
  })
