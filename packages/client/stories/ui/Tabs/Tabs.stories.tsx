import React from 'react'
import { Provider } from 'react-redux'
import { storiesOf } from '@storybook/react'
import { MemoryRouter } from 'react-router'

import configureStore from 'config/store'

import { Tabs } from 'ui'

const store = configureStore()

const tabs = [
  {
    text: 'tab1',
    href: '/'
  },
  {
    text: 'tab2',
    href: '/foo'
  },
  {
    text: 'tab3',
    href: '/bar'
  }
]

storiesOf('UI|Tabs', module)
  .addDecorator(story => (
    <Provider store={store}>
      <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
    </Provider>
  ))
  .add('default', () => (
    <div style={{ padding: '24px', display: 'flex', justifyContent: 'center' }}>
      <Tabs tabs={tabs} />
    </div>
  ))
