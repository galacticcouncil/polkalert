import React from 'react'
import CSS from 'csstype'

import * as S from './styled'

type Props = {
  padding?: string
  children?: React.ReactNode[] | React.ReactNode | string
  className?: string
  style?: CSS.Properties
}

const Divider = ({
  padding = '16px 0',
  children,
  className = '',
  style
}: Props) => (
  <S.Wrapper className={className} style={{ padding, ...style }}>
    {children}
  </S.Wrapper>
)

export default Divider
