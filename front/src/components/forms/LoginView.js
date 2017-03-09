import React, { Component } from 'react'
import { Row, Col, Form, Button, Icon, Input, Checkbox } from 'antd'
import { setCookie, getCookie } from '../util/cookie'
import { logIn, changeView } from '../state/actions'
import CreateAccountView from './CreateAccountView'
import MainView from './MainView'
import './LoginView.css'

const FormItem = Form.Item

class LoginForm extends Component {

  handleSubmit(e) {
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
      } else return

      fetch('/api/v1/user/authenticate', {
        method: 'post',
        body: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(json => {

          if (json.jwt) {
            setCookie('jwt', json.jwt, 9999)

            this.context.store.dispatch(logIn())
            this.context.store.dispatch(changeView(MainView))
          }
        })

    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const store = this.context.store

    return (
      <div className="LoginFormWrapper">
        <Form onSubmit={this.handleSubmit.bind(this)} className="LoginForm">
          <FormItem>
            {getFieldDecorator('username', {
              rules: [{ required: true, message: 'Please input your username.' }],
            })(
              <Input addonBefore={<Icon type="user" />} placeholder="Username" />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Please input your password.' }],
            })(
              <Input addonBefore={<Icon type="lock" />} type="password" placeholder="Password" />
            )}
          </FormItem>
          <FormItem>
            <a className="LoginFormForgot">Forgot password</a>
            <Button type="primary" htmlType="submit" className="SubmitButton">
              Log in
            </Button>
            Or <a onClick={ () => store.dispatch(changeView(CreateAccountView)) }>register now!</a>
          </FormItem>
        </Form>
      </div>
    )
  }
}

LoginForm.contextTypes = { store: React.PropTypes.object }

export default Form.create()(LoginForm)
