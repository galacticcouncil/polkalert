import React from 'react'
import { useSelector } from 'react-redux'

import { apiSelector } from 'selectors'

import * as S from './styled'

const Loading = () => {
  const api = useSelector(apiSelector)

  return (
    <S.Wrapper apiLoaded={api.loaded}>
      <svg width="60px" height="60px" className="loading-spinner">
        <circle cx="30" cy="30" r="26" fill="transparent" strokeWidth="8" />
      </svg>
    </S.Wrapper>
  )
}

export default Loading
