import React, { Component } from "react";
import { Route, Link, Switch, Redirect } from "react-router-dom";
import "./App.scss";

import { compose } from "redux";
import { connect } from "react-redux";

import { firestoreConnect } from "react-redux-firebase";

import Login from "./containers/Auth";
import Dashboard from "./containers/Dashboard";
import Accounting from "./containers/Accounting";
import Meetings from "./containers/Meetings";
import Logout from "./containers/Auth/Logout/Logout";
import Spinner from "./components/LoadingScreen/index";
import Meeting from "./containers/Meeting";

import * as actions from "./redux/modules/Users/actions";

// import { UserIsAuthenticated, UserIsNotAuthenticated } from "./routes";
import PrivateRoute from "./containers/Accounting/ProtectedRoute";

import { isEmpty } from "react-redux-firebase";

// AntDesign Components
import { Layout, Menu, Icon, Avatar, Button } from "antd";
const { Header, Content, Sider } = Layout;

var render = [0, 0];

class AppWrapper extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const token = localStorage.getItem("token") || "";
    this.props.onSetTokenFromLocaleStorage(token);
    this.props.onGetUser();
    console.log(++render[0], "constructor");
  }

  render() {
    let startRoute = this.props.auth ? (
      <React.Fragment>
        <Route exact path="/" component={Dashboard} />
      </React.Fragment>
    ) : (
      <Route path="/" component={Login} />
    );
    return this.props.loading ? (
      <Spinner />
    ) : (
      <Layout style={{ minHeight: "100vh" }}>
        {!isEmpty(this.props.auth) ? (
          <Header>
            <p style={{ color: "#fff" }}>
              <Avatar icon="user" size="small" /> {this.props.user.first_name}{" "}
              {this.props.user.last_name}
              <Link to="/logout"> Logout</Link>
            </p>
          </Header>
        ) : null}
        <Layout>
          {!isEmpty(this.props.auth) ? (
            <Sider width={260} style={{ background: "#fff" }}>
              <Menu
                mode="inline"
                defaultSelectedKeys={[window.location.pathname]}
                style={{ height: "100%", borderRight: 0 }}
              >
                <Menu.Item key="/app">
                  <Link to="/app">
                    <Icon theme="twoTone" type="dashboard" />
                    Dashboard
                  </Link>
                </Menu.Item>
                <Menu.Item key="/accounting">
                  <Link to="/accounting">
                    <Icon theme="twoTone" type="bank" />
                    Accounting
                  </Link>
                </Menu.Item>
                <Menu.Item key="/meetings">
                  <Link to="/meetings">
                    <Icon theme="twoTone" type="schedule" />
                    Sastanci
                  </Link>
                </Menu.Item>
              </Menu>
            </Sider>
          ) : null}
          <Content
            style={
              !isEmpty(this.props.auth)
                ? {
                    background: "#fff",
                    padding: 24,
                    margin: 24,
                    minHeight: 280
                  }
                : {}
            }
          >
            <Switch>
              <Route path="/logout" component={Logout} />
              <PrivateRoute exact path="/app" component={Dashboard} />
              <PrivateRoute exact path="/accounting" component={Accounting} />
              <PrivateRoute exact path="/meetings" component={Meetings} />
              <PrivateRoute exact path="/meetings/:id" component={Meeting} />

              {startRoute}
            </Switch>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSetTokenFromLocaleStorage: token =>
      dispatch({ type: actions.SET_TOKEN_FROM_LOCALE_STORAGE, token }),
    onGetUser: () => dispatch({ type: actions.USER })
  };
};

const mapStateToProps = state => {
  return {
    auth: state.usersReducer.user.token || false,
    user: state.usersReducer.user.data,
    loading: state.usersReducer.user.loading
  };
};

// export default compose(
//   firestoreConnect(),
//   connect((state, props) => ({
//     // user: state.firebase.profile,
//     user: state.authReducer.user,
//     loading: state.authReducer.loading,
//     // auth: state.firebase.auth,
//     logout: props.firebase.logout,
//     auth: state.authReducer.token || false,
//     redirect: state.authReducer.redirect
//   }), mapDispatchToProps)
// )(AppWrapper);

export default connect(mapStateToProps, mapDispatchToProps)(AppWrapper);
