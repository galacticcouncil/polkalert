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
`

export const InputWrapper = styled.div<{
  invalid?: boolean
}>`
  position: relative;

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
  padding: 12px 14px;
  background: ${Colors.Gray[300]};
  border-radius: 8px;
  color: inherit;

  &:disabled {
    opacity: 0.5;
  }
`
