import React from 'react'
import { Provider } from 'react-redux'
import { storiesOf } from '@storybook/react'
import { MemoryRouter } from 'react-router'

import configureStore from 'config/store'

import { DefaultLayout } from 'layouts'

const store = configureStore()

storiesOf('LAYOUTS|DefaultLayout', module)
  .addDecorator(story => (
    <Provider store={store}>
      <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
    </Provider>
  ))
  .add('default', () => (
    <DefaultLayout forceShowSidebar>
      <div style={{ padding: 56, color: 'white' }}>
        The page content goes here
      </div>
    </DefaultLayout>
  ))
