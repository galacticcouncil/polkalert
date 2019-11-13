import React from 'react'
import CSS from 'csstype'

import * as S from './styled'

type Props = {
  fluid?: boolean
  padding?: string | number
  title?: string
  children?: React.ReactNode[] | React.ReactNode | string
  className?: string
  style?: CSS.Properties
}

const Card = ({
  fluid = false,
  padding,
  title,
  children,
  className = '',
  style
}: Props) => (
  <S.Wrapper
    fluid={fluid}
    padding={padding}
    className={className}
    style={style}
  >
    {title && <S.Title>{title}</S.Title>}
    {children}
  </S.Wrapper>
)

export default Card
