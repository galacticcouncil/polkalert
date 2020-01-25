import React, { useState, useRef, useEffect } from 'react'
import { useMutation } from '@apollo/react-hooks'

import UPDATESETTINGS_MUTATION from 'apollo/mutations/updateSettings'
import {
  NotificationSettingsInterface,
  SnackbarType,
  SnackbarThemeInterface
} from 'types'
import { useBooleanState } from 'hooks'
import { Loading, Button, Snackbar } from 'ui'

import { General, Delay, Email, Webhooks } from './components'

import * as S from './styled'

type Props = {
  data: NotificationSettingsInterface
}

const NotificationsSettings = ({ data }: Props) => {
  const [formFields, setFormFields] = useState<NotificationSettingsInterface>({
    blockReceivedLagNotificationDelay: '',
    noBlocksReceivedNotificationDelay: '',
    serverPort: '',
    emailNotifications: false,
    emailFrom: '',
    emailPort: '',
    emailHost: '',
    emailRecipient: '',
    emailUsername: '',
    emailPassword: '',
    validatorId: ''
  })
  const [webHooks, setWebHooks] = useState<string[]>([])
  const [loadingVisible, showLoading, hideLoading] = useBooleanState()
  const snackbarRef = useRef<SnackbarType>(null)
  const [snackbarTheme, setSnackbarTheme] = useState<SnackbarThemeInterface>({
    text: 'Something went wrong. Please try again.',
    theme: 'error'
  })

  const [updateSettingsMutation] = useMutation(UPDATESETTINGS_MUTATION)

  useEffect(() => {
    if (data) {
      const dataFormatted = {
        blockReceivedLagNotificationDelay:
          data.blockReceivedLagNotificationDelay || '',
        noBlocksReceivedNotificationDelay:
          data.noBlocksReceivedNotificationDelay || '',
        serverPort: data.serverPort || '',
        emailNotifications: data.emailNotifications || false,
        emailFrom: data.emailFrom || '',
        emailPort: data.emailPort || '',
        emailHost: data.emailHost || '',
        emailRecipient: data.emailRecipient || '',
        emailUsername: data.emailUsername || '',
        emailPassword: data.emailPassword || '',
        validatorId: data.validatorId || ''
      }

      setFormFields(dataFormatted)
      setWebHooks(data.webHooks || [])
    }
  }, [data])

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormFields({
      ...formFields,
      [name]: value
    })
  }

  const handleToggleEmailNotifications = () => {
    setFormFields({
      ...formFields,
      emailNotifications: !formFields.emailNotifications
    })
  }

  const handleMutationResult = () => {
    hideLoading()
    if (snackbarRef?.current) snackbarRef.current.open()
  }

  const handleFormSubmit = () => {
    showLoading()

    updateSettingsMutation({
      variables: {
        blockReceivedLagNotificationDelay: parseInt(
          formFields.blockReceivedLagNotificationDelay
        ),
        noBlocksReceivedNotificationDelay: parseInt(
          formFields.noBlocksReceivedNotificationDelay
        ),
        serverPort: parseInt(formFields.serverPort),
        emailNotifications: formFields.emailNotifications,
        emailFrom: formFields.emailFrom,
        emailPort: parseInt(formFields.emailPort),
        emailHost: formFields.emailHost,
        emailRecipient: formFields.emailRecipient,
        emailUsername: formFields.emailUsername,
        emailPassword: formFields.emailPassword,
        webHooks,
        validatorId: formFields.validatorId
      }
    })
      .then(() => {
        setSnackbarTheme({
          text: 'Notification settings successfully updated.',
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
        <div>
          <General data={formFields} onChange={handleOnChange} />
          <Delay data={formFields} onChange={handleOnChange} />
          <Email
            data={formFields}
            onChange={handleOnChange}
            onToggle={handleToggleEmailNotifications}
          />
        </div>
        <div>
          <Webhooks data={webHooks} onChange={setWebHooks} />
        </div>
      </S.Inner>
      <Button text="Save" onClick={handleFormSubmit} />

      <Snackbar ref={snackbarRef} theme={snackbarTheme.theme}>
        {snackbarTheme.text}
      </Snackbar>
    </S.Wrapper>
  )
}

export default NotificationsSettings
