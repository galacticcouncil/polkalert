import React, { useEffect } from 'react'
import { Router, Switch, Route, Redirect } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { useDispatch } from 'react-redux'
import { useQuery } from '@apollo/react-hooks'

import { NavigationProvider } from 'contexts'
import { DefaultLayout } from 'layouts'
import { SelectApi, Staking, Contact, Settings } from 'pages'
import { Loading } from 'ui'
import { setApiAction } from 'actions'
import { GetNodeInfoQuery } from 'apollo/queries'

const history = createBrowserHistory()

const App = () => {
  const dispatch = useDispatch()

  const { data, error, loading } = useQuery(GetNodeInfoQuery)

  useEffect(() => {
    if (!loading) {
      if (data?.nodeInfo?.chain) {
        dispatch(setApiAction({ loaded: true }))
      } else {
        history.push('/')
      }

      if (error) {
        history.push('/')
      }
    }
  }, [data, error])

  return (
    <Router history={history}>
      <NavigationProvider>
        <DefaultLayout>
          {loading && <Loading />}
          <Switch>
            <Route path="/" exact component={SelectApi} />
            <Route path="/staking" exact component={Staking} />
            <Route path="/contact" exact component={Contact} />
            <Route path="/settings" exact component={Settings} />
            <Redirect from="*" to="/" />
          </Switch>
        </DefaultLayout>
      </NavigationProvider>
    </Router>
  )
}

export default App
