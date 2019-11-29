import React, { useState, useEffect } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import { useSelector } from 'react-redux'

import {
  ValidatorInterface,
  ValidatorFormattedInterface,
  MatchInterface
} from 'types'
import { GetValidatorsQuery } from 'apollo/queries'
import { apiSelector } from 'selectors'
import { Tabs } from 'ui'
import stakingDemo from 'mocks/staking'

import { ValidatorList } from './components'

import * as S from './styled'

type Data = {
  validators: ValidatorInterface[]
}

type QueryResult = {
  data: Data
}

type VFI = ValidatorFormattedInterface[]

type Props = {
  match: MatchInterface
}

const Staking = ({ match }: Props) => {
  const [currentValidators, setCurrentValidators] = useState<VFI>([])
  const [previousValidators, setPreviousValidators] = useState<VFI>([])
  const api = useSelector(apiSelector)
  const query = useQuery(GetValidatorsQuery, {
    pollInterval: 10000
  })

  const { data } = api.demo ? (stakingDemo as QueryResult) : query

  useEffect(() => {
    if (data?.validators?.length) {
      // TEMP SOLUTION, THE DATA STRUCTURE WILL CHANGE
      const validatorsFormatted = data.validators.map(item => ({
        ...item,
        commissionData: item.commissionData?.length
          ? item.commissionData.map(data => ({
            ...data,
            nominatorData: data.nominatorData
              ? JSON.parse(data.nominatorData)
              : {}
          }))
          : [{}]
      }))

      setCurrentValidators(
        validatorsFormatted.filter(item => item.currentValidator)
      )
      setPreviousValidators(
        validatorsFormatted.filter(item => !item.currentValidator)
      )
    }
  }, [data])

  return (
    <S.Wrapper>
      <S.Header>
        <Tabs
          tabs={[
            {
              text: 'Current Era',
              href: '/staking/current-era'
            },
            {
              text: 'Previous Eras',
              href: '/staking/previous-eras'
            }
          ]}
        />
      </S.Header>
      <S.Content>
        <Switch>
          <Route
            path={`${match.path}/current-era`}
            exact
            render={props => (
              <ValidatorList validators={currentValidators} {...props} />
            )}
          />
          <Route
            path={`${match.path}/previous-eras`}
            exact
            render={props => (
              <ValidatorList validators={previousValidators} {...props} />
            )}
          />
          <Redirect from="*" to={`${match.path}/current-era`} />
        </Switch>
      </S.Content>
    </S.Wrapper>
  )
}

export default Staking
