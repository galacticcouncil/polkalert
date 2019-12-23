import React from 'react'
import { storiesOf } from '@storybook/react'

import { Table } from 'ui'

storiesOf('UI|Table', module).add('default', () => (
  <div style={{ padding: '24px' }}>
    <Table
      headers={[
        {
          text: 'Column 1',
          key: 'column1'
        },
        {
          text: 'Column 2',
          key: 'column2'
        },
        {
          text: 'Column 3',
          key: 'column3'
        },
        {
          text: 'Column 4',
          key: 'column4'
        },
        {
          text: 'Column 5',
          key: 'column5'
        }
      ]}
      data={[
        {
          column1: 'Row 1 Col 1',
          column2: 'Row 1 Col 2',
          column3: 'Row 1 Col 3',
          column4: 'Row 1 Col 4',
          column5: 'Row 1 Col 5'
        },
        {
          column1: 'Row 2 Col 1',
          column2: 'Row 2 Col 2',
          column3: 'Row 2 Col 3',
          column4: 'Row 2 Col 4',
          column5: 'Row 2 Col 5'
        },
        {
          column1: 'Row 3 Col 1',
          column2: 'Row 3 Col 2',
          column3: 'Row 3 Col 3',
          column4: 'Row 3 Col 4',
          column5: 'Row 3 Col 5'
        },
        {
          column1: 'Row 4 Col 1',
          column2: 'Row 4 Col 2',
          column3: 'Row 4 Col 3',
          column4: 'Row 4 Col 4',
          column5: 'Row 4 Col 5'
        },
        {
          column1: 'Row 5 Col 1',
          column2: 'Row 5 Col 2',
          column3: 'Row 5 Col 3',
          column4: 'Row 5 Col 4',
          column5: 'Row 5 Col 5'
        }
      ]}
    />
  </div>
))
