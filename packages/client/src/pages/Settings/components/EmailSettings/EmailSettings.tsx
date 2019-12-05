import React, { useState, useRef, useEffect } from 'react'
import { useMutation } from '@apollo/react-hooks'

import { UpdateSettingsMutation } from 'apollo/mutations'
import { SettingsInterface, SnackbarType, SnackbarThemeInterface } from 'types'
import { useBooleanState } from 'hooks'
import { Loading, Input, Checkbox, Button, Snackbar } from 'ui'

import * as S from './styled'

type Props = {
  data: SettingsInterface
}

const EmailSettings = ({ data }: Props) => {
  const [loadingVisible, showLoading, hideLoading] = useBooleanState()
  const [emailPort, setEmailPort] = useState<string>('')
  const [emailHost, setEmailHost] = useState<string>('')
  const [emailUsername, setEmailUsername] = useState<string>('')
  const [emailPassword, setEmailPassword] = useState<string>('')
  const [emailRecipient, setEmailRecipient] = useState<string>('')
  const [
    blockReceivedLagNotificationDelay,
    setBlockReceivedLagNotificationDelay
  ] = useState<string>('')
  const [
    noBlocksReceivedNotificationDelay,
    setNoBlocksReceivedNotificationDelay
  ] = useState<string>('')
  const [emailNotifications, setEmailNotifications] = useState<boolean>(false)
  const snackbarRef = useRef<SnackbarType>(null)
  const [snackbarTheme, setSnackbarTheme] = useState<SnackbarThemeInterface>({
    text: 'Something went wrong. Please try again.',
    theme: 'error'
  })

  const [updateSettingsMutation] = useMutation(UpdateSettingsMutation)

  useEffect(() => {
    if (data?.blockReceivedLagNotificationDelay) {
      setBlockReceivedLagNotificationDelay(
        data.blockReceivedLagNotificationDelay.toString()
      )
    }

    if (data?.noBlocksReceivedNotificationDelay) {
      setNoBlocksReceivedNotificationDelay(
        data.noBlocksReceivedNotificationDelay.toString()
      )
    }

    if (data?.emailPort) {
      setEmailPort(data.emailPort.toString())
    }

    if (data?.emailHost) {
      setEmailHost(data.emailHost)
    }

    if (data?.emailUsername) {
      setEmailUsername(data.emailUsername)
    }

    if (data?.emailPassword) {
      setEmailPassword(data.emailPassword)
    }

    if (data?.emailRecipient) {
      setEmailRecipient(data.emailRecipient)
    }

    if (data?.emailNotifications) {
      setEmailNotifications(data.emailNotifications)
    }
  }, [data])

  const handleMutationResult = () => {
    hideLoading()
    if (snackbarRef?.current) snackbarRef.current.open()
  }

  const handleFormSubmit = () => {
    showLoading()

    updateSettingsMutation({
      variables: {
        blockReceivedLagNotificationDelay: parseInt(
          blockReceivedLagNotificationDelay
        ),
        noBlocksReceivedNotificationDelay: parseInt(
          noBlocksReceivedNotificationDelay
        ),
        emailPort: parseInt(emailPort),
        emailHost,
        emailUsername,
        emailPassword,
        emailRecipient,
        emailNotifications
      }
    })
      .then(() => {
        setSnackbarTheme({
          text: 'Email settings successfully updated.',
          theme: 'success'
        })
        handleMutationResult()
      })
      .catch(() => {
        setSnackbarTheme({
          text: 'Something went wrong. Please try again.',
          theme: 'error'
        })
        handleMutationResult()
      })
  }

  return (
    <S.Wrapper>
      {loadingVisible && <Loading transparent />}
      <S.Inner>
        <Input
          fluid
          label="Notification delay for network lag"
          tooltip="Delay after which a notification about lagging network will be sent (in seconds)."
          value={blockReceivedLagNotificationDelay}
          onChange={e => setBlockReceivedLagNotificationDelay(e.target.value)}
        />
        <Input
          fluid
          label="Notification delay for no blocks"
          tooltip="Delay after which a notification about no blocks received will be sent (in seconds)."
          value={noBlocksReceivedNotificationDelay}
          onChange={e => setNoBlocksReceivedNotificationDelay(e.target.value)}
        />
        <Input
          fluid
          label="Server URL for outgoing emails"
          tooltip="The emailing server, which you want to use for sending out email notifications, for example smtp.gmail.com."
          value={emailHost}
          onChange={e => setEmailHost(e.target.value)}
        />
        <Input
          fluid
          label="SMTP port"
          tooltip="The port you want to use for sending out email notifications. Common ports for SMTP are 25, 2525 or 587. For Secure SMTP (SSL / TLS) it's 465, 25, 587 or 2526 (Elastic Email)."
          value={emailPort}
          onChange={e => setEmailPort(e.target.value.replace(/\D/, ''))}
        />
        <Input
          fluid
          label="Email login"
          tooltip="This account will be used for sending out email notifications."
          value={emailUsername}
          onChange={e => setEmailUsername(e.target.value)}
        />
        <Input
          fluid
          label="Email password"
          type="password"
          tooltip="This account will be used for sending out email notifications."
          value={emailPassword}
          onChange={e => setEmailPassword(e.target.value)}
        />
        <Input
          fluid
          label="Email address of the recipient"
          tooltip="The email address where the notifications should be delivered."
          value={emailRecipient}
          onChange={e => setEmailRecipient(e.target.value)}
        />
        <Checkbox
          label="I want to receive email notifications"
          value={emailNotifications}
          onChange={setEmailNotifications}
        />
      </S.Inner>
      <Button fluid text="Save" onClick={handleFormSubmit} />

      <Snackbar ref={snackbarRef} theme={snackbarTheme.theme}>
        {snackbarTheme.text}
      </Snackbar>
    </S.Wrapper>
  )
}

export default EmailSettings
