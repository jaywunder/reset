import React, { Component } from 'react'
import { Row, Col, Form, Button, Icon, Input, Checkbox } from 'antd'
import { setCookie, getCookie } from '../../util/cookie'
import { logIn, changeView } from '../../state/actions'
import JoinFirstTeam from '../../components/JoinFirstTeam'
import './CreateAccountForm.css'

const FormItem = Form.Item

class CreateAccountForm extends Component {
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values)
      } else return

      fetch('/api/v1/user/create', {
        method: 'post',
        body: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(json => {
          console.log(json);

          if (json.jwt) {
            setCookie('jwt', json.jwt, 99999)

            this.context.store.dispatch(logIn())
            this.context.store.dispatch(changeView(JoinFirstTeam))
          }
        })

    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const store = this.context.store

    return (
      <div className="CreateFormWrapper">
        <Form onSubmit={this.handleSubmit.bind(this)} className="CreateForm">
          <FormItem>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: 'Please input your full name.' }],
            })(
              <Input addonBefore={<Icon type="user" />} placeholder="Full Name" />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('username', {
              rules: [{ required: true, message: 'Please input your username!' }],
            })(
              <Input addonBefore={<Icon type="user" />} placeholder="Username" />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Please input your Password!' }],
            })(
              <Input addonBefore={<Icon type="lock" />} type="password" placeholder="Password" />
            )}
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit" className="SubmitButton">
              Create Account
            </Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}

CreateAccountForm.contextTypes = { store: React.PropTypes.object }

export default Form.create()(CreateAccountForm)
