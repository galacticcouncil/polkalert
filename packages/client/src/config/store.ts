import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'

import { reduxLogger } from 'middleware'
import rootReducer from 'reducers'

export default () =>
  createStore(rootReducer, composeWithDevTools(applyMiddleware(reduxLogger)))
