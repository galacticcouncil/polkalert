import React, { useContext, useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useMutation } from '@apollo/react-hooks'
import SVG from 'react-inlinesvg'

import CONNECT_MUTATION from 'apollo/mutations/connect'
import { SelectionGroupOption, SnackbarType } from 'types'
import { NavigationContext } from 'contexts'
import { setApiAction } from 'actions'
import { useBooleanState, useLocalStorage } from 'hooks'
import { LS_NODE_INFO } from 'constants/api'
import { ONBOARDING_DONE } from 'constants/onboarding'
import {
  Loading,
  Container,
  RadioGroup,
  Dropdown,
  Button,
  Snackbar,
  Modal
} from 'ui'

import * as S from './styled'

const SelectApi = () => {
  const dispatch = useDispatch()

  const [, setLSNodeUrl, removeLSNodeUrl] = useLocalStorage(LS_NODE_INFO)
  const [LSOnboardingDone, setLSOnboardingDone] = useLocalStorage(
    ONBOARDING_DONE
  )

  const options = [
    'wss://kusama-rpc.polkadot.io/',
    'ws://127.0.0.1:9944',
    'Demo',
    'Custom'
  ]

  const { navigateTo } = useContext(NavigationContext)
  const [apiUrl, setApiUrl] = useState<SelectionGroupOption>(options[0])
  const [customApiUrl, setCustomApiUrl] = useState<string>('wss://')
  const [loadingVisible, showLoading, hideLoading] = useBooleanState()
  const [connectMutation] = useMutation(CONNECT_MUTATION)
  const snackbarRef = useRef<SnackbarType>(null)
  const [
    onboardingModalVisible,
    showOnboardingModal,
    hideOnboardingModal
  ] = useBooleanState()

  const setApi = (force: boolean, onboarding: boolean) => {
    if (apiUrl === 'Demo' || LSOnboardingDone || force || onboarding) {
      showLoading()

      const isCustomUrl = apiUrl === 'Custom'
      const url = isCustomUrl ? customApiUrl : (apiUrl as string)

      if (url === 'Demo') {
        dispatch(setApiAction({ loaded: true, demo: true }))
        removeLSNodeUrl()
        navigateTo('/staking')
      } else {
        connectMutation({ variables: { nodeUrl: url } })
          .then(() => {
            if (!onboarding) {
              dispatch(setApiAction({ loaded: true, demo: false }))
            }
            setLSNodeUrl(url)
            onboarding ? navigateTo('/onboarding') : navigateTo('/staking')
          })
          .catch(() => {
            if (snackbarRef?.current) snackbarRef.current.open()
            removeLSNodeUrl()
            hideLoading()
          })
      }
    } else {
      setLSOnboardingDone(true)
      showOnboardingModal()
    }
  }

  const handleOnboardingDecline = () => {
    hideOnboardingModal()
    setApi(true, false)
  }

  const handleOnboardingAccept = () => {
    hideOnboardingModal()
    setApi(true, true)
  }

  return (
    <S.Wrapper>
      {loadingVisible && <Loading transparent />}
      <Container>
        <S.Inner>
          <S.Info>
            <h1>
              Welcome
              <br />
              to
              <SVG src="/images/logo.svg">
                <img src="/images/logo.svg" alt="Polkalert" />
              </SVG>
            </h1>
            <h2>
              <strong>The</strong> blockchain monitoring tool 🤩🎉
            </h2>
            <div>
              Connect to a <strong>blockchain node</strong> to start using
              Polkalert or use the <strong>Demo</strong> mode if you just want
              to look around.
              <small>
                Hint: You landed on this screen because you&apos;re not
                connected to any node or Polkalert Server is not running.
              </small>
            </div>
          </S.Info>
          <S.FormWrapper>
            <S.Form>
              <RadioGroup
                id="selectApiRadioGroup"
                value={apiUrl}
                onChange={setApiUrl}
                options={options}
              />
              <Dropdown isOpen={apiUrl === 'Custom'}>
                <S.FormInput
                  type="text"
                  placeholder="Custom Node URL"
                  value={customApiUrl}
                  onChange={e => setCustomApiUrl(e.target.value)}
                />
              </Dropdown>
            </S.Form>
            <Button
              fluid
              pulsing={!onboardingModalVisible}
              text="Connect"
              onClick={() => setApi(false, false)}
            />
          </S.FormWrapper>
        </S.Inner>
      </Container>

      <Snackbar ref={snackbarRef} theme="error">
        Connection couldn&apos;t be established.
      </Snackbar>

      {onboardingModalVisible && (
        <Modal>
          <S.ModalTitle>Psst. Got a minute?</S.ModalTitle>
          <S.ModalText>
            This is the first time you&apos;re running Polkalert outside of the
            Demo mode. You have to <strong>set a few things up</strong> to get
            the <strong>full functionality</strong>. Do you want to go through
            the setup <strong>now</strong>?
          </S.ModalText>
          <S.ModalActions>
            <Button
              fluid
              theme="transparent"
              text="No, thanks."
              onClick={handleOnboardingDecline}
            />
            <Button
              fluid
              pulsing
              text="Sure! Let's do this!"
              onClick={handleOnboardingAccept}
            />
          </S.ModalActions>
        </Modal>
      )}
    </S.Wrapper>
  )
}

export default SelectApi
