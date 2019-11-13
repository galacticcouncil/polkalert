import styled from 'styled-components'
import { transparentize } from 'polished'
import { NavLink } from 'react-router-dom'

import { Colors } from 'styles/variables'
import { device } from 'styles/media'

export const Wrapper = styled.div<{
  isDesktop?: boolean
}>`
  background: ${Colors.Gray[400]};
  display: flex;
  flex-direction: ${p => !p.isDesktop && 'column'};
`

export const Sidebar = styled.div`
  width: 140px;
  border-right: 2px solid ${Colors.Gray[200]};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

export const Logo = styled.img`
  max-width: 110px;
  position: absolute;
  top: 56px;
  left: 15px;
  cursor: pointer;
`

export const MenuLink = styled(NavLink)`
  color: ${Colors.Gray[100]};
  display: flex;
  flex-direction: column;
  align-items: center;

  &:not(:last-of-type) {
    margin-bottom: 56px;
  }

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
    margin-bottom: 8px;

    path {
      fill: ${p => Colors.Gray[100]};
    }
  }
`

export const Content = styled.div<{
  apiLoaded: boolean
}>`
  height: ${p => (p.apiLoaded ? 'calc(100vh - 66px)' : '100vh')};
  margin-top: ${p => p.apiLoaded && '66px'};
  padding: 16px;
  overflow-x: hidden;
  overflow-y: auto;

  @media ${device.lg} {
    height: 100vh;
    margin-top: 0;
    padding: 56px;
    flex: 1;
  }

  ::-webkit-scrollbar-track {
    background: ${transparentize(0.9, Colors.White)};
    border-radius: 50px;
  }

  ::-webkit-scrollbar {
    width: 7px;
    background: ${transparentize(0.9, Colors.White)};
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${transparentize(0.8, Colors.White)};
    border-radius: 50px;
    -webkit-box-shadow: inset 0 0 6px ${transparentize(0.8, Colors.White)};
  }
`
