import React, { useState } from 'react'
import { useDidUpdate } from 'react-hooks-lib'
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
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </S.InputWrapper>
    </S.Wrapper>
  )
}

export default Input
