import gql from 'graphql-tag'

import settingsFragment from 'apollo/fragments/settings'

export default gql`
  query Settings {
    settings {
      ...SettingsFragment
    }
  }
  ${settingsFragment}
`
