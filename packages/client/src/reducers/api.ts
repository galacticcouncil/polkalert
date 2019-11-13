import { ApiStateInterface } from 'types'
import { SET_API } from 'constants/api'

const initialState: ApiStateInterface = {
  loaded: false,
  demo: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_API:
      return {
        loaded: action.payload.loaded,
        demo: action.payload.demo
      }

    default:
      return state
  }
}
