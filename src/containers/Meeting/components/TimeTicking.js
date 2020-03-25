import React, { Component } from "react";

import moment from "moment";
import formatSeconds from "../../../Helpers/formatSeconds";

class TimeTicking extends Component {
  state = {
    currentCount: "00:00",
    intervalId: null
  };

  componentDidUpdate(prevProps) {
  }

  componentDidMount() {
    this.timer();
    const intervalId = setInterval(this.timer, 1000);
    // store intervalId in the state so it can be accessed later:
    this.setState({ intervalId: intervalId });
  }

  componentWillUnmount() {
    if (this.props.tickingType === "meeting") {
      this.props.destroyLastOpendMeeting();
    }
    // use intervalId from the state to clear the interval
    clearInterval(this.state.intervalId);
  }

  timer = () => {
    // setState method is used to update the state
    let time = formatSeconds(
      moment
        .duration(moment(new Date()).diff(this.props.realStart))
        .asMilliseconds() / 1000
    );
    this.setState({
      currentCount: time
    });
  };

  render() {
    // You do not need to decrease the value here
    return <span>{"Trajanje sastanka: " + this.state.currentCount}</span>;
  }
}

export default TimeTicking;
