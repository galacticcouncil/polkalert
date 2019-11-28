import React, { useContext, useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useMutation } from '@apollo/react-hooks'

import { SelectionGroupOption, SnackbarType } from 'types'
import { ConnectMutation } from 'apollo/mutations'
import { NavigationContext } from 'contexts'
import { setApiAction } from 'actions'
import { useBooleanState, useLocalStorage } from 'hooks'
import { LS_NODE_INFO } from 'constants/api'
import { Loading, RadioGroup, Dropdown, Button, Snackbar } from 'ui'

import * as S from './styled'

const SelectApi = () => {
  const dispatch = useDispatch()

  const [, SetLSNodeUrl, RemoveLSNodeUrl] = useLocalStorage(LS_NODE_INFO)

  const options = [
    'wss://kusama-rpc.polkadot.io/',
    'wss://poc3-rpc.polkadot.io/',
    'wss://substrate-rpc.parity.io/',
    'ws://127.0.0.1:9944',
    'ws://127.0.0.1:9933',
    'Demo',
    'Custom'
  ]

  const { navigateTo } = useContext(NavigationContext)
  const [apiUrl, setApiUrl] = useState<SelectionGroupOption>(options[0])
  const [customApiUrl, setCustomApiUrl] = useState<string>('wss://')
  const [loadingVisible, showLoading, hideLoading] = useBooleanState()
  const [connectMutation] = useMutation(ConnectMutation)
  const snackbarRef = useRef<SnackbarType>(null)

  const setApi = () => {
    showLoading()

    const isCustomUrl = apiUrl === 'Custom'
    const url = isCustomUrl ? customApiUrl : (apiUrl as string)

    if (url === 'Demo') {
      dispatch(setApiAction({ loaded: true, demo: true }))
      RemoveLSNodeUrl()
      navigateTo('/staking')
    } else {
      connectMutation({ variables: { nodeUrl: url } })
        .then(() => {
          dispatch(setApiAction({ loaded: true, demo: false }))
          SetLSNodeUrl(url)
          navigateTo('/staking')
        })
        .catch(() => {
          if (snackbarRef?.current) snackbarRef.current.open()
          RemoveLSNodeUrl()
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
        <Button text="Connect" onClick={setApi} style={{ width: '100%' }} />
      </S.Inner>

      <Snackbar ref={snackbarRef} theme="error">
        Connection couldn&apos;t be established.
      </Snackbar>
    </S.Wrapper>
  )
}

export default SelectApi
