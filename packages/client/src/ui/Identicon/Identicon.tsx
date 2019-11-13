import React, { useRef } from 'react'
import CSS from 'csstype'

import { Snackbar } from 'ui'
import { SnackbarType } from 'types'

import * as S from './styled'

type Props = {
  value: string
  size?: number
  whatIsCopied?: string
  className?: string
  style?: CSS.Properties
}

const Identicon = ({
  value,
  size = 48,
  whatIsCopied = 'Address',
  className = '',
  style
}: Props) => {
  const snackbarRef = useRef<SnackbarType>(null)

  const copyValue = () => {
    if (snackbarRef && snackbarRef.current) snackbarRef.current.open()
  }

  return (
    <>
      <S.Wrapper className={className} style={style}>
        <S.Icon
          value={value}
          size={(size / 8) * 6}
          fullSize={size}
          theme="polkadot"
          onCopy={copyValue}
        />
      </S.Wrapper>
      <Snackbar ref={snackbarRef} theme="success">
        {whatIsCopied} copied to clipboard.
      </Snackbar>
    </>
  )
}

export default Identicon
