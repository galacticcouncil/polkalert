import styled from 'styled-components'

import { device } from 'styles/media'

export const Wrapper = styled.div``

export const Inner = styled.div`
  display: grid;
  grid-template-columns: 100%;
  grid-column-gap: 112px;

  @media ${device.md} {
    grid-template-columns: repeat(2, 1fr);
  }
`
