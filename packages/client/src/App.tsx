import React, { useEffect } from 'react'
import { Router, Switch, Route, Redirect } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { useDispatch } from 'react-redux'
import { useQuery } from '@apollo/react-hooks'

import { NavigationProvider } from 'contexts'
import { DefaultLayout } from 'layouts'
import { SelectApi, Staking, Contact } from 'pages'
import { setApiAction } from 'actions'
import { GetNodeInfo } from 'apollo/queries'

const history = createBrowserHistory()

const App = () => {
  const dispatch = useDispatch()

  const { data } = useQuery(GetNodeInfo)

  useEffect(() => {
    if (data?.nodeInfo) {
      data.nodeInfo.chain
        ? dispatch(setApiAction({ loaded: true }))
        : history.push('/')
    }
  }, [data])

  return (
    <Router history={history}>
      <NavigationProvider>
        <DefaultLayout>
          <Switch>
            <Route path="/" exact component={SelectApi} />
            <Route path="/staking" exact component={Staking} />
            <Route path="/contact" exact component={Contact} />
            <Redirect from="*" to="/" />
          </Switch>
        </DefaultLayout>
      </NavigationProvider>
    </Router>
  )
}

export default App
