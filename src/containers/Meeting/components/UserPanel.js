import React, { Component } from "react";

import UserTimeView from "./UserTimeView";
import UserCommands from "./UserCommands";

class UserPanel extends Component {
  state = {};

  transferUser = user => {
    this.props.transferUser(user);
  };



  componentDidUpdate(prevProps) {
    if (prevProps.transfer !== this.props.transfer) {
      if (this.props.transfer.status && this.props.transfer.status === "OK") {
        this.props.close();
      }
    }
  }

  render() {

    return (
      <React.Fragment>
        {this.props.meeting.status !== 3 ? <div>
          <UserCommands
            userCommand={this.props.userCommand}
            transfer={this.props.transfer}
            transferUser={this.transferUser}
            user={this.props.user}
            meeting={this.props.meeting}
            away={this.props.userAway}
            start={this.props.userStart}
            pause={this.props.userPause}
            swap={this.props.swap}
            stopUserPause={this.props.stopUserPause}
            leave={this.props.leave}
          />
        </div> : null}
        <div style={{ height: "40px" }}></div>
        <div>
          <UserTimeView user={this.props.user} type="horizontal" meeting={this.props.meeting} />
        </div>
      </React.Fragment>
    );
  }
}

export default UserPanel;
