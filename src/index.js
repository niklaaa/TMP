import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store, { rrfProps } from "./store";

import { BrowserRouter as Router } from "react-router-dom";
import history from "./history";

import "./index.css";
import AppWrapper from "./AppWrapper";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <AppWrapper />
    </Router>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
