import styled, { css, keyframes } from 'styled-components'
import { transparentize } from 'polished'
import CSS from 'csstype'

import { Colors } from 'styles/variables'

const showAnim = keyframes`
  0% {
    transform: translateX(-50%) scale(0.8);
    opacity: 0;
  }

  25% {
    transform: translateX(-50%) scale(1.15);
    opacity: 1;
  }

  100% {
    transform: translateX(-50%) scale(1);
  }
`

const hideAnim = keyframes`
  from {
    opacity: 1;
  }

  to {
    opacity: 0
  }
`

export const Wrapper = styled.div<{
  theme: string
  permanent: boolean
  hideAnimation: boolean
  className?: string
  style?: CSS.Properties
}>`
  max-width: 400px;
  padding: 12px 20px;
  border-radius: 6px;
  transform: translateX(-50%) scale(1);
  animation: ${p =>
    !p.permanent &&
    (p.hideAnimation
      ? css`
          ${hideAnim} 1s ease-in forwards
        `
      : css`
          ${showAnim} 0.15s linear forwards
        `)};
  position: fixed;
  bottom: 32px;
  left: 50%;
  z-index: 9100;

  ${p => {
    switch (p.theme) {
      case 'white':
        return css`
          background: ${Colors.White};
          box-shadow: 0 0 8px 0 ${transparentize(0.6, Colors.Primary)};
          color: ${Colors.Primary};
        `

      case 'primary':
        return css`
          background: ${Colors.Primary};
          color: ${Colors.White};
        `

      case 'gray100':
        return css`
          background: ${Colors.Gray[100]};
          color: ${Colors.Gray[400]};
        `

      case 'gray200':
        return css`
          background: ${Colors.Gray[200]};
          color: ${Colors.Gray[100]};
        `

      case 'gray300':
        return css`
          background: ${Colors.Gray[300]};
          color: ${Colors.Gray[100]};
        `

      case 'gray400':
        return css`
          background: ${Colors.Gray[400]};
          color: ${Colors.Gray[100]};
        `

      case 'success':
        return css`
          background: ${Colors.Success};
          color: ${Colors.White};
        `

      case 'warning':
        return css`
          background: ${Colors.Warning};
          color: ${Colors.White};
        `

      case 'error':
        return css`
          background: ${Colors.Error};
          color: ${Colors.White};
        `

      default:
        return css`
          background: ${Colors.Primary};
          color: ${Colors.White};
        `
    }
  }}
`
