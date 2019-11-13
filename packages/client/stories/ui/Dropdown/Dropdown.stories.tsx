import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'

import { Dropdown } from 'ui'

storiesOf('UI|Dropdown', module).add('default', () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{ color: 'white', fontSize: '24px' }}
      >
        Toggle Dropdown
      </button>
      <Dropdown isOpen={isOpen}>
        <img src="https://images.dog.ceo/breeds/ridgeback-rhodesian/n02087394_8266.jpg" />
      </Dropdown>
    </div>
  )
})
