import React from 'react'

import { NotificationSettingsInterface } from 'types'
import { Divider, Input } from 'ui'

import * as S from './styled'

type Props = {
  data: NotificationSettingsInterface
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const General = ({ data, onChange }: Props) => (
  <S.Wrapper>
    <Divider padding="0 0 40px">General</Divider>
    <Input
      fluid
      name="validatorId"
      label="Validator ID"
      tooltip="Stash address of the validator to follow. You will receive notifications about events connected with this validator."
      value={data.validatorId}
      onChange={e => onChange(e)}
    />
  </S.Wrapper>
)

export default General
