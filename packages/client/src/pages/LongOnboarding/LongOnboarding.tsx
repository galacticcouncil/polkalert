import React, { useContext, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useMutation } from '@apollo/react-hooks'

import UPDATESETTINGS_MUTATION from 'apollo/mutations/updateSettings'
import { setApiAction } from 'actions'
import { NavigationContext } from 'contexts'
import { useBooleanState } from 'hooks'
import { Loading, Input, Checkbox, Button, Modal } from 'ui'

import * as S from './styled'

const LongOnboarding = () => {
  const dispatch = useDispatch()

  const { navigateTo } = useContext(NavigationContext)
  const [step, setStep] = useState<number>(0)
  const [loadingVisible, showLoading, hideLoading] = useBooleanState()
  const [successModalVisible, showSuccessModal] = useBooleanState()
  const [errorModalVisible, showErrorModal, hideErrorModal] = useBooleanState()

  const [emailFrom, setEmailFrom] = useState<string>('')
  const [emailPort, setEmailPort] = useState<string>('')
  const [emailHost, setEmailHost] = useState<string>('')
  const [emailUsername, setEmailUsername] = useState<string>('')
  const [emailPassword, setEmailPassword] = useState<string>('')
  const [emailRecipient, setEmailRecipient] = useState<string>('')
  const [emailNotifications, setEmailNotifications] = useState<boolean>(false)

  const [updateSettingsMutation] = useMutation(UPDATESETTINGS_MUTATION)

  const STEPS_AMOUNT = 6

  const handlePrev = () => {
    if (step > 0) setStep(step - 1)
  }

  const handleNext = () => {
    if (step < STEPS_AMOUNT - 1) setStep(step + 1)
  }

  const handleFinish = () => {
    showLoading()

    updateSettingsMutation({
      variables: {
        emailFrom,
        emailPort: parseInt(emailPort),
        emailHost,
        emailUsername,
        emailPassword,
        emailRecipient,
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
    handleFinish()
  }

  const handleContinue = () => {
    dispatch(setApiAction({ loaded: true, demo: false }))
    navigateTo('/staking')
  }

  return (
    <S.Wrapper>
      {loadingVisible && <Loading transparent />}
      <S.Progress>
        <S.ProgressBar progress={((step + 1) / STEPS_AMOUNT) * 100} />
        <S.ProgressText>
          Step: {step + 1} / {STEPS_AMOUNT}
        </S.ProgressText>
      </S.Progress>
      <S.Disclaimer>
        All steps are optional. Don&apos;t refresh or close this window,
        otherwise your progress will be lost.
      </S.Disclaimer>
      <S.Scroller style={{ transform: `translateX(calc(-${step} * 100vw))` }}>
        <S.ScrollerItem>
          <S.ScrollerItemName>
            Server URL for outgoing emails
          </S.ScrollerItemName>
          <S.ScrollerItemText>
            The emailing server, which you want to use for sending out email
            notifications, for example smtp.gmail.com.
          </S.ScrollerItemText>
          <Input
            label="Type the value into this input"
            value={emailHost}
            onChange={e => setEmailHost(e.target.value)}
          />
        </S.ScrollerItem>

        <S.ScrollerItem>
          <S.ScrollerItemName>SMTP port</S.ScrollerItemName>
          <S.ScrollerItemText>
            The port you want to use for sending out email notifications. Common
            ports for SMTP are 25, 2525 or 587. For Secure SMTP (SSL / TLS)
            it&apos;s 465, 25, 587 or 2526 (Elastic Email).
          </S.ScrollerItemText>
          <Input
            label="Type the value into this input"
            value={emailPort}
            onChange={e => setEmailPort(e.target.value.replace(/\D/, ''))}
          />
        </S.ScrollerItem>

        <S.ScrollerItem>
          <S.ScrollerItemName>Email login</S.ScrollerItemName>
          <S.ScrollerItemText>
            This account will be used for sending out email notifications.
          </S.ScrollerItemText>
          <Input
            label="Type the value into this input"
            value={emailUsername}
            onChange={e => setEmailUsername(e.target.value)}
          />
        </S.ScrollerItem>

        <S.ScrollerItem>
          <S.ScrollerItemName>Email password</S.ScrollerItemName>
          <S.ScrollerItemText>
            This account will be used for sending out email notifications.
          </S.ScrollerItemText>
          <Input
            label="Type the value into this input"
            type="password"
            value={emailPassword}
            onChange={e => setEmailPassword(e.target.value)}
          />
        </S.ScrollerItem>

        <S.ScrollerItem>
          <S.ScrollerItemName>Email from</S.ScrollerItemName>
          <S.ScrollerItemText>
            This is the email address email will be sent from.
          </S.ScrollerItemText>
          <Input
            label="Type the value into this input"
            value={emailFrom}
            onChange={e => setEmailUsername(e.target.value)}
          />
        </S.ScrollerItem>

        <S.ScrollerItem>
          <S.ScrollerItemName>
            Email address of the recipient
          </S.ScrollerItemName>
          <S.ScrollerItemText>
            The email address where the notifications should be delivered.
          </S.ScrollerItemText>
          <Input
            label="Type the value into this input"
            value={emailRecipient}
            onChange={e => setEmailRecipient(e.target.value)}
          />
        </S.ScrollerItem>

        <S.ScrollerItem>
          <S.ScrollerItemName>
            Great! Email notifications are set up.
          </S.ScrollerItemName>
          <S.ScrollerItemText>
            Now that we&apos;re done, you can turn the notifications on by
            checking the checkbox below.
          </S.ScrollerItemText>
          <Checkbox
            label="I want to receive email notifications"
            value={emailNotifications}
            onChange={setEmailNotifications}
            style={{ maxWidth: '100%', width: '350px' }}
          />
        </S.ScrollerItem>
      </S.Scroller>
      <S.Buttons>
        {step > 0 ? (
          <Button theme="transparent" text="Back" onClick={handlePrev} />
        ) : (
          <span />
        )}
        {step + 1 < STEPS_AMOUNT && (
          <Button text="Continue" onClick={handleNext} />
        )}
        {step + 1 === STEPS_AMOUNT && (
          <Button text="Finish" onClick={handleFinish} />
        )}
      </S.Buttons>

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

export default LongOnboarding
