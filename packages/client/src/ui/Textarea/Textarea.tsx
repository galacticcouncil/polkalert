import React, { useState } from 'react'
import { useDidUpdate } from 'react-hooks-lib'
import CSS from 'csstype'

import * as S from './styled'

type Props = {
  fluid?: boolean
  label?: string
  name?: string
  placeholder?: string
  value: string
  required?: boolean
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  className?: string
  style?: CSS.Properties
}

const Textarea = ({
  fluid,
  label,
  name,
  placeholder,
  value,
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
      <S.TextareaWrapper invalid={invalid}>
        <S.Textarea
          rows={4}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </S.TextareaWrapper>
    </S.Wrapper>
  )
}

export default Textarea
