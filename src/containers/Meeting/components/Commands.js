import React, { Component } from "react";

import { Row, Col, Button, Alert, Modal } from "antd";

import css from "../Meeting.module.scss";

import Loading from "../../../components/HorizontalLoading";
import StopMeetingPause from "./StopMeetingPause";

class Commands extends Component {
  state = {
    stopMeetingPauseVisible: false,
    invited_users: [], // users whicha re on pause after start meeting after pause,
  };

  start = () => {
    if (this.props.meeting.is_pause === 1) {
      const invited_users = this.props.meeting.users.filter(
        item => item.is_pause === 1
      );
      if (invited_users.length) {
        this.setState({
          //if on start after pause exsits users which are on pause there will be showed pop up model for pause
          invited_users: invited_users,
          stopMeetingPauseVisible: true
        });
      } else {
        this.props.startMeetingAfterPause(invited_users);
      }
    } else {
      this.props.startMeeting([]);
    }
  };

  

  proccedStart = invited_users => {
    this.props.startMeetingAfterPause(invited_users, this.onCancel.bind(this));
  };

  pause = () => {
    this.props.pauseMeeting();
  };

  stop = () => {
    this.props.stopMeeting();
  };

  onCancel = () => {
    this.setState({ stopMeetingPauseVisible: false });
  };

  render() {
    const { meeting } = this.props;

    const alert =
      this.props.command.status === "FAIL" ? (
        <Alert
          style={{ marginBottom: "10px" }}
          message="Dogodila se greša"
          description="Dogodila se greška prilikom spremanja na server molimo vas probajte ponovo!"
          type="error"
        />
      ) : null;

    return (
      <React.Fragment>
        {" "}
        <StopMeetingPause
          stopMeetingPauseVisible={this.state.stopMeetingPauseVisible}
          invited_users={this.state.invited_users}
          onCancel={this.onCancel}
          proccedStart={this.proccedStart}
          loading={this.props.command.loading}
        />
        {window.innerWidth < 1365 ? (
          <div className={css.VerticalCommands}>
            <div>
              {" "}
              <Button
                disabled={
                  (meeting.status !== 1 && meeting.is_pause === 0) ||
                  this.props.command.loading
                }
                icon={"caret-right"}
                type={"primary"}
                onClick={user => this.start()}
              >
                {this.props.meeting.status < 2 ? "Početak" : "Nastavi"}
              </Button>
            </div>
            <div>
              <Button
                disabled={
                  !(meeting.status === 2 && meeting.is_pause === 0) ||
                  this.props.command.loading
                }
                icon={"pause"}
                type={"primary"}
                onClick={user => this.pause()}
              >
                Pauza
              </Button>
            </div>
            <div>
              <Button
                disabled={
                  meeting.status !== 2 ||
                  this.props.command.loading ||
                  meeting.is_pause === 1
                }
                icon={"stop"}
                type={"primary"}
                onClick={user => this.stop()}
              >
                Gotovo
              </Button>
            </div>
          </div>
        ) : (
          <div className={css.Commands}>
            {alert}
            <Row gutter={[8, 8]}>
              <Col span={8}>
                <Button
                  disabled={
                    (meeting.status !== 1 && meeting.is_pause === 0) ||
                    this.props.command.loading
                  }
                  icon={"caret-right"}
                  type={"primary"}
                  onClick={user => this.start()}
                >
                  {this.props.meeting.status < 2 ? "Početak" : "Nastavi"}
                </Button>
              </Col>
              <Col span={8}>
                <Button
                  disabled={
                    !(meeting.status === 2 && meeting.is_pause === 0) ||
                    this.props.command.loading
                  }
                  icon={"pause"}
                  type={"primary"}
                  onClick={user => this.pause()}
                >
                  Pauza
                </Button>
              </Col>
              <Col span={8}>
                <Button
                  disabled={
                    meeting.status !== 2 ||
                    this.props.command.loading ||
                    meeting.is_pause === 1
                  }
                  icon={"stop"}
                  type={"primary"}
                  onClick={user => this.stop()}
                >
                  Gotovo
                </Button>
              </Col>
            </Row>
            <div>{this.props.command.loading ? <Loading /> : null}</div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default Commands;
