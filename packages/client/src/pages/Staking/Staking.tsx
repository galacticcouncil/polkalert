import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import { MatchInterface } from 'types'
import { Tabs } from 'ui'

import { CurrentEra, PreviousEras } from './sections'

import * as S from './styled'

type Props = {
  match: MatchInterface
}

const Staking = ({ match }: Props) => (
  <S.Wrapper>
    <S.Header>
      <Tabs
        tabs={[
          {
            text: 'Current Era',
            href: 'current-era'
          },
          {
            text: 'Previous Eras',
            href: 'previous-eras'
          }
        ]}
      />
    </S.Header>
    <S.Content>
      <Switch>
        <Route
          path={`${match.path}/current-era`}
          exact
          component={CurrentEra}
        />
        <Route
          path={`${match.path}/previous-eras`}
          exact
          component={PreviousEras}
        />
        <Redirect from="*" to={`${match.path}/current-era`} />
      </Switch>
    </S.Content>
  </S.Wrapper>
)

export default Staking
