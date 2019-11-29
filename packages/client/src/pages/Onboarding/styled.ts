import styled from 'styled-components'
import { transparentize } from 'polished'

import { Colors } from 'styles/variables'
import { device } from 'styles/media'

export const Wrapper = styled.div`
  margin: -16px;
  color: ${Colors.White};
  display: flex;
  flex-direction: column;
  align-items: center;

  @media ${device.lg} {
    margin: -56px;
  }
`

export const Progress = styled.div`
  width: 100%;
  padding: 24px;
`

export const ProgressBar = styled.div<{
  progress: number
}>`
  height: 4px;
  background: ${transparentize(0.8, Colors.Primary)};
  border-radius: 4px;
  position: relative;

  &:after {
    content: ' ';
    width: ${p => p.progress}%;
    background: ${Colors.Primary};
    border-radius: 4px;
    transition: width 0.3s ease;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
  }
`

export const ProgressText = styled.div`
  padding-top: 12px;
  color: ${Colors.Gray[100]};
  font-size: 14px;
  font-weight: 700;
`

export const Disclaimer = styled.div`
  max-width: 100%;
  padding: 16px 16px 0;
  color: ${transparentize(0.2, Colors.Gray[100])};
  text-align: center;

  @media ${device.md} {
    padding: 0 24px;
  }
`

export const Scroller = styled.div`
  padding: 64px 0;
  transition: transform 0.3s ease;
  display: flex;
  align-self: flex-start;
  align-items: flex-start;

  @media ${device.md} {
    padding: 128px 0;
    align-items: flex-end;
  }
`

export const ScrollerItem = styled.div`
  width: 100vw;
  padding: 0 24px;
  flex: none;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const ScrollerItemName = styled.div`
  max-width: 100%;
  width: 350px;
  margin-bottom: 16px;
  color: ${Colors.Primary};
  font-size: 16px;
  font-weight: 700;
`

export const ScrollerItemText = styled.div`
  margin-bottom: 56px;
  max-width: 100%;
  width: 350px;
  color: ${Colors.Gray[100]};

  code {
    padding: 1px 4px;
    background: ${Colors.Gray[200]};
    border-radius: 3px;
    color: ${Colors.Primary};
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
