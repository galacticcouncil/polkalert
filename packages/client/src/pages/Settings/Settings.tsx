import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'

import { GetSettingsQuery } from 'apollo/queries'
import { MatchInterface } from 'types'
import { Tabs } from 'ui'

import {
  NodeUrlSettings,
  EmailSettings,
  WebhookSettings,
  ApplicationSettings
} from './components'

import * as S from './styled'

type Props = {
  match: MatchInterface
}

const Settings = ({ match }: Props) => {
  const { data } = useQuery(GetSettingsQuery)

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
              text: 'Email',
              href: '/settings/email'
            },
            {
              text: 'Webhooks',
              href: '/settings/webhooks'
            },
            {
              text: 'Application',
              href: '/settings/application'
            }
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
            path={`${match.path}/email`}
            exact
            render={props => <EmailSettings data={data?.settings} {...props} />}
          />
          <Route
            path={`${match.path}/webhooks`}
            exact
            render={props => (
              <WebhookSettings data={data?.settings} {...props} />
            )}
          />
          <Route
            path={`${match.path}/application`}
            exact
            render={props => (
              <ApplicationSettings data={data?.settings} {...props} />
            )}
          />
          <Redirect from="*" to={`${match.path}/node-url`} />
        </Switch>
      </S.Content>
    </S.Wrapper>
  )
}

export default Settings
