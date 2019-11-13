import styled, { css } from 'styled-components'
import { NavLink } from 'react-router-dom'

import { Colors } from 'styles/variables'

export const Wrapper = styled.div`
  width: 100%;
  background: ${Colors.Gray[400]};
  border-bottom: 2px solid ${Colors.Gray[200]};
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9200;
`

export const Header = styled.div`
  height: 64px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const Logo = styled.img<{
  src: string
  onClick?: () => void
}>`
  max-width: 90px;
  margin-top: 8px;
  cursor: pointer;
`

export const Hamburger = styled.button<{
  active: boolean
  onClick: () => void
}>`
  padding: 12px;
  overflow: hidden;
  transition: all 0.15s linear;
  position: relative;
  display: inline-block;
  cursor: pointer;

  span {
    background: ${p => (p.active ? 'transparent' : Colors.Gray[100])};

    &,
    &:before,
    &:after {
      width: 24px;
      height: 2px;
      border-radius: 8px;
      transition: all 0.125s ease-in;
      position: absolute;
      left: 0;
    }

    &:before,
    &:after {
      content: ' ';
      background: ${Colors.Gray[100]};
      display: block;
    }

    &:before {
      top: -6px;
    }

    &:after {
      bottom: -6px;
    }

    ${p =>
      p.active &&
      css`
        &:before {
          transform: translateY(6px) rotate(45deg);
        }

        &:after {
          transform: translateY(-6px) rotate(-45deg);
        }
      `}
`

export const MenuLink = styled(NavLink)<{
  to: string
  activeClassName: string
  onClick: () => void
}>`
  padding: 16px;
  border-top: 1px solid ${Colors.Gray[200]};
  color: ${Colors.Gray[100]};
  display: flex;
  align-items: center;

  &:not(.active):hover {
    color: ${Colors.White};

    svg path {
      fill: ${Colors.White};
    }
  }

  &.active {
    color: ${Colors.Primary};

    svg path {
      fill: ${Colors.Primary};
    }
  }

  svg {
    width: 22px;
    margin-right: 16px;

    path {
      fill: ${Colors.Gray[100]};
    }
  }
`
