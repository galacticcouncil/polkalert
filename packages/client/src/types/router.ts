export interface MatchInterface {
  isExact: boolean
  params: { [key: string]: any }
  path: string
  url: string
}
