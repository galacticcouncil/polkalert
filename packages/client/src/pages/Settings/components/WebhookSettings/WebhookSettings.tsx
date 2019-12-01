import React, { useState, useRef, useEffect } from 'react'
import { useMutation } from '@apollo/react-hooks'
import SVG from 'react-inlinesvg'
import _clone from 'lodash/clone'

import { UpdateSettingsMutation } from 'apollo/mutations'
import { SettingsInterface, SnackbarType, SnackbarThemeInterface } from 'types'
import { useBooleanState } from 'hooks'
import { Loading, Input, Snackbar } from 'ui'

import * as S from './styled'

type Props = {
  data: SettingsInterface
}

const WebhookSettings = ({ data }: Props) => {
  const [loadingVisible, showLoading, hideLoading] = useBooleanState()
  const [webHooks, setWebHooks] = useState<string[]>([])
  const snackbarRef = useRef<SnackbarType>(null)
  const [snackbarTheme, setSnackbarTheme] = useState<SnackbarThemeInterface>({
    text: 'Something went wrong. Please try again.',
    theme: 'error'
  })

  const [updateSettingsMutation] = useMutation(UpdateSettingsMutation)

  useEffect(() => {
    if (data?.webHooks) {
      setWebHooks(data.webHooks)
    }
  }, [data])

  const handleInputChange = (e, idx) => {
    const webHooksCopy = _clone(webHooks)

    webHooksCopy[idx] = e.target.value
    setWebHooks(webHooksCopy)
  }

  const handleRemoveInput = idx => {
    const webHooksCopy = _clone(webHooks)

    webHooksCopy.splice(idx, 1)
    setWebHooks(webHooksCopy)
  }

  const handleMutationResult = () => {
    hideLoading()
    if (snackbarRef?.current) snackbarRef.current.open()
  }

  const handleFormSubmit = () => {
    showLoading()

    updateSettingsMutation({
      variables: { webHooks }
    })
      .then(() => {
        setSnackbarTheme({
          text: 'Webhooks successfully updated.',
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
        {webHooks.length ? (
          webHooks.map((item, idx) => (
            <S.InputWrapper key={`webhooks-settings-input-${idx}`}>
              <Input
                fluid
                label="Webhook URL"
                value={item}
                onChange={e => handleInputChange(e, idx)}
              />
              <SVG
                src="/icons/close.svg"
                onClick={() => handleRemoveInput(idx)}
              >
                <img src="/icons/close.svg" alt="Remove" />
              </SVG>
            </S.InputWrapper>
          ))
        ) : (
          <S.NoWebHooks>
            Add your first webhook by clicking the &quot;+ Add&quot; button
            below.
          </S.NoWebHooks>
        )}
        <S.AddWebHook
          text="+ Add"
          theme="outlineMini"
          onClick={() => setWebHooks([...webHooks, ''])}
        />
      </S.Inner>
      <S.Submit fluid text="Save" onClick={handleFormSubmit} />

      <Snackbar ref={snackbarRef} theme={snackbarTheme.theme}>
        {snackbarTheme.text}
      </Snackbar>
    </S.Wrapper>
  )
}

export default WebhookSettings
