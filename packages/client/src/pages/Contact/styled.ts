import styled from 'styled-components'

import { Colors } from 'styles/variables'
import { device } from 'styles/media'

export const Wrapper = styled.div`
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

export const Form = styled.form`
  width: 100%;

  @media ${device.md} {
    width: 400px;
  }
`

export const Title = styled.div`
  margin-bottom: 48px;
  color: ${Colors.Gray[100]};
  font-size: 24px;
  line-height: 24px;
`

export const Logo = styled.div`
  margin-top: 56px;
  color: ${Colors.Gray[100]};
  display: flex;
  align-self: center;
  align-items: center;

  @media ${device.md} {
    margin-top: 96px;
    align-self: flex-end;
  }

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
