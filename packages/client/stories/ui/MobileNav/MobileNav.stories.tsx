import React from 'react'
import { storiesOf } from '@storybook/react'
import { boolean } from '@storybook/addon-knobs'
import { MemoryRouter } from 'react-router'

import { MobileNav } from 'ui'

const links = [
  {
    name: 'Explore API',
    icon: '/icons/search.svg',
    href: '/explore-api'
  },
  {
    name: 'Staking',
    icon: '/icons/safe.svg',
    href: '/staking'
  },
  {
    name: 'Parachains',
    icon: 'icons/chain.svg',
    href: '/parachains'
  }
]

storiesOf('UI|MobileNav', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('default', () => {
    const activeKnob = boolean('Active', false, 'props')

    return <MobileNav active={activeKnob} links={links} forceShowSidebar />
  })
