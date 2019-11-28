import React, { useState, useRef, useEffect } from 'react'
import { useMutation } from '@apollo/react-hooks'

import { UpdateSettingsMutation } from 'apollo/mutations'
import { SettingsInterface, SnackbarType, SnackbarThemeInterface } from 'types'
import { useBooleanState } from 'hooks'
import { Loading, Input, Button, Snackbar } from 'ui'

import * as S from './styled'

type Props = {
  data: SettingsInterface
}

const EmailSettings = ({ data }: Props) => {
  const [loadingVisible, showLoading, hideLoading] = useBooleanState()
  const [serverPort, setServerPort] = useState<string>('')
  const snackbarRef = useRef<SnackbarType>(null)
  const [snackbarTheme, setSnackbarTheme] = useState<SnackbarThemeInterface>({
    text: 'Something went wrong. Please try again.',
    theme: 'error'
  })

  const [updateSettingsMutation] = useMutation(UpdateSettingsMutation)

  useEffect(() => {
    if (data?.serverPort) {
      setServerPort(data.serverPort.toString())
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
        serverPort: parseInt(serverPort)
      }
    })
      .then(() => {
        setSnackbarTheme({
          text: 'Application settings successfully updated.',
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
          label="Backend application port"
          tooltip="The port on which you're running the Polkalert backend (default is 4000)."
          value={serverPort}
          onChange={e => setServerPort(e.target.value)}
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
