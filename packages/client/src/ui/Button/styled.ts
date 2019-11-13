import styled, { css } from 'styled-components'
import { transparentize } from 'polished'
import CSS from 'csstype'

import { Colors } from 'styles/variables'

export const Wrapper = styled.button<{
  fluid?: boolean
  theme: string
  disabled?: boolean
  condensed?: boolean
  onClick: () => void
  className?: string
  style?: CSS.Properties
}>`
  min-width: ${p => (p.condensed ? '120px' : '140px')};
  max-width: 100%;
  width: ${p => p.fluid && '100%'};
  padding: ${p => (p.condensed ? '8px 21px' : '13px 29px')};
  border-radius: 50px;
  border: 3px solid transparent;
  font-size: 14px;
  font-weight: 700;
  line-height: 17px;
  transition: all 0.2s linear;

  &:hover {
    border: 3px solid ${transparentize(0.4, Colors.Gray[400])};
  }

  &:disabled {
    background: ${Colors.Gray[100]};
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${p => {
    switch (p.theme) {
      case 'primary':
        return css`
          background: ${Colors.Primary};
          color: ${Colors.Gray[400]};
        `

      case 'error':
        return css`
          background: ${Colors.Error};
          color: ${Colors.White};
        `

      case 'outline':
        return css`
          border: 3px solid ${Colors.Gray[100]};
          color: ${Colors.Gray[100]};

          &:hover {
            border: 3px solid ${Colors.Primary};
            color: ${Colors.Primary};
          }
        `

      case 'outlineMini':
        return css`
          min-width: 64px;
          padding: 1px 8px;
          border: 2px solid ${Colors.Gray[100]};
          color: ${Colors.Gray[100]};
          font-size: 12px;

          &:hover {
            border: 2px solid ${Colors.Primary};
            color: ${Colors.Primary};
          }
        `
    }
  }}
`
