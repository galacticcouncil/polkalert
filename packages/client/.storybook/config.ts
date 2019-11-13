import { configure, addDecorator, addParameters } from '@storybook/react'
import { themes } from '@storybook/theming'
import '@storybook/addon-console'
import { withKnobs } from '@storybook/addon-knobs'
import { withA11y } from '@storybook/addon-a11y'
import { withPropsTable } from 'storybook-addon-react-docgen'

import 'styles/global.css'

// Import all files with the *.stories.tsx
// extension from the /stories folder
const req = require.context('../stories', true, /\.stories\.tsx$/)
const loadStories = () => {
  req.keys().forEach(filename => req(filename))
}

// Apply decorators
addDecorator(withKnobs)
addDecorator(withA11y)
addDecorator(withPropsTable)

// Add parameters
addParameters({
  options: {
    theme: themes.dark
  },
  backgrounds: [
    { name: 'White', value: '#FFFFFF' },
    { name: 'Black', value: '#000000' },
    { name: 'Primary', value: '#20E89B' },
    { name: 'Gray-100', value: '#B4AFD7' },
    { name: 'Gray-200', value: '#282446' },
    { name: 'Gray-300', value: '#201C3A' },
    { name: 'Gray-400', value: '#17142F', default: true },
    { name: 'Success', value: '#5ACA61' },
    { name: 'Warning', value: '#E29D16' },
    { name: 'Error', value: '#E01D28' },
    { name: 'Orange', value: '#FFAC81' },
    { name: 'Yellow', value: '#EFE9AE' },
    { name: 'Blue', value: '#59B5FF' }
  ]
})

// Configure
configure(loadStories, module)
