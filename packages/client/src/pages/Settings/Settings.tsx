import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'

import SETTINGS_QUERY from 'apollo/queries/settings'
import { MatchInterface } from 'types'
import { Tabs } from 'ui'

import { NodeUrlSettings, NotificationsSettings } from './components'

import * as S from './styled'

type Props = {
  match: MatchInterface
}

const Settings = ({ match }: Props) => {
  const { data } = useQuery(SETTINGS_QUERY)

  return (
    <S.Wrapper>
      <S.Header>
        <Tabs
          tabs={[
            {
              text: 'Node URL',
              href: '/settings/node-url'
            },
            {
              text: 'Notifications',
              href: '/settings/notifications'
            }
            // {
            //   text: 'Application',
            //   href: '/settings/application'
            // }
          ]}
        />
      </S.Header>
      <S.Content>
        <Switch>
          <Route
            path={`${match.path}/node-url`}
            exact
            component={NodeUrlSettings}
          />
          <Route
            path={`${match.path}/notifications`}
            exact
            render={props => (
              <NotificationsSettings data={data?.settings} {...props} />
            )}
          />
          {/* <Route
            path={`${match.path}/application`}
            exact
            render={props => (
              <ApplicationSettings data={data?.settings} {...props} />
            )}
          /> */}
          <Redirect from="*" to={`${match.path}/node-url`} />
        </Switch>
      </S.Content>
    </S.Wrapper>
  )
}

export default Settings
