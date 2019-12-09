import React from 'react'
import SVG from 'react-inlinesvg'
import _clone from 'lodash/clone'

import { Divider, Input, Button } from 'ui'

import * as S from './styled'

type Props = {
  data: string[]
  onChange: (data: string[]) => void
}

const Webhooks = ({ data, onChange }: Props) => {
  const handleInputChange = (e, idx) => {
    const dataCopy = _clone(data)

    dataCopy[idx] = e.target.value
    onChange(dataCopy)
  }

  const handleRemoveInput = idx => {
    const dataCopy = _clone(data)

    dataCopy.splice(idx, 1)
    onChange(dataCopy)
  }
  return (
    <S.Wrapper>
      <Divider padding="0 0 40px">Webhook notifications</Divider>
      {data.length ? (
        data.map((item, idx) => (
          <S.InputWrapper key={`webhooks-settings-input-${idx}`}>
            <Input
              fluid
              label="Webhook URL"
              value={item}
              onChange={e => handleInputChange(e, idx)}
            />
            <SVG src="/icons/close.svg" onClick={() => handleRemoveInput(idx)}>
              <img src="/icons/close.svg" alt="Remove" />
            </SVG>
          </S.InputWrapper>
        ))
      ) : (
        <S.NoWebHooks>
          Add your first webhook by clicking the &quot;+ Add&quot; button below.
        </S.NoWebHooks>
      )}
      <Button
        text="+ Add"
        theme="outlineMini"
        onClick={() => onChange([...data, ''])}
        style={{ marginBottom: '24px' }}
      />
    </S.Wrapper>
  )
}

export default Webhooks
