import styled from 'styled-components'
import { transparentize } from 'polished'
import Identicon from '@polkadot/react-identicon'
import CSS from 'csstype'

import { Colors } from 'styles/variables'

export const Wrapper = styled.div<{
  className?: string
  style?: CSS.Properties
}>``

export const Icon = styled(Identicon)<{
  value: string
  size: number
  fullSize: number
  theme: string
  onCopy: () => void
}>`
  padding: ${p => `${p.fullSize / 8}px`};
  background: ${transparentize(0.5, Colors.White)};
  border-radius: 50%;

  &:hover {
    background: ${transparentize(0.2, Colors.White)};
  }

  > .container:before {
    content: none;
  }

  circle:first-of-type {
    fill: none;
  }
`
