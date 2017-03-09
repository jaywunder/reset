import React, { Component } from 'react'
import { Row, Col, Form, Button, Icon, Input, Checkbox } from 'antd'
import { setCookie, getCookie } from '../util/cookie'
import { logIn, changeView } from '../state/actions'
import MainView from './MainView'
import LoginForm from '../components/forms/LoginForm'
import CreateAccountForm from '../components/forms/CreateAccountForm'
import './HomeView.css'

export default class HomeView extends Component {

  render() {
    return <div className="HomeViewWrapper">

      <div className="Jumbotron">
        <h1>ReSET</h1>
        <h2>slogan</h2>
      </div>

      <article className="IntroductionWrapper">
        <p className="Introduction">
          slogan pt 2
        </p>
      </article>

      <div className="LoginWrapper">
        <div>
          <h1>Log In</h1>
          <LoginForm />
        </div>
        <div>
          <h1>Create Account</h1>
          <CreateAccountForm />
        </div>
      </div>
    </div>
  }
}

HomeView.contextTypes = { store: React.PropTypes.object }
