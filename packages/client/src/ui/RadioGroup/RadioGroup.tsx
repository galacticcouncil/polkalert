import React from 'react'
import _isEmpty from 'lodash/isEmpty'
import CSS from 'csstype'

import { UiOptionType } from 'types'

import * as S from './styled'

type Props = {
  id: string
  label?: string
  options: UiOptionType[]
  value: UiOptionType
  onChange: (option: UiOptionType) => void
  className?: string
  style?: CSS.Properties
}

const RadioGroup = ({
  id,
  label,
  options,
  value,
  onChange,
  className = '',
  style
}: Props) => (
  <S.Wrapper className={className} style={style}>
    {label && <S.Label>{label}</S.Label>}
    {!_isEmpty(options) &&
      options.map((item, idx) => (
        <S.Option
          key={`radioGroup-${id}-${idx}`}
          active={item === value}
          onClick={() => onChange(item)}
        >
          {typeof item === 'object' ? item.label || '' : item}
        </S.Option>
      ))}
  </S.Wrapper>
)

export default RadioGroup
