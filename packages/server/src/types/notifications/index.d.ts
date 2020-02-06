declare module 'node-webhooks'

declare type Category =
  | 'offline'
  | 'slash'
  | 'nominated'
  | 'bonded'
  | 'bondedExtra'
  | 'unbonded'
  | 'denominated'
  | 'equivocating'
  | 'connection'
