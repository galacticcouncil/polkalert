import React, { useContext, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useMutation } from '@apollo/react-hooks'

import UPDATESETTINGS_MUTATION from 'apollo/mutations/updateSettings'
import { NotificationSettingsInterface } from 'types'
import { setApiAction } from 'actions'
import { NavigationContext } from 'contexts'
import { useBooleanState } from 'hooks'
import { Loading, Button, Modal } from 'ui'
import {
  General,
  Email,
  Webhooks
} from 'pages/Settings/components/NotificationsSettings/components'

import * as S from './styled'

const ShortOnboarding = () => {
  const dispatch = useDispatch()

  const { navigateTo } = useContext(NavigationContext)
  const [loadingVisible, showLoading, hideLoading] = useBooleanState()
  const [successModalVisible, showSuccessModal] = useBooleanState()
  const [errorModalVisible, showErrorModal, hideErrorModal] = useBooleanState()

  const [formFields, setFormFields] = useState<NotificationSettingsInterface>({
    blockReceivedLagNotificationDelay: '',
    noBlocksReceivedNotificationDelay: '',
    notFinalizingNotificationDelay: '',
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

  const [updateSettingsMutation] = useMutation(UPDATESETTINGS_MUTATION)

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
        notFinalizingNotificationDelay: parseInt(
          formFields.notFinalizingNotificationDelay
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
        hideLoading()
        showSuccessModal()
      })
      .catch(() => {
        hideLoading()
        showErrorModal()
      })
  }

  const handleTryAgain = () => {
    hideErrorModal()
    handleFormSubmit()
  }

  const handleContinue = () => {
    dispatch(setApiAction({ loaded: true, demo: false }))
    navigateTo('/staking')
  }

  return (
    <S.Wrapper>
      {loadingVisible && <Loading transparent />}
      <S.Inner>
        <S.Form>
          <div>
            <General data={formFields} onChange={handleOnChange} />
            <Email
              data={formFields}
              onChange={handleOnChange}
              onToggle={handleToggleEmailNotifications}
            />
          </div>
          <div>
            <Webhooks data={webHooks} onChange={setWebHooks} />
          </div>
        </S.Form>
        <S.Buttons>
          <Button text="Cancel" theme="outline" onClick={handleContinue} />
          <Button text="Save" onClick={handleFormSubmit} />
        </S.Buttons>
      </S.Inner>

      {successModalVisible && (
        <Modal>
          <S.ModalTitle isSuccess>There we go!</S.ModalTitle>
          <S.ModalText>
            Settings saved successfully. Enjoy Polkalert :)
          </S.ModalText>
          <Button fluid text="Enter app" onClick={handleContinue} />
        </Modal>
      )}

      {errorModalVisible && (
        <Modal>
          <S.ModalTitle>Something went wrong</S.ModalTitle>
          <S.ModalText>
            Unfortunately, we weren&apos;t able to save your settings. You can
            try again or continue without saving and edit them later in the
            Settings screen.
          </S.ModalText>
          <Button
            fluid
            text="Try again"
            onClick={handleTryAgain}
            style={{ marginBottom: '16px' }}
          />
          <Button
            fluid
            theme="transparent"
            text="Continue without saving"
            onClick={handleContinue}
          />
        </Modal>
      )}
    </S.Wrapper>
  )
}

export default ShortOnboarding
