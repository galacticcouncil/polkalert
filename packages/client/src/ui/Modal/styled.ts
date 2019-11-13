import styled, { keyframes } from 'styled-components'
import { transparentize } from 'polished'
import SVG from 'react-inlinesvg'

import { Card } from 'ui'
import { Colors } from 'styles/variables'
import { device } from 'styles/media'

const zoomIn = keyframes`
  from {
    transform: scale(0.7)
  }

  to {
    transform: scale(1)
  }
`

const fadeIn = keyframes`
  from {
    opacity: 0
  }

  to {
    opacity: 1
  }
`

export const Wrapper = styled.div`
  margin-top: 64px;
  padding: 24px;
  overflow-y: auto;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9000;
  display: flex;

  @media ${device.lg} {
    margin-top: 0;
  }
`

export const Content = styled(Card)`
  margin: auto;
  box-shadow: 0px 2px 16px ${transparentize(0.8, Colors.Black)};
  animation: ${zoomIn} 0.15s cubic-bezier(0, 0.5, 0.15, 1.35) forwards;
  position: relative;
  z-index: 100;
`

export const Close = styled(SVG)`
  width: 10px;
  height: 10px;
  position: absolute;
  top: 14px;
  right: 14px;
  cursor: pointer;

  @media ${device.sm} {
    width: 16px;
    height: 16px;
    top: -8px;
    right: -24px;
  }

  &:hover path {
    fill: ${Colors.White};
  }

  path {
    fill: ${Colors.Gray[100]};
  }
`

export const Dimmer = styled.div`
  background: ${transparentize(0.3, Colors.Gray[400])};
  animation: ${fadeIn} 0.15s linear forwards;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`
