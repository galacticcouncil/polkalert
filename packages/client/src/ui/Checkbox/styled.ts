import styled from 'styled-components'

import { Colors } from 'styles/variables'

export const Wrapper = styled.div`
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  cursor: pointer;
`

export const Icon = styled.div<{
  active: boolean
}>`
  width: 16px;
  height: 16px;
  background: ${p => p.active && Colors.Primary};
  border-radius: 4px;
  border: 2px solid ${p => (p.active ? Colors.Primary : Colors.Gray[100])};
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;

  svg,
  img {
    width: 12px;
    height: 12px;
    flex: none;
  }

  path {
    fill: ${Colors.Gray[400]};
  }
`

export const Text = styled.div`
  margin-left: 8px;
  color: ${Colors.Gray[100]};
`
