import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

import { Colors } from 'styles/variables'

export const Wrapper = styled.div`
  padding: 5px;
  border-radius: 50px;
  border: 2px solid ${Colors.Gray[200]};
`

export const Inner = styled.div`
  position: relative;
  display: flex;
`

export const Tab = styled(NavLink)`
  width: 156px;
  padding: 10px 25px;
  color: ${Colors.Gray[100]};
  font-size: 14px;
  font-weight: 700;
  line-height: 17px;
  text-align: center;
  transition: color 0.2s linear;
  position: relative;
  z-index: 100;
  display: block;

  &.active {
    color: ${Colors.Gray[400]};
  }
`

export const ActiveTabBackground = styled.div`
  width: 156px;
  background: ${Colors.Primary};
  border-radius: 50px;
  transition: transform 0.2s ease;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
`
