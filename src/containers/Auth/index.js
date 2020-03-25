import React, { Component } from "react";
import { Form, Icon, Input, Button, Alert } from "antd";

import * as actions from "../../redux/modules/Users/actions";
import { connect } from "react-redux";

// import { compose } from "redux";
// import { withFirebase } from "react-redux-firebase";

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class Login extends Component {
  componentDidMount() {
    this.props.form.validateFields();
  }

  handleSubmit = e => {
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onLogin(values.email, values.password);
      }
    });
  };

  render() {
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    // Only show error after a field is touched.
    const emailError = isFieldTouched("username") && getFieldError("username");
    const passwordError =
      isFieldTouched("password") && getFieldError("password");

    return (
    
      <div id="login-container">    
        <Form
          layout="vertical"
          onSubmit={this.handleSubmit}
          id="login-form"
          style={{ padding: 12 }}
        >
          <h3>Login</h3>
          <Form.Item
            validateStatus={emailError ? "error" : ""}
            help={emailError || ""}
            style={{ marginBottom: 12 }}
          >
            {getFieldDecorator("email", {
              rules: [
                { required: true, message: "Please input your username!" }
              ]
            })(
              <Input
                prefix={
                  <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                type="email"
                placeholder="E-Mail..."
                autoComplete="new-email"
              />
            )}
          </Form.Item>
          <Form.Item
            validateStatus={passwordError ? "error" : ""}
            help={passwordError || ""}
            style={{ marginBottom: 12 }}
          >
            {getFieldDecorator("password", {
              rules: [
                { required: true, message: "Please input your Password!" }
              ]
            })(
              <Input
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                type="password"
                placeholder="Password"
                autoComplete="new-password"
              />
            )}
          </Form.Item>
          <Form.Item style={{ marginBottom: 12 }}>
            <Button
              block
              type="primary"
              htmlType="submit"
              disabled={hasErrors(getFieldsError())}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
        {this.props.status === 400 ? (
          <Alert
            style={{ maxWidth: "240px", "margin": "0 auto" }}
            message="Netocni podaci"
            description="Vas E-mail ili lozinka ne odgovaraju."
            type="warning"
            showIcon
          />
        ) : null}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onLogin: (username, password) =>
      dispatch({ type: actions.LOGIN, credentials: { username, password } })
  };
};

const mapStateToProps = state => {
  return {
    status: state.usersReducer.user.status
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form.create({ name: "login" })(Login));
