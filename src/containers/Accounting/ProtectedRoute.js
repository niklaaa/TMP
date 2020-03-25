import React, { Component } from "react";

import { Route, Redirect } from "react-router-dom";

import {connect} from "react-redux";

const _protectedRoute = ({ component: Component, ...rest }) => {
 
  return (
    <Route
      {...rest}
      render={props => {
        let render = <Component {...props} />;
        if (!rest.auth){
          console.log(!rest.auth, "Protected Route");
          render = (
            <Redirect
              to={{
                pathname: "/logout",
                state: { from: props.location }
              }}
            />
          );}
        return render;
      }}
    />
  );
};

const protectedRoute = connect(state=>({auth:state.usersReducer.user.token || false}))(_protectedRoute);

export default protectedRoute;
