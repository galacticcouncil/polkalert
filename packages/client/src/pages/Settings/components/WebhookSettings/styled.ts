import styled from 'styled-components'

import { Button } from 'ui'
import { Colors } from 'styles/variables'
import { device } from 'styles/media'

export const Wrapper = styled.div`
  max-width: 100%;
  width: 424px;
`

export const NoWebHooks = styled.div`
  max-width: 100%;
  margin-bottom: 24px;
  color: ${Colors.Gray[100]};
`

export const Inner = styled.div`
  padding-bottom: 40px;
`

export const InputWrapper = styled.div`
  display: flex;
  align-items: center;

  svg,
  img {
    margin-left: 8px;
    width: 16px;
    height: 16px;
    cursor: pointer;
    display: block;
    flex: none;
  }

  svg:hover path {
    fill: ${Colors.White};
  }

  path {
    fill: ${Colors.Gray[200]};
  }
`

export const AddWebHook = styled(Button)`
  margin: 0 0 0 auto;
  display: block;

  @media ${device.md} {
    margin: 0 24px 0 auto;
  }
`

export const Submit = styled(Button)`
  max-width: 400px;
`
