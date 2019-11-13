import styled from 'styled-components'
import { transparentize } from 'polished'
import CSS from 'csstype'

// This import may seem weird but for some
// reason it doesn't work via destructuring
import Dropdown from 'ui/Dropdown'
import { Colors } from 'styles/variables'

export const Wrapper = styled.div<{
  fluid?: boolean
  className?: string
  style?: CSS.Properties
}>`
  max-width: 100%;
  width: ${p => (p.fluid ? '100%' : '350px')};
  position: relative;
  cursor: pointer;
`

export const Value = styled.div`
  width: 100%;
  padding: 12px 32px 12px 12px;
  overflow: hidden;
  background: ${Colors.Gray[300]};
  border-radius: 8px;
  color: ${Colors.Gray[100]};
  white-space: nowrap;
  text-overflow: ellipsis;
  position: relative;

  img,
  svg {
    width: 10px;
    height: 10px;
    position: absolute;
    top: 14px;
    right: 12px;
  }

  svg path {
    fill: ${Colors.Gray[100]};
  }
`

export const DropdownList = styled(Dropdown)<{
  isOpen: boolean
}>`
  border-radius: 8px;
  box-shadow: 0px 2px 8px ${transparentize(0.6, Colors.Black)};
  position: absolute;
  top: 48px;
  right: 0;
  left: 0;
  z-index: 100;
`

export const DropdownCard = styled.div`
  overflow: hidden;
  background: ${Colors.Gray[300]};
  border-radius: 8px;
`

export const Option = styled.button<{
  active: boolean
  onClick: () => void
}>`
  width: 100%;
  padding: 10px 12px;
  border-top: 1px solid ${Colors.Gray[200]};
  color: ${Colors.Gray[100]};
  font-weight: ${p => (p.active ? 700 : 500)};
  text-align: left;

  &:hover {
    background: ${Colors.Primary};
    color: ${Colors.Gray[400]};
  }

  &:first-of-type {
    border: none;
  }
`
