import React from 'react'
import CSS from 'csstype'

import * as S from './styled'

type Props = {
  children: React.ReactNode[] | React.ReactNode | string
  className?: string
  style?: CSS.Properties
}

const PageTitle = ({ children, className = '', style }: Props) => (
  <S.Wrapper className={className} style={style}>
    {children}
  </S.Wrapper>
)

export default PageTitle
