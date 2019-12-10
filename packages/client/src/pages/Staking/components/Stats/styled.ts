import styled from 'styled-components'

import { Colors } from 'styles/variables'

export const Wrapper = styled.div`
  margin: -12px -48px;
  padding-bottom: 48px;
  display: flex;
  flex-wrap: wrap;
`

export const Column = styled.div`
  margin: 12px 48px;
`

export const Title = styled.div`
  margin-bottom: 12px;
  color: ${Colors.Gray[100]};
  line-height: 17px;
`

export const Text = styled.div`
  color: ${Colors.White};
  font-size: 32px;
  line-height: 39px;
`
