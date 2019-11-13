import { SET_API } from 'constants/api'

type setApiActionType = {
  loaded?: boolean
  demo?: true
}

export const setApiAction = (payload: setApiActionType) => ({
  type: SET_API,
  payload
})
