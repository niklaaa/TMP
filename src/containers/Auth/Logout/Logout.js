import React from "react";

import { Redirect } from "react-router-dom";

import { connect } from "react-redux";

const logout = props => {
  props.onLogout();
  return <Redirect to="/" />;
};

const mapDispatchToProps = dispatch => ({
  onLogout: () => dispatch({ type: "LOGOUT" })
});

export default connect(null, mapDispatchToProps)(logout);
