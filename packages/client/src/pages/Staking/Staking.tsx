import React, { useState, useEffect } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import { useSelector } from 'react-redux'

import {
  ValidatorInterface,
  ValidatorFormattedInterface,
  MatchInterface
} from 'types'
import DATAAGE_QUERY from 'apollo/queries/dataAge'
import VALIDATORS_QUERY from 'apollo/queries/validators'
import { apiSelector } from 'selectors'
import { Tabs } from 'ui'
import stakingDemo from 'mocks/staking'

import { ValidatorList } from './components'

import * as S from './styled'

type QueryResult = {
  data: {
    validators: ValidatorInterface[]
  }
}

type VFI = ValidatorFormattedInterface[]

type Props = {
  match: MatchInterface
}

const Staking = ({ match }: Props) => {
  const [currentValidators, setCurrentValidators] = useState<VFI>([])
  const [previousValidators, setPreviousValidators] = useState<VFI>([])
  const [loading, setLoading] = useState<boolean>(true)
  const api = useSelector(apiSelector)
  const query = useQuery(VALIDATORS_QUERY, {
    pollInterval: 15000
  })

  const { data } = api.demo ? (stakingDemo as QueryResult) : query
  const dataAge = useQuery(DATAAGE_QUERY, {
    pollInterval: 15000
  })

  useEffect(() => {
    if (data?.validators?.length) {
      // TEMP SOLUTION, THE DATA STRUCTURE WILL CHANGE
      const validatorsFormatted = data.validators.map(item => ({
        ...item,
        commissionData: item.commissionData?.length
          ? {
              ...item.commissionData[0],
              nominatorData: item.commissionData[0].nominatorData
                ? JSON.parse(item.commissionData[0].nominatorData)
                : {}
            }
          : [{}]
      }))

      setCurrentValidators(
        validatorsFormatted.filter(item => item.currentValidator)
      )
      setPreviousValidators(
        validatorsFormatted.filter(item => !item.currentValidator)
      )
      setLoading(false)
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
        {dataAge?.data?.dataAge && (
          <S.DataAge>
            Data age: <strong>{dataAge.data.dataAge}</strong>
          </S.DataAge>
        )}
      </S.Header>
      <S.Content>
        <Switch>
          <Route
            path={`${match.path}/current-era`}
            exact
            render={props => (
              <ValidatorList
                loading={loading}
                validators={currentValidators}
                {...props}
              />
            )}
          />
          <Route
            path={`${match.path}/previous-eras`}
            exact
            render={props => (
              <ValidatorList
                loading={loading}
                validators={previousValidators}
                {...props}
              />
            )}
          />
          <Redirect from="*" to={`${match.path}/current-era`} />
        </Switch>
      </S.Content>
    </S.Wrapper>
  )
}

export default Staking
