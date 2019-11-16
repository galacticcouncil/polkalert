import React, { useContext, useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useMutation } from '@apollo/react-hooks'

import { UiOptionType, SnackbarType } from 'types'
import { ConnectionMutation } from 'apollo/mutations'
import { NavigationContext } from 'contexts'
import { setApiAction } from 'actions'
import { useBooleanState } from 'hooks'
import { Loading, RadioGroup, Dropdown, Button, Snackbar } from 'ui'

import * as S from './styled'

const SelectApi = () => {
  const dispatch = useDispatch()

  const options = [
    'wss://poc3-rpc.polkadot.io/',
    'wss://kusama-rpc.polkadot.io/',
    'wss://substrate-rpc.parity.io/',
    'ws://127.0.0.1:9944',
    'ws://127.0.0.1:9933',
    'Custom'
  ]

  const { navigateTo } = useContext(NavigationContext)
  const [apiUrl, setApiUrl] = useState<UiOptionType>(options[0])
  const [customApiUrl, setCustomApiUrl] = useState<string>('wss://')
  const [loadingVisible, showLoading, hideLoading] = useBooleanState()
  const [connectionMutation] = useMutation(ConnectionMutation)
  const snackbarRef = useRef<SnackbarType>(null)

  const setApi = () => {
    showLoading()

    const isCustomUrl = apiUrl === 'Custom'
    const url = isCustomUrl ? customApiUrl : (apiUrl as string)

    if (url.toLowerCase() === 'demo') {
      dispatch(setApiAction({ loaded: true, demo: true }))
      navigateTo('/staking')
    } else {
      connectionMutation({ variables: { nodeUrl: url } })
        .then(() => {
          dispatch(setApiAction({ loaded: true }))
          navigateTo('/staking')
        })
        .catch(() => {
          if (snackbarRef && snackbarRef.current) snackbarRef.current.open()
          hideLoading()
        })
    }
  }

  const handleKeyUp = e => {
    if (e.keyCode === 13) setApi()
  }

  return (
    <S.Wrapper onKeyUp={handleKeyUp}>
      {loadingVisible && <Loading />}
      <S.Inner>
        <S.Form>
          <RadioGroup
            id="selectApiRadioGroup"
            label="Node URL"
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
          condensed
          text="Connect"
          onClick={setApi}
          style={{ width: '100%' }}
        />
      </S.Inner>

      <Snackbar ref={snackbarRef} theme="error">
        Connection couldn&apos;t be established.
      </Snackbar>
    </S.Wrapper>
  )
}

export default SelectApi
