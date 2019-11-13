import styled from 'styled-components'
import CSS from 'csstype'

export const Wrapper = styled.div<{
  isOpen: boolean
  className?: string
  style?: CSS.Properties
}>`
  max-height: ${p => (p.isOpen ? '999px' : '0px')};
  overflow: hidden;
  transition: ${p =>
    p.isOpen ? 'max-height 1s' : 'max-height 0.5s cubic-bezier(0, 1, 0, 1)'};
`
