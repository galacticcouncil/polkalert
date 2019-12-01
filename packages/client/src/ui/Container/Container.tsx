import React from 'react'
import CSS from 'csstype'

import * as S from './styled'

type Props = {
  maxWidth?: string
  children?: React.ReactNode[] | React.ReactNode | string
  className?: string
  style?: CSS.Properties
}

const Container = ({ maxWidth, children, className = '', style }: Props) => (
  <S.Wrapper maxWidth={maxWidth} className={className} style={style}>
    {children}
  </S.Wrapper>
)

export default Container
