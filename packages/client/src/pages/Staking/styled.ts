import styled from 'styled-components'

import { device } from 'styles/media'

export const Wrapper = styled.div`
  min-height: 100%;
`

export const Header = styled.div`
  padding-bottom: 24px;
  display: flex;
  align-items: center;

  @media ${device.lg} {
    padding-bottom: 56px;
  }
`

export const Content = styled.div``
