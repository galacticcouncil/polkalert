import styled from 'styled-components'

import { FullScreenModal } from 'ui'
import { Colors } from 'styles/variables'
import { device } from 'styles/media'

export const Wrapper = styled(FullScreenModal)`
  padding: 56px 24px;
  z-index: 9300;

  @media ${device.md} {
    padding: 80px 56px;
  }
`

export const Content = styled.div`
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
`

export const Addresses = styled.div`
  padding-bottom: 64px;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
`

export const Address = styled.div`
  width: 160px;
  margin-right: 24px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;

  span {
    margin-left: 8px;
    font-weight: 500;
    line-height: 15px;

    @media ${device.lg} {
      margin-left: 8px;
    }
  }
`

export const NoData = styled.div`
  color: ${Colors.Gray[100]};
`
