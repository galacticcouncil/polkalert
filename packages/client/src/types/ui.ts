import { SnackbarThemes } from 'ui'

export type SelectionGroupOption =
  | string
  | number
  | {
      label: string
      [key: string]: string | number
    }

export type SnackbarType = React.ReactNode &
  React.RefObject<HTMLElement> & {
    open: () => void
  }

export type SnackbarThemeType = typeof SnackbarThemes[number]

export interface SnackbarThemeInterface {
  text?: string
  theme: SnackbarThemeType
}
