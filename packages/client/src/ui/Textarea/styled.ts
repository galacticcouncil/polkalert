import styled from 'styled-components'
import { transparentize } from 'polished'

import { Colors } from 'styles/variables'

export const Wrapper = styled.div<{
  fluid?: boolean
}>`
  max-width: 100%;
  width: ${p => (p.fluid ? '100%' : '350px')};
  margin-bottom: 24px;
  color: ${Colors.Gray[100]};
`

export const Label = styled.div`
  margin-bottom: 12px;
`

export const TextareaWrapper = styled.div<{
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

export const Textarea = styled.textarea`
  width: 100%;
  padding: 12px 14px;
  background: ${Colors.Gray[300]};
  border: none;
  border-radius: 8px;
  color: inherit;
  font-size: 14px;
  line-height: 18px;
  position: relative;
  display: block;
  resize: none;

  &:focus {
    outline: none;
  }
`
