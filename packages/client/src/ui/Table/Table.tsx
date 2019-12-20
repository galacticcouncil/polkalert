import React from 'react'
import CSS from 'csstype'

import * as S from './styled'

type Header = {
  text: string
  key: string
}

type Props = {
  id: string
  headers: Header[]
  data: {
    [key: string]: string
  }[]
  className?: string
  style?: CSS.Properties
}

const Table = ({ id, headers, data, className = '', style }: Props) => (
  <S.Wrapper className={className} style={style}>
    {!!headers?.length && (
      <S.Inner>
        <S.Table cellPadding="0" cellSpacing="0">
          <thead>
            <tr>
              {headers.map((item, idx) => (
                <th key={`table-${id}-header-${idx}`}>{item.text}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!!data?.length ? (
              data.map((row, rowIdx) => (
                <tr key={`table-${id}-row-${rowIdx}`}>
                  {headers.map((col, colIdx) => (
                    <td key={`table-${id}-row-${rowIdx}-col-${colIdx}`}>
                      {row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={headers.length}>No data available.</td>
              </tr>
            )}
          </tbody>
        </S.Table>
      </S.Inner>
    )}
  </S.Wrapper>
)

export default Table
