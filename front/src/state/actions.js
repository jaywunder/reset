import * as types from './action-types'

export function logIn() {
  return { type: types.LOG_IN }
}

export function logOut() {
  return { type: types.LOG_OUT }
}

export function changeView(view) {
  return {
    type: types.CHANGE_VIEW,
    view
  }
}

export function fetchUserRequest() {
  return {
    type: types.FETCH_USER_DATA_REQUEST,
  }
}

export function fetchUserSuccess(data) {
  return {
    type: types.FETCH_USER_DATA_SUCCESS,
    data
  }
}

export function fetchUserFailure(error) {
  return {
    type: types.FETCH_USER_DATA_FAILURE,
    error
  }
}
