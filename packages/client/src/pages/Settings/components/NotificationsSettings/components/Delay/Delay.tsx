import React from 'react'

import { NotificationSettingsInterface } from 'types'
import { Divider, Input } from 'ui'

import * as S from './styled'

type Props = {
  data: NotificationSettingsInterface
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const Delay = ({ data, onChange }: Props) => (
  <S.Wrapper>
    <Divider padding="24px 0 40px">Notification delay</Divider>
    <Input
      fluid
      numeric
      name="blockReceivedLagNotificationDelay"
      label="Notification delay for network lag"
      tooltip="Delay after which a notification about lagging network will be sent (in seconds)."
      value={data.blockReceivedLagNotificationDelay}
      onChange={e => onChange(e)}
    />
    <Input
      fluid
      numeric
      name="noBlocksReceivedNotificationDelay"
      label="Notification delay for no blocks"
      tooltip="Delay after which a notification about no blocks received will be sent (in seconds)."
      value={data.noBlocksReceivedNotificationDelay}
      onChange={e => onChange(e)}
    />
  </S.Wrapper>
)

export default Delay
