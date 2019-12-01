import styled, { keyframes } from 'styled-components'
import { transparentize } from 'polished'

import { Colors } from 'styles/variables'
import { device } from 'styles/media'

const loadingWrapperAnimation = keyframes`
  to {
    transform: translate(-50%, -50%) rotate(450deg);
  }
`

const loadingCircleAnimation = keyframes`
  to {
    stroke-dashoffset: -540;
  }
`

export const Wrapper = styled.div<{
  apiLoaded: boolean
  transparent: boolean
}>`
  width: 100vw;
  height: ${p => (p.apiLoaded ? 'calc(100vh - 66px)' : '100vh')};
  background: ${p =>
    p.transparent ? transparentize(0.5, Colors.Gray[400]) : Colors.Gray[400]};
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 9100;
  display: flex;
  align-items: center;
  justify-content: center;

  @media ${device.lg} {
    width: ${p => p.apiLoaded && 'calc(100vw - 140px)'};
    height: 100vh;
    left: ${p => (p.apiLoaded ? '140px' : '0')};
  }

  .loading-spinner {
    stroke: ${Colors.Primary};
    transform: translate(-50%, -50%) rotate(90deg);
    animation: ${loadingWrapperAnimation} 4s linear infinite;
    position: absolute;
    top: 50%;
    left: 50%;

    circle {
      stroke-dasharray: 270;
      stroke-dashoffset: 0;
      animation: ${loadingCircleAnimation} 3s ease-in infinite;
    }
  }

  svg path {
    fill: ${Colors.Primary};
  }
`
