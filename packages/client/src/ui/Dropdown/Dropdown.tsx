import React from 'react'
import CSS from 'csstype'

import * as S from './styled'

type Props = {
  isOpen: boolean
  children: React.ReactNode[] | React.ReactNode | string
  className?: string
  style?: CSS.Properties
}

const Dropdown = ({ isOpen, children, className = '', style }: Props) => (
  <S.Wrapper isOpen={isOpen} className={className} style={style}>
    {children}
  </S.Wrapper>
)

export default Dropdown
