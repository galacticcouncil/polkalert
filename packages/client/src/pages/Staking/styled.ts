import styled from 'styled-components'

import { Colors } from 'styles/variables'
import { device } from 'styles/media'

export const Wrapper = styled.div`
  min-height: 100%;
`

export const Header = styled.div`
  padding-bottom: 24px;

  @media ${device.md} {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  @media ${device.lg} {
    padding-bottom: 88px;
  }
`

export const DataAge = styled.div`
  padding-top: 24px;
  color: ${Colors.Gray[100]};
  text-align: center;

  @media ${device.md} {
    padding-top: 0;
    text-align: right;
  }

  strong {
    color: ${Colors.White};
  }
`

export const Content = styled.div``
