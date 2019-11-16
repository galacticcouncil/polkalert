import React, { useEffect } from 'react'
import { Router, Switch, Route, Redirect } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { useSelector } from 'react-redux'

import { NavigationProvider } from 'contexts'
import { DefaultLayout } from 'layouts'
import { SelectApi, Staking, Contact, Settings } from 'pages'
import { apiSelector } from 'selectors'

const history = createBrowserHistory()

const App = () => {
  const api = useSelector(apiSelector)

  useEffect(() => {
    if (!api.loaded) history.push('/')
  }, [api])

  return (
    <Router history={history}>
      <NavigationProvider>
        <DefaultLayout>
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
