import React, { Component } from "react";

import { Row, Col, Button, Alert } from "antd";
import {
  disableTransfer,
  removeAway,
  disableStart
} from "../../../Helpers/meetingComandChecks";

import Loading from "../../../components/HorizontalLoading";

import css from "../Meeting.module.scss";

class UserCommands extends Component {
  state = {};

  transfer = _user => {
    let type = 0;
    if (_user.exhibitor === 0) {
      type = 1;
    }
    let user = {
      invited_user_id: _user.invited_user_id,
      type: type
    };
    this.props.transferUser(user);
  };

  away = _user => {
    this.props.away(_user.invited_user_id);
  };

  start = _user => {
    if (_user.is_pause === 1) {
      this.props.stopUserPause(_user.invited_user_id);
      return;
    }
    this.props.start(_user.invited_user_id);
  };

  pause = _user => {
    this.props.pause(_user.invited_user_id);
  };

  swap = () => {
    this.props.swap();
  };

  leave = _user => {
    this.props.leave(_user.invited_user_id);
  };

  render() {
    const { meeting } = this.props;
    const { user } = this.props;

    const alert =
      this.props.userCommand.status === "FAIL" ? (
        <Alert
          style={{marginBottom: "10px"}}
          message="Dogodila se greša"
          description="Dogodila se greška prilikom spremanja na server molimo vas probajte ponovo!"
          type="error"
        />
      ) : null;

        console.log(user);

    return (
      <div className={css.Commands}>
        {alert}
        <Row gutter={[8, 8]}>
          <Col span={4}>
            <Button
              disabled={disableStart(
                meeting,
                user.user.id,
                this.props.userCommand.loading
              )}
              icon={"caret-right"}
              type={"primary"}
              onClick={() => this.start(user)}
            >
              Nastavi
            </Button>
          </Col>
          <Col span={4}>
            <Button
              disabled={
                user.is_pause === 1 ||
                this.props.userCommand.loading ||
                meeting.status !== 2 ||
                meeting.is_pause === 1 ||
                user.is_pause === 2
              }
              icon={"pause"}
              type={"primary"}
              onClick={() => this.pause(this.props.user)}
            >
              Pause
            </Button>
          </Col>
          {removeAway(meeting.real_start) || meeting.status !== 2 ? null : (
            <Col span={4}>
              <Button
                disabled={
                  this.props.userCommand.loading ||
                  user.is_pause === 2 ||
                  meeting.is_pause === 1 ||
                  user.start !== meeting.real_start
                }
                icon={"minus-circle"}
                type={"primary"}
                onClick={() => this.away(user)}
              >
                Odsutan
              </Button>
            </Col>
          )}

          <Col span={4}>
            <Button
              disabled={
                meeting.status !== 2 ||
                this.props.userCommand.loading ||
                meeting.is_pause === 1 ||
                user.is_pause === 2 ||
                meeting.users.length < 3
              }
              icon={"close"}
              type={"primary"}
              onClick={() => this.leave(user)}
            >
              Napustio
            </Button>
          </Col>
          {meeting.users.length > 2 ? (
            <Col span={4}>
              <Button
                disabled={
                  disableTransfer(meeting.users, user.user.id) ||
                  this.props.userCommand.loading ||
                  meeting.is_pause === 1 ||
                  user.is_pause === 2 ||
                  user.is_pause === 1

                }
                icon={"swap"}
                type={"primary"}
                onClick={() => this.transfer(this.props.user)}
              >
                Transfer
              </Button>
            </Col>
          ) : (
            <Col span={4}>
              <Button
                disabled={meeting.is_pause === 1 }
                icon={"swap"}
                loading={this.props.userCommand.loading}
                type={"primary"}
                onClick={() => this.swap()}
              >
                Zamjena
              </Button>
            </Col>
          )}
        </Row>
        <div>{this.props.userCommand.loading ? <Loading /> : null}</div>
      </div>
    );
  }
}

export default UserCommands;
