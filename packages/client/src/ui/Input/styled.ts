import styled from 'styled-components'
import { transparentize } from 'polished'
import CSS from 'csstype'

import { Colors } from 'styles/variables'

export const Wrapper = styled.div<{
  fluid?: boolean
  className?: string
  style?: CSS.Properties
}>`
  max-width: 100%;
  width: ${p => (p.fluid ? '100%' : '350px')};
  margin-bottom: 24px;
  color: ${Colors.Gray[100]};
`

export const Label = styled.div`
  margin-bottom: 12px;
  display: flex;
`

export const Tooltip = styled.div`
  width: 15px;
  height: 15px;
  margin-right: 10px;
  border-radius: 50%;
  border: 2px solid ${Colors.Primary};
  color: ${Colors.Primary};
  font-size: 10px;
  position: relative;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: help;

  &:hover span {
    opacity: 1;
  }

  span {
    width: 264px;
    padding: 8px 12px;
    background: ${Colors.Black};
    border-radius: 8px;
    box-shadow: 1px 2px 3px ${transparentize(0.6, Colors.Black)};
    color: ${Colors.White};
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    opacity: 0;
    transition: opacity 0.2s ease;
    position: absolute;
    top: -8px;
    left: calc(100% + 8px);
    pointer-events: none;
  }
`

export const InputWrapper = styled.div<{
  invalid?: boolean
}>`
  background: ${Colors.Gray[300]};
  border-radius: 8px;
  position: relative;
  display: flex;
  align-items: center;

  &:before {
    content: ${p => p.invalid && "' '"};
    border-radius: 8px;
    background: ${transparentize(0.7, Colors.Error)};
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 100;
    pointer-events: none;
  }
`

export const Input = styled.input<{
  disabled?: boolean
  type: string
  placeholder?: string
  value?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}>`
  width: 100%;
  color: inherit;

  &:disabled {
    opacity: 0.5;
  }
`

export const VisibilityToggle = styled.div`
  margin-right: 4px;
  padding: 8px;
  display: flex;
  cursor: pointer;

  &:hover path {
    fill: ${Colors.Primary};
  }

  svg,
  img {
    width: 22px;
    height: 22px;
  }

  path {
    fill: ${Colors.White};
    transition: fill 0.3s linear;
  }
`
