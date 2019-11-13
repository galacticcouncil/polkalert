import styled from 'styled-components'
import CSS from 'csstype'

import { Colors } from 'styles/variables'

export const Wrapper = styled.div<{
  className?: string
  style?: CSS.Properties
}>``

export const Label = styled.div`
  margin-bottom: 24px;
  color: ${Colors.Gray[100]};
`

export const Option = styled.div<{
  active: boolean
  onClick: () => void
}>`
  color: ${Colors.Gray[100]};
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;

  &:not(:last-of-type) {
    margin-bottom: 16px;
  }

  &:before,
  &:after {
    content: ' ';
    border-radius: 50%;
  }

  &:before {
    width: 16px;
    height: 16px;
    margin-right: 16px;
    border: 2px solid ${Colors.Gray[100]};
    display: block;
  }

  &:after {
    width: 10px;
    height: 10px;
    background: ${Colors.White};
    transform: scale(${p => (p.active ? '1' : '0')});
    transition: transform 0.3s;
    position: absolute;
    left: 5px;
    top: 5px;
  }
`
