import React from 'react'

import { SettingsInterface } from 'types'
import { Divider, Dropdown, Input, Checkbox } from 'ui'

import * as S from './styled'

type Props = {
  data: SettingsInterface
  onChange: (
    e: React.ChangeEvent<HTMLInputElement> | boolean,
    numbersOnly: boolean
  ) => void
  onToggle: () => void
}

const Email = ({ data, onChange, onToggle }: Props) => (
  <S.Wrapper>
    <Divider padding="24px 0 40px">Email notifications</Divider>
    <Checkbox
      label="I want to receive email notifications"
      value={data.emailNotifications}
      onChange={onToggle}
      style={{ marginBottom: '40px' }}
    />
    <Dropdown isOpen={data.emailNotifications}>
      <Input
        fluid
        name="emailHost"
        label="Server URL for outgoing emails"
        tooltip="The emailing server, which you want to use for sending out email notifications, for example smtp.gmail.com."
        value={data.emailHost}
        onChange={e => onChange(e, false)}
      />
      <Input
        fluid
        name="emailPort"
        label="SMTP port"
        tooltip="The port you want to use for sending out email notifications. Common ports for SMTP are 25, 2525 or 587. For Secure SMTP (SSL / TLS) it's 465, 25, 587 or 2526 (Elastic Email)."
        value={data.emailPort}
        onChange={e => onChange(e, true)}
      />
      <Input
        fluid
        name="emailUsername"
        label="Email login"
        tooltip="This account will be used for sending out email notifications."
        value={data.emailUsername}
        onChange={e => onChange(e, false)}
      />
      <Input
        fluid
        name="emailPassword"
        label="Email password"
        type="password"
        tooltip="This account will be used for sending out email notifications."
        value={data.emailPassword}
        onChange={e => onChange(e, false)}
      />
      <Input
        fluid
        name="emailRecipient"
        label="Email address of the recipient"
        tooltip="The email address where the notifications should be delivered."
        value={data.emailRecipient}
        onChange={e => onChange(e, false)}
      />
    </Dropdown>
  </S.Wrapper>
)

export default Email
