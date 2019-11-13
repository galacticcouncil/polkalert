import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { ApolloProvider } from '@apollo/react-hooks'

import configureStore from 'config/store'
import client from 'apollo'
import App from './App'

import 'styles/global.css'

const store = configureStore()

render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <App />
    </Provider>
  </ApolloProvider>,
  document.getElementById('root')
)
