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

export const ErrorMsg = styled.div`
  color: ${Colors.Error};
`

export const SuccessMsg = styled.div`
  color: ${Colors.Primary};
`
