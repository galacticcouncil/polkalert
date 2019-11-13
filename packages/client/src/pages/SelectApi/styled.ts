import styled from 'styled-components'

import { Input } from 'ui'
import { device } from 'styles/media'

export const Wrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const Inner = styled.div`
  max-width: 100%;
  width: 400px;
  padding: 0 24px;
`

export const Form = styled.div`
  padding-bottom: 40px;
`

export const FormInput = styled(Input)`
  width: 100%;
  margin: 16px 0 0;
`
