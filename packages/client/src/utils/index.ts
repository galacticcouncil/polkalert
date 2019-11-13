export const NOOP = () => {}

export const formatAddress = (address: string): string =>
  `${address.substr(0, 6)}...${address.substr(address.length - 6, 6)}`

export const encodeURI = data =>
  Object.keys(data)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&')
