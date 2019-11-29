import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'

import { GetSettingsQuery } from 'apollo/queries'
import { UpdateSettingsMutation } from 'apollo/mutations'
import { PageTitle, Input, Button } from 'ui'

import * as S from './styled'

const Settings = () => {
  const [serverPort, setServerPort] = useState<string>('')
  const [emailPort, setEmailPort] = useState<string>('')
  const [emailHost, setEmailHost] = useState<string>('')
  const [emailUsername, setEmailUsername] = useState<string>('')
  const [emailPassword, setEmailPassword] = useState<string>('')

  const { data } = useQuery(GetSettingsQuery)
  const [updateSettingsMutation] = useMutation(UpdateSettingsMutation)

  useEffect(() => {
    if (data?.settings?.serverPort) {
      setServerPort(data.settings.serverPort.toString())
    }

    if (data?.settings?.emailPort) {
      setEmailPort(data.settings.emailPort.toString())
    }

    if (data?.settings?.emailHost) {
      setEmailHost(data.settings.emailHost)
    }

    if (data?.settings?.emailUsername) {
      setEmailUsername(data.settings.emailUsername)
    }

    if (data?.settings?.emailPassword) {
      setEmailPassword(data.settings.emailPassword)
    }
  }, [data])

  const handleFormSubmit = () => {
    updateSettingsMutation({
      variables: {
        serverPort: parseInt(serverPort),
        emailPort: parseInt(emailPort),
        emailHost,
        emailUsername,
        emailPassword
      }
    })
  }

  return (
    <S.Wrapper>
      <PageTitle>Settings</PageTitle>
      <Input
        fluid
        label="Server port"
        value={serverPort}
        onChange={e => setServerPort(e.target.value.replace(/\D/, ''))}
      />
      <Input
        fluid
        label="Email port"
        value={emailPort}
        onChange={e => setEmailPort(e.target.value.replace(/\D/, ''))}
      />
      <Input
        fluid
        label="Email host"
        value={emailHost}
        onChange={e => setEmailHost(e.target.value)}
      />
      <Input
        fluid
        label="Email username"
        value={emailUsername}
        onChange={e => setEmailUsername(e.target.value)}
      />
      <Input
        fluid
        label="Email password"
        type="password"
        value={emailPassword}
        onChange={e => setEmailPassword(e.target.value)}
      />
      <Button fluid text="Submit" onClick={handleFormSubmit} />
    </S.Wrapper>
  )
}

export default Settings
