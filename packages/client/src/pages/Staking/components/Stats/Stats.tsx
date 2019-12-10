import React from 'react'
import { useQuery } from '@apollo/react-hooks'

import DATAAGE_QUERY from 'apollo/queries/dataAge'

import * as S from './styled'

const Stats = () => {
  const { data } = useQuery(DATAAGE_QUERY)

  return (
    <S.Wrapper>
      {data?.dataAge && (
        <S.Column>
          <S.Title>Data age</S.Title>
          <S.Text>{data.dataAge}</S.Text>
        </S.Column>
      )}
    </S.Wrapper>
  )
}

export default Stats
