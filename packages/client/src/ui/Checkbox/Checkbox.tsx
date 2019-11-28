import React from 'react'
import SVG from 'react-inlinesvg'
import CSS from 'csstype'

import * as S from './styled'

type Props = {
  label: string
  value: boolean
  onChange: (value: boolean) => void
  className?: string
  style?: CSS.Properties
}

const Checkbox = ({ label, value, onChange, className = '', style }: Props) => (
  <S.Wrapper
    onClick={() => onChange(!value)}
    className={className}
    style={style}
  >
    <S.Icon active={value}>
      <SVG src="/icons/check.svg">
        <img src="/icons/check.svg" alt="Check" />
      </SVG>
    </S.Icon>
    <S.Text>{label}</S.Text>
  </S.Wrapper>
)

export default Checkbox
