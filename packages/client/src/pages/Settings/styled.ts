import styled from 'styled-components'

import { device } from 'styles/media'

export const Wrapper = styled.div`
  width: 100%;

  @media ${device.md} {
    width: 400px;
  }
`
