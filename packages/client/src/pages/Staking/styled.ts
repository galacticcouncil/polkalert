import styled from 'styled-components'

import { Colors } from 'styles/variables'
import { device } from 'styles/media'

export const Wrapper = styled.div`
  min-height: 100%;
`

export const Header = styled.div`
  padding-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media ${device.lg} {
    padding-bottom: 88px;
  }
`

export const DataAge = styled.div`
  color: ${Colors.Gray[100]};

  strong {
    color: ${Colors.White};
  }
`

export const Content = styled.div``
