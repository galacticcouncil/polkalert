export type UiOptionType =
  | string
  | number
  | {
      label: string
      [key: string]: string | number
    }

export type SnackbarType = React.ReactNode & React.RefObject<HTMLElement> & {
  open: () => void
}