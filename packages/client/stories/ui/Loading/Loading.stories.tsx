import React from 'react'
import { Provider } from 'react-redux'
import { storiesOf } from '@storybook/react'

import configureStore from 'config/store'

import { Loading } from 'ui'

const store = configureStore()

storiesOf('UI|Loading', module)
  .addDecorator(story => <Provider store={store}>{story()}</Provider>)
  .add('default', () => <Loading />)
