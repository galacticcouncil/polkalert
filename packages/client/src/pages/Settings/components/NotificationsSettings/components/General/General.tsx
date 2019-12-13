import React from 'react'

import { SettingsInterface } from 'types'
import { Divider, Input } from 'ui'

import * as S from './styled'

type Props = {
  data: SettingsInterface
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    numbersOnly: boolean
  ) => void
}

const General = ({ data, onChange }: Props) => (
  <S.Wrapper>
    <Divider padding="0 0 40px">General notification settings</Divider>
    <Input
      fluid
      name="blockReceivedLagNotificationDelay"
      label="Notification delay for network lag"
      tooltip="Delay after which a notification about lagging network will be sent (in seconds)."
      value={data.blockReceivedLagNotificationDelay}
      onChange={e => onChange(e, true)}
    />
    <Input
      fluid
      name="noBlocksReceivedNotificationDelay"
      label="Notification delay for no blocks"
      tooltip="Delay after which a notification about no blocks received will be sent (in seconds)."
      value={data.noBlocksReceivedNotificationDelay}
      onChange={e => onChange(e, true)}
    />
  </S.Wrapper>
)

export default General
