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
  numeric?: boolean
  value: string
  required?: boolean
  tooltip?: string
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
  numeric,
  value = '',
  required,
  tooltip,
  onChange,
  className = '',
  style
}: Props) => {
  const [invalid, setInvalid] = useState<boolean>(false)
  const [valueVisible, setValueVisible] = useState<boolean>(false)

  useDidUpdate(() => {
    if (required) setInvalid(!value.replace(/\s/g, ''))
  }, [value])

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (numeric) {
      const eCopy = e
      eCopy.target.value = eCopy.target.value.replace(/[^0-9.]/g, '')
      onChange(eCopy)
    } else {
      onChange(e)
    }
  }

  return (
    <S.Wrapper fluid={fluid} className={className} style={style}>
      <S.Label>
        {tooltip && (
          <S.Tooltip>
            <div>?</div>
            <span>{tooltip}</span>
          </S.Tooltip>
        )}
        {label && <span>{label}</span>}
      </S.Label>
      <S.InputWrapper invalid={invalid}>
        <S.Input
          name={name}
          disabled={disabled}
          type={type !== 'password' || !valueVisible ? type : 'text'}
          placeholder={placeholder}
          value={value}
          onChange={handleOnChange}
          style={{
            padding: type === 'password' ? '12px 4px 12px 14px' : '12px 14px'
          }}
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
