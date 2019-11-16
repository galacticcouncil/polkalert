import React, { useState } from 'react'
import { useDidUpdate } from 'react-hooks-lib'
import SVG from 'react-inlinesvg'
import CSS from 'csstype'

import * as S from './styled'

type Props = {
  type?: string
  fluid?: boolean
  name?: string
  disabled?: boolean
  label?: string
  placeholder?: string
  value: string
  required?: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
  style?: CSS.Properties
}

const Input = ({
  type = 'text',
  fluid,
  name,
  disabled,
  label,
  placeholder = '',
  value = '',
  required,
  onChange,
  className = '',
  style
}: Props) => {
  const [invalid, setInvalid] = useState<boolean>(false)
  const [valueVisible, setValueVisible] = useState<boolean>(false)

  useDidUpdate(() => {
    if (required) setInvalid(!value.replace(/\s/g, ''))
  }, [value])

  return (
    <S.Wrapper fluid={fluid} className={className} style={style}>
      {label && <S.Label>{label}</S.Label>}
      <S.InputWrapper invalid={invalid}>
        <S.Input
          name={name}
          disabled={disabled}
          type={type !== 'password' || !valueVisible ? type : 'text'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          style={{ padding: type === 'password' ? '12px 4px 12px 14px' : '12px 14px' }}
        />
        {type === 'password' && (
          <S.VisibilityToggle onClick={() => setValueVisible(!valueVisible)}>
            <SVG src={valueVisible ? '/icons/show.svg' : '/icons/hide.svg'}>
              <img
                src={valueVisible ? '/icons/show.svg' : '/icons/hide.svg'}
                alt={valueVisible ? 'Value visible' : 'Value hidden'}
              />
            </SVG>
          </S.VisibilityToggle>
        )}
      </S.InputWrapper>
    </S.Wrapper>
  )
}

export default Input
