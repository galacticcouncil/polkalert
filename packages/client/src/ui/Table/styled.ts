import styled from 'styled-components'
import { darken } from 'polished'

import { Colors } from 'styles/variables'

export const Wrapper = styled.div``

export const Inner = styled.div`
  overflow: hidden;
  border-radius: 8px;
`

export const Table = styled.table`
  width: 100%;

  thead {
    th {
      padding: 20px 32px;
      background: ${darken(0.08, Colors.Gray[400])};
      color: ${Colors.Primary};
      text-align: left;
    }
  }

  tbody {
    tr {
      &:not(:last-of-type) td {
        border-bottom: 1px solid ${Colors.Gray[200]};
      }

      td {
        padding: 20px 32px;
        background: ${Colors.Gray[300]};
        color: ${Colors.White};
        word-break: break-all;
      }
    }
  }
`
