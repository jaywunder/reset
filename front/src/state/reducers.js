import * as types from './action-types'
import HomeView from '../views/HomeView'
import fetchAuth from '../util/fetch-auth'
import { setCookie, getCookie, deleteCookie } from '../util/cookie'

export function loggedIn(state = false, action) {
  switch (action.type) {
    case types.LOG_IN:
      return true
      break;
    case types.LOG_OUT:
      return false
      break;
  }
  return state
}

export function currentView(state = HomeView, action) {
  switch(action.type) {
    case types.CHANGE_VIEW:
      return action.view
      break;

  }
  return state
}

export function userData(state = null, action) {
  switch (action.type) {
    case types.FETCH_USER_DATA_REQUEST:
      // when we request new user data, we want to
      // throw out the old user data
      return null
      break;

    case types.FETCH_USER_DATA_SUCCESS:
      return action.data
      break;

    case types.FETCH_USER_DATA_FAILURE:
      // if the request errors, then we'll also throw out
      // the data because we want to make sure we have updated user data
      throw action.error
      return null
      break;

  }

  return state
}
