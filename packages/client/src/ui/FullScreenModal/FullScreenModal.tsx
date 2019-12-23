import React from 'react'
import { createPortal } from 'react-dom'
import CSS from 'csstype'

import * as S from './styled'

type Props = {
  onClose?: () => void
  children: React.ReactNode[] | React.ReactNode | string
  className?: string
  style?: CSS.Properties
}

const FullScreenModal = ({ onClose, children, className = '', style }: Props) =>
  createPortal(
    <S.Wrapper className={className} style={style}>
      <S.Close src="/icons/close.svg" onClick={onClose}>
        <img src="/icons/close.svg" alt="Close" />
      </S.Close>
      {children}
    </S.Wrapper>,
    document.body
  )

export default FullScreenModal
