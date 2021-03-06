import React, { useState, useEffect } from 'react'
import { Router, Switch, Route, Redirect } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { useDispatch } from 'react-redux'
import { useQuery } from '@apollo/react-hooks'

import { NavigationProvider } from 'contexts'
import { DefaultLayout } from 'layouts'
import { Welcome, Staking, Contact, Settings, ShortOnboarding } from 'pages'
import { Loading } from 'ui'
import { setApiAction } from 'actions'
import NODEINFO_QUERY from 'apollo/queries/nodeInfo'

const history = createBrowserHistory()

const App = () => {
  const dispatch = useDispatch()

  const [shouldRender, setShouldRender] = useState<boolean>(false)
  const { data, error, loading } = useQuery(NODEINFO_QUERY)

  useEffect(() => {
    if (!loading) {
      if (data?.nodeInfo?.chain) {
        dispatch(setApiAction({ loaded: true, demo: false }))
        if (location.pathname === '/') history.push('/staking')
        setShouldRender(true)
      } else {
        history.push('/')
        setShouldRender(true)
      }
      if (error) {
        history.push('/')
        setShouldRender(true)
      }
    }
  }, [data, error, loading])

  return (
    <Router history={history}>
      <NavigationProvider>
        <DefaultLayout>
          {shouldRender ? (
            <Switch>
              <Route path="/" exact component={Welcome} />
              <Route path="/staking" component={Staking} />
              <Route path="/contact" exact component={Contact} />
              <Route path="/settings" component={Settings} />
              <Route path="/onboarding" component={ShortOnboarding} />
              <Redirect from="*" to="/staking" />
            </Switch>
          ) : (
            <Loading />
          )}
        </DefaultLayout>
      </NavigationProvider>
    </Router>
  )
}

export default App
