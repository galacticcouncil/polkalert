import styled from 'styled-components'

import { Colors } from 'styles/variables'
import { device } from 'styles/media'

export const Wrapper = styled.div`
  min-height: 100%;
`

export const Form = styled.form`
  width: 100%;

  @media ${device.md} {
    width: 400px;
  }
`

export const Logo = styled.div`
  margin: 24px 0 32px;
  color: ${Colors.Gray[100]};
  display: flex;
  align-self: center;
  align-items: center;

  a:hover path {
    fill: ${Colors.Primary};
  }

  svg,
  img {
    max-width: 40px;
    max-height: 40px;
    margin-left: 8px;
  }

  path {
    fill: ${Colors.Gray[100]};
  }
`

export const ErrorMsg = styled.div`
  color: ${Colors.Error};
`

export const SuccessMsg = styled.div`
  color: ${Colors.Primary};
`
