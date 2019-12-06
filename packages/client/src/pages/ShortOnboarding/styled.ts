import styled from 'styled-components'

import { Colors } from 'styles/variables'
import { device } from 'styles/media'

export const Wrapper = styled.div`
  min-height: 100%;
  padding: 32px 0;
  display: flex;
  align-items: center;
  justify-content: center;

  @media ${device.md} {
    padding: 0;
  }
`

export const Inner = styled.div`
  width: 100%;

  @media ${device.md} {
    width: 704px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  @media ${device.lg} {
    width: 1024px;
  }
`

export const Form = styled.div`
  width: 100%;
  padding-bottom: 16px;
  display: grid;
  grid-template-columns: 100%;
  grid-column-gap: 112px;

  @media ${device.md} {
    grid-template-columns: 1fr 1fr;
  }
`

export const Buttons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 16px;
`

export const ModalTitle = styled.div<{
  isSuccess?: boolean
}>`
  margin-bottom: 16px;
  color: ${p => (p.isSuccess ? Colors.Primary : Colors.Gray[100])};
  font-size: 24px;
`

export const ModalText = styled.div`
  margin-bottom: 48px;
  font-weight: 700;
`
