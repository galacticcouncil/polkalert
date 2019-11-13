import styled from 'styled-components'
import CSS from 'csstype'

import { Colors } from 'styles/variables'

export const Wrapper = styled.div<{
  fluid?: boolean
  padding?: string | number
  className?: string
  style?: CSS.Properties
}>`
  max-width: 100%;
  width: ${p => (p.fluid ? '100%' : '400px')};
  padding: ${p => p.padding || '32px'};
  background: ${Colors.Gray[300]};
  border-radius: 16px;
  color: ${Colors.Gray[100]};
  line-height: 22px;
`

export const Title = styled.div`
  margin-bottom: 12px;
  color: ${Colors.Gray[100]};
  font-size: 24px;
  font-weight: 900;
  line-height: 28px;
`
