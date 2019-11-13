import React, { forwardRef, useImperativeHandle } from 'react'
import { createPortal } from 'react-dom'
import CSS from 'csstype'

import { useBooleanState } from 'hooks'

import * as S from './styled'

export const SnackbarThemes = [
  'white',
  'primary',
  'gray100',
  'gray200',
  'gray300',
  'gray400',
  'success',
  'warning',
  'error',
  'yellow',
  'orange',
  'blue'
] as const

type Theme = typeof SnackbarThemes[number]

type Handles = {
  open: () => void
}

type Props = {
  theme?: Theme
  lifetime?: number
  permanent?: boolean
  children?: React.ReactNode[] | React.ReactNode | string
  className?: string
  style?: CSS.Properties
}

// @ts-ignore
const Snackbar: React.RefForwardingComponent<Handles, Props> = (
  {
    theme = 'primary',
    lifetime = 3000,
    permanent = false,
    children,
    className = '',
    style
  },
  ref
) => {
  const [visible, show, hide] = useBooleanState()
  const [animInProgress, animStarted, animFinished] = useBooleanState()

  useImperativeHandle(ref, () => ({
    open: () => {
      if (!permanent && !visible && !animInProgress) {
        show()
        animStarted()

        setTimeout(hide, lifetime)
        setTimeout(animFinished, lifetime + 1000)
      }
    }
  }))

  return (
    (permanent || animInProgress) &&
    createPortal(
      <S.Wrapper
        theme={SnackbarThemes.includes(theme) ? theme : 'primary'}
        permanent={permanent}
        hideAnimation={animInProgress && !visible}
        className={className}
        style={style}
      >
        {children}
      </S.Wrapper>,
      document.body
    )
  )
}

export default forwardRef(Snackbar)
