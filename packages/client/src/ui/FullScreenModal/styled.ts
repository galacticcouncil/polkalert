import styled, { keyframes } from 'styled-components'
import SVG from 'react-inlinesvg'

import { Colors } from 'styles/variables'
import { device } from 'styles/media'

const fadeIn = keyframes`
  from {
    opacity: 0
  }

  to {
    opacity: 1
  }
`

export const Wrapper = styled.div`
  padding: 24px;
  overflow-y: auto;
  background: ${Colors.Gray[400]};
  color: ${Colors.Gray[100]};
  animation: ${fadeIn} 0.3s;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  @media ${device.md} {
    padding: 48px;
  }
`

export const Close = styled(SVG)`
  width: 10px;
  height: 10px;
  position: absolute;
  top: 24px;
  right: 24px;
  cursor: pointer;

  @media ${device.sm} {
    width: 16px;
    height: 16px;
  }

  &:hover path {
    fill: ${Colors.White};
  }

  path {
    fill: ${Colors.Gray[100]};
  }
`
