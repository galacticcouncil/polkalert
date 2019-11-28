import React from 'react'
import _isEmpty from 'lodash/isEmpty'
import CSS from 'csstype'

import { SelectionGroupOption } from 'types'

import * as S from './styled'

type Props = {
  id: string
  label?: string
  options: SelectionGroupOption[]
  value: SelectionGroupOption
  onChange: (option: SelectionGroupOption) => void
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
