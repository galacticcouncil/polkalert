import React, { useContext, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useMutation } from '@apollo/react-hooks'

import { UpdateSettingsMutation } from 'apollo/mutations'
import { setApiAction } from 'actions'
import { NavigationContext } from 'contexts'
import { useBooleanState } from 'hooks'
import { Loading, PageTitle, Input, Checkbox, Button, Modal } from 'ui'

import * as S from './styled'

const ShortOnboarding = () => {
  const dispatch = useDispatch()

  const { navigateTo } = useContext(NavigationContext)
  const [loadingVisible, showLoading, hideLoading] = useBooleanState()
  const [successModalVisible, showSuccessModal] = useBooleanState()
  const [errorModalVisible, showErrorModal, hideErrorModal] = useBooleanState()

  const [emailPort, setEmailPort] = useState<string>('')
  const [emailHost, setEmailHost] = useState<string>('')
  const [emailUsername, setEmailUsername] = useState<string>('')
  const [emailPassword, setEmailPassword] = useState<string>('')
  const [emailRecipient, setEmailRecipient] = useState<string>('')
  const [blockTimeNotificationRatio, setBlockTimeNotificationRatio] = useState<
    string
  >('')
  const [emailNotifications, setEmailNotifications] = useState<boolean>(false)

  const [updateSettingsMutation] = useMutation(UpdateSettingsMutation)

  const handleFormSubmit = () => {
    showLoading()

    updateSettingsMutation({
      variables: {
        emailPort: parseInt(emailPort),
        emailHost,
        emailUsername,
        emailPassword,
        emailRecipient,
        blockTimeNotificationRatio: parseInt(blockTimeNotificationRatio),
        emailNotifications
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
          <PageTitle>Email notifications setup</PageTitle>
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
          <Input
            fluid
            label="Block time notification ratio"
            tooltip="How often you want to receive notifications. The time is calculated as averageBlockTime * ratio."
            value={blockTimeNotificationRatio}
            onChange={e =>
              setBlockTimeNotificationRatio(e.target.value.replace(/\D/, ''))
            }
          />
          <Checkbox
            label="I want to receive email notifications"
            value={emailNotifications}
            onChange={setEmailNotifications}
          />
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
