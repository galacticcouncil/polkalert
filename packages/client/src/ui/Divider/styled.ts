import styled from 'styled-components'

import { Colors } from 'styles/variables'

export const Wrapper = styled.div`
  color: ${Colors.Gray[100]};
  display: flex;
  align-items: center;

  &:after {
    content: ' ';
    height: 1px;
    margin-left: 8px;
    background: ${Colors.Gray[200]};
    flex: 1;
  }
`
