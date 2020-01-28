import React from 'react'

import { NotificationSettingsInterface } from 'types'
import { Divider, Dropdown, Input, Checkbox } from 'ui'

import * as S from './styled'

type Props = {
  data: NotificationSettingsInterface
  onChange: (e: React.ChangeEvent<HTMLInputElement> | boolean) => void
  onToggle: () => void
}

const Email = ({ data, onChange, onToggle }: Props) => (
  <S.Wrapper>
    <Divider padding="24px 0 40px">Email notifications</Divider>
    <Checkbox
      label="I want to receive email notifications"
      value={data.emailNotifications}
      onChange={onToggle}
      style={{ paddingBottom: '34px' }}
    />
    <Dropdown isOpen={data.emailNotifications} style={{ paddingTop: '6px' }}>
      <Input
        fluid
        name="emailHost"
        placeholder="smtp.example.com"
        label="Server URL for outgoing emails"
        tooltip="The emailing server, which you want to use for sending out email notifications, for example smtp.gmail.com."
        value={data.emailHost}
        onChange={e => onChange(e)}
      />
      <Input
        fluid
        numeric
        placeholder="465"
        name="emailPort"
        label="SMTP port"
        tooltip="The port you want to use for sending out email notifications. Common ports for SMTP are 25, 2525 or 587. For Secure SMTP (SSL / TLS) it's 465, 25, 587 or 2526 (Elastic Email)."
        value={data.emailPort}
        onChange={e => onChange(e)}
      />
      <Input
        fluid
        placeholder="login.example.com"
        name="emailUsername"
        label="Email login"
        tooltip="This account will be used for sending out email notifications."
        value={data.emailUsername}
        onChange={e => onChange(e)}
      />
      <Input
        fluid
        placeholder="password"
        name="emailPassword"
        label="Email password"
        type="password"
        tooltip="This account will be used for sending out email notifications."
        value={data.emailPassword}
        onChange={e => onChange(e)}
      />
      <Input
        fluid
        placeholder="info@example.com"
        name="emailFrom"
        label="Email address of the sender"
        tooltip="The email address from which the notifications will be sent. Usually email login"
        value={data.emailFrom}
        onChange={e => onChange(e)}
      />
      <Input
        fluid
        placeholder="recipient@example.com"
        name="emailRecipient"
        label="Email address of the recipient"
        tooltip="The email address where the notifications should be delivered."
        value={data.emailRecipient}
        onChange={e => onChange(e)}
      />
    </Dropdown>
  </S.Wrapper>
)

export default Email
