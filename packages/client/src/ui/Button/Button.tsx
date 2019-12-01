import React from 'react'
import CSS from 'csstype'

import { NOOP } from 'utils'

import * as S from './styled'

export const ButtonThemes = [
  'primary',
  'error',
  'outline',
  'outlineMini',
  'transparent'
] as const

type ButtonType = 'button' | 'submit' | 'reset' | undefined

type Theme = typeof ButtonThemes[number]

type Props = {
  fluid?: boolean
  type?: ButtonType
  theme?: Theme
  disabled?: boolean
  condensed?: boolean
  text: string
  pulsing?: boolean
  onClick?: () => void
  className?: string
  style?: CSS.Properties
}

const Button = ({
  fluid,
  type,
  theme = 'primary',
  disabled,
  condensed,
  text,
  pulsing,
  onClick,
  className = '',
  style
}: Props) => (
  <S.Wrapper
    fluid={fluid}
    type={type}
    theme={ButtonThemes.includes(theme) ? theme : 'primary'}
    disabled={disabled}
    condensed={condensed}
    pulsing={pulsing}
    onClick={onClick || NOOP}
    className={className}
    style={style}
  >
    {text}
  </S.Wrapper>
)

export default Button
