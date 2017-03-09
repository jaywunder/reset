import React, { Component } from 'react'
import { Button, Tabs, Row, Col } from 'antd'
const TabPane = Tabs.TabPane;

import TopNav from '../components/TopNav'
import SideNav from '../components/SideNav'
import AttendanceControl from '../components/AttendanceControl'
import NotificationList from '../components/NotificationList'
import JoinFirstTeam from '../components/JoinFirstTeam'
import AttendanceManager from '../components/AttendanceManager'
import TimeViewer from '../components/TimeViewer'

import {
  fetchUserRequest,
  fetchUserSuccess,
  fetchUserFailure,
  changeView,
  focusTeam
} from '../state/actions'
import isMobile from '../util/is-mobile'
import './MainView.css'

export default class MainView extends Component {
  componentWillMount() {
    this.state = {
      userData: null,
      focusedTeam: null
    }
  }

  componentDidMount() {
    const store = this.context.store

    this.storeUnsubscribe = store.subscribe(() => {
      const state = store.getState()

      if (state.userData && state.userData !== this.state.userData) {
        this.setState({ userData: state.userData })
      }

      if (state.focusedTeam && state.focusedTeam !== this.state.focusedTeam) {
        this.setState({ focusedTeam: state.focusedTeam })
      }
    })
  }

  componentWillUnmount() {
    this.storeUnsubscribe()
  }

  render() {
    const store = this.context.store
    const state = store.getState()

    if (!this.state.userData) return null
    if (this.state.userData.teams.length < 1) return <JoinFirstTeam />

    return (
      <div className="MainViewWrapper">
        <Row>

          <SideNav/>

          <Col span={isMobile? 20 : 22}>
            <Row>
              <TopNav />
            </Row>
            <Row>
              <Tabs>

                {/* if the user can view time data show the tab */}
                {/* { state.focusedTeam.permissions['user:time_data']
                  && <TabPane tab="Time Data" key="0">

                    <TimeViewer/>

                </TabPane> } */}

                <TabPane key="1" tab="Sign In & Notifications">
                  <Row>
                    <AttendanceControl />
                  </Row>

                  <div className="NotificationListWrapper">
                    <NotificationList/>
                  </div>
                </TabPane>

                {/* If the user has permission to signin or signout
                  * other users, then show them the tab
                  */}
                {(  state.focusedTeam.permissions['user:signin'] ||
                    state.focusedTeam.permissions['user:signout'] )
                &&  <TabPane tab="Manage Attendance" key="2">

                  <div className="AttendanceManagerWrapper">
                    <AttendanceManager />
                  </div>

                </TabPane> }

                {/* if the user can view time data show the tab */}
                { state.focusedTeam.permissions['user:time_data']
                  && <TabPane tab="Time Data" key="3">

                    <TimeViewer/>

                </TabPane> }

                {/* if the user can modify permissions show the tab */}
                { state.focusedTeam.permissions['permissions:modify']
                  && <TabPane tab="Manage Permissions" key="4">


                </TabPane> }
              </Tabs>
            </Row>
          </Col>
        </Row>
      </div>
    )
  }
}

MainView.contextTypes = { store: React.PropTypes.object }
