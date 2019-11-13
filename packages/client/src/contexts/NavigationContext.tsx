import React from 'react'
import { withRouter } from 'react-router'
import { createContext } from 'react'

export type NavigationType = {
  navigateTo: (path: string) => void
}

const NavigationContext = createContext<NavigationType>(
  (null as unknown) as NavigationType
)

type Props = {
  history: { push: Function }
  children: React.ReactNode
}

export const NavigationProvider = withRouter(({ history, children }: Props) => {
  const navigation = {
    navigateTo: path => history.push(path)
  }

  return (
    <NavigationContext.Provider value={navigation}>
      {children}
    </NavigationContext.Provider>
  )
})

export default NavigationContext
