import React, { useRef } from 'react'
import SVG from 'react-inlinesvg'
import CSS from 'csstype'

import { UiOptionType } from 'types'
import { useFocusTracker } from 'hooks'

import * as S from './styled'

type Props = {
  id: string
  fluid?: boolean
  options: UiOptionType[]
  value: UiOptionType
  onChange: (option: UiOptionType) => void
  className?: string
  style?: CSS.Properties
}

const Select = ({
  id,
  fluid,
  value,
  options,
  onChange,
  className = '',
  style
}: Props) => {
  const valueRef = useRef<HTMLDivElement>(null)
  const focused = useFocusTracker(valueRef, true)

  return (
    <S.Wrapper fluid={fluid} className={className} style={style}>
      <S.Value ref={valueRef}>
        {value}
        <SVG src="/icons/arrow-down.svg">
          <img src="/icons/arrow-down.svg" alt="toggle" />
        </SVG>
      </S.Value>
      {options && (
        <S.DropdownList isOpen={focused}>
          <S.DropdownCard>
            {options.map((item, idx) => (
              <S.Option
                key={`dropdown-${id}-option-${idx}`}
                active={item === value}
                onClick={() => onChange(item)}
              >
                {typeof item === 'object' ? item.label || '' : item}
              </S.Option>
            ))}
          </S.DropdownCard>
        </S.DropdownList>
      )}
    </S.Wrapper>
  )
}

export default Select
