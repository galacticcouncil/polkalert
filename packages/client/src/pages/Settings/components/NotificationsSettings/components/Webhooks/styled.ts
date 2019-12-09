import styled from 'styled-components'

import { Colors } from 'styles/variables'

export const Wrapper = styled.div`
  max-width: 100%;
`

export const NoWebHooks = styled.div`
  max-width: 100%;
  margin-bottom: 28px;
  color: ${Colors.Gray[100]};
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
