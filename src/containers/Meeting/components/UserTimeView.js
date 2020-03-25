import React, { Component } from "react";

import { Steps, Icon } from "antd";

import moment from "moment";

import TimeTicking from "./TimeTicking";

import formatSeconds from "../../../Helpers/formatSeconds";

const { Step } = Steps;

const realStart = moment(
  "Tue Mar 03 2020 12:13:26 GMT+0100 (Central European Standard Time)"
);
class MeetingTimeView extends Component {
  //realStart.add(2, "hours");
  state = {};

  render() {
    const { meeting } = this.props;

    let start = meeting.status < 2 ? meeting.planned_start : meeting.real_start;
    if (this.props.user.start) {
      start = this.props.user.start; // if user have difirent start meeting time from meeting
    }

    start = moment(start);
    let end = meeting.users.find(item => item.invited_user_id === this.props.user.invited_user_id).leave || meeting.real_end;

    return (
      <React.Fragment>
        {!meeting ? (
          <div>
            <div>Zakazan</div>
            <div>U pripremi</div>
          </div>
        ) : (
          <Steps direction={this.props.type} size="small">
            <Step
              status={meeting.status === 3 ? "finish" : "process"}
              icon={<Icon type="caret-right" />}
              title={moment(start).format("DD.MM.YYYY")}
              description={moment(start).format("HH:mm")}
            />
            {meeting.status === 2 ? (
              <Step
                status="process"
                icon={<Icon type="loading" />}
                title="U tijeku"
                description={<TimeTicking realStart={start} />}
              />
            ) : null}
            {meeting.status === 3 ? (
              <Step
                status="finish"
                icon={<Icon type="clock-circle" />}
                title="Trajanje Sastanka"
                description={
                  "Trajanje sastanka: " +
                  formatSeconds(
                    moment.duration(moment(end).diff(start)).asMilliseconds() /
                      1000
                  )
                }
              />
            ) : null}
            {meeting.status === 3 ? (
              <Step
                status="finish"
                icon={<Icon type="stop" />}
                title={moment(end).format("DD.MM.YYYY")}
                description={moment(end).format("HH:mm")}
              />
            ) : null}
          </Steps>
        )}
      </React.Fragment>
    );
  }
}

export default MeetingTimeView;
