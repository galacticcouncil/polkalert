import styled from 'styled-components'

export const Wrapper = styled.div<{
  maxWidth?: string
}>`
  max-width ${p => p.maxWidth || '1248px'};
  width: 100%;
  margin: 0 auto;
  padding: 0 24px;
`
