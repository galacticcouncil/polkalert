import React, { useState, useRef, useEffect } from 'react'
import { useMutation } from '@apollo/react-hooks'

import UPDATESETTINGS_MUTATION from 'apollo/mutations/updateSettings'
import {
  ApplicationSettingsInterface,
  SnackbarType,
  SnackbarThemeInterface
} from 'types'
import { useBooleanState } from 'hooks'
import { Loading, Divider, Input, Button, Snackbar } from 'ui'

import * as S from './styled'

type Props = {
  data: ApplicationSettingsInterface
}

const ApplicationSettings = ({ data }: Props) => {
  const [formFields, setFormFields] = useState<ApplicationSettingsInterface>({
    maxDataAge: ''
  })
  const [loadingVisible, showLoading, hideLoading] = useBooleanState()
  const snackbarRef = useRef<SnackbarType>(null)
  const [snackbarTheme, setSnackbarTheme] = useState<SnackbarThemeInterface>({
    text: 'Something went wrong. Please try again.',
    theme: 'error'
  })

  const [updateSettingsMutation] = useMutation(UPDATESETTINGS_MUTATION)

  useEffect(() => {
    if (data) {
      setFormFields({
        maxDataAge: data.maxDataAge || ''
      })
    }
  }, [data])

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormFields({
      ...formFields,
      [name]: value
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
        maxDataAge: parseFloat(formFields.maxDataAge)
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
        <div>
          <Divider padding="0 0 40px">Database</Divider>
          <Input
            fluid
            numeric
            name="maxDataAge"
            label="Max data age"
            tooltip="Maximum age for blocks stored in database (in hours)."
            value={formFields.maxDataAge}
            onChange={e => handleOnChange(e)}
          />
        </div>
      </S.Inner>
      <Button text="Save" onClick={handleFormSubmit} />

      <Snackbar ref={snackbarRef} theme={snackbarTheme.theme}>
        {snackbarTheme.text}
      </Snackbar>
    </S.Wrapper>
  )
}

export default ApplicationSettings
