import React, { Component } from 'react'
import io from 'socket.io-client'

import {
  fetchUserRequest,
  fetchUserSuccess,
  fetchUserFailure,
  fetchNotificationsRequest,
  fetchNotificationsSuccess,
  fetchNotificationsFailure,
  changeView,
  focusTeam,
  logIn,
  newNotification,
  updateNotification,
  deleteNotification
} from './state/actions'
import MainView from './views/MainView'
import fetchAuth from './util/fetch-auth'
import { getCookie, setCookie } from './util/cookie'
import isMobile from './util/is-mobile'
import logo from './logo.svg'
import './App.css'

function initializeSocket() {
  const token = getCookie('jwt')
  if (token) {

    return io('', { query: 'Authorization=' + token })

  } else return null
}

async function tryLoginWithJWT(store) {
  const response = await fetch('/api/v1/user/authenticate', {
    method: 'post',
    headers: {
      'Authorization': 'Bearer ' + getCookie('jwt')
    }
  })

  const json = await response.json()
  if (json.jwt) {
    setCookie('jwt', json.jwt, 99999)

    store.dispatch(logIn())
    store.dispatch(changeView(MainView))

  } else return
}


export default class App extends Component {

  getChildContext() {
    return {
      socket: this.state.socket
    }
  }

  componentWillMount() {

    tryLoginWithJWT(this.context.store)

    const store = this.context.store
    this.state = {
      currentView: store.getState().currentView,
      socket: null
    }
  }

  componentDidMount() {

    const store = this.context.store

    this.socketUnsubscribe = store.subscribe(() => {
      const state = store.getState()
      if (state.loggedIn && !this.state.socket) {
        const socket = initializeSocket()
        this.setState({ socket })

        // We pass socket to these methods because I wasnt to run them as soon
        // as possible, but the state hasn't updated yet to include the socket
        this.setSocketListeners(socket)
        socket.on('connect', () => this.initializeUserData(socket))
      }
    })

    this.currentViewUnsubscribe = store.subscribe(() => {
      const state = store.getState()
      if (state.currentView !== this.state.currentView) {
        this.setState({currentView: state.currentView})
      }
    })

    this.focusedTeamUnsubscribe = store.subscribe(() => {
      const state = store.getState()
      if (!state.userData) return
      if (!state.userData.teams) return
      if (!state.userData.teams.length) return
      if (!state.focusedTeam)
        store.dispatch(focusTeam(state.userData.teams[0]))
    })

    this.userDataUnsubscribe = store.subscribe(() => {
      const state = store.getState()
      if (!state.loggedIn) return
      if (!this.state.socket) return
      if (!state.userData) {
        this.state.socket.emit('user_data', userData => {
          store.dispatch(fetchUserSuccess(userData))
        })
      }
    })

    this.notificationsUnsubscribe = store.subscribe(() => {
      const state = store.getState()

      if (!state.focusedTeam) return
      if (!state.userData) return
      if (!this.state.socket) return
      if (!state.notifications) {
        this.state.socket.emit('notification_list', {
          type: 'all',
          team: state.focusedTeam.teamname
        }, json => {
          store.dispatch(fetchNotificationsSuccess(json))
        })
      }
    })

    store.dispatch(fetchUserRequest())
    store.dispatch(fetchNotificationsRequest())
  }

  componentWillUnmount() {
    this.currentViewUnsubscribe()
    this.socketUnsubscribe()
    this.focusedTeamUnsubscribe()
  }

  render() {

    const CurrentView = this.state.currentView

    return (
      <div className="App">

        <CurrentView/>

      </div>
    )
  }

  // this method is called **after** the socket connects
  initializeUserData(socket) {
    socket = socket || this.state.socket
    const store = this.context.store

    socket.emit('user_data', json => {
      store.dispatch(fetchUserSuccess(json))
    })
  }

  // this method is called **before** the socket connects
  setSocketListeners(socket) {
    socket = socket || this.state.socket
    const { store } = this.context

    socket.on('connect', () => console.log('socket', 'connected'))
    socket.on('connect', () => socket.emit('subscribe'))
    socket.on('disconnect', () => console.log('socket', 'disconnected'))

    socket.on('HEYY', () => console.log('HEYY received'))

    socket.on('notification_create', notification => { console.log('notification_create', notification) })
    socket.on('notification_update', notification => { console.log('notification_update', notification) })
    socket.on('notification_delete', notification => { console.log('notification_delete', notification) })

    socket.on('notification_create', notification => {
      store.dispatch(newNotification(notification))
    })

    socket.on('notification_update', notification => {
      store.dispatch(updateNotification(notification))
    })

    socket.on('notification_delete', notification => {
      store.dispatch(deleteNotification(notification))
    })
  }
}

App.childContextTypes = {
  socket: React.PropTypes.object,
}

App.contextTypes = {
  store: React.PropTypes.object
}
