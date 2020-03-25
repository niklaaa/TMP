import React, { Component } from "react";

import { Steps, Icon } from "antd";

import moment from "moment";

import TimeTicking from "./TimeTicking";

import formatSeconds from "../../../Helpers/formatSeconds";

const { Step } = Steps;

class MeetingTimeView extends Component {
  state = {};

  destroyLastOpendMeeting = () => {
    if (this.props.meeting.status === 2) {
      this.props.destroyLastOpendMeeting();
    }
  };

  render() {
    const { meeting } = this.props;

    let start = meeting.status < 2 ? meeting.planned_start : meeting.real_start;
    start = moment(start);
    let end = meeting.real_end;

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
                description={
                  <TimeTicking
                    tickingType={"meeting"}
                    meetingStatus={meeting.status}
                    destroyLastOpendMeeting={this.destroyLastOpendMeeting}
                    realStart={start}
                  />
                }
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
