import React from "react";
import moment from "moment";

import { Typography, List, Icon, PageHeader } from "antd";
import MeetingStatus from "./MeetingStatus";

import { Link } from "react-router-dom";

const { Text } = Typography;

const meetingsList = props => {
  return (
    <React.Fragment>
      <PageHeader title={props.title} />
      <List
        size="large"
        bordered
        dataSource={props.meetings || []}
        renderItem={item => (
          <List.Item key={item.id} style={{position: "relative"}}>
            <Link to={`/meetings/${item.id}`}>
              <List.Item.Meta
                title={item.title.name}
                description={item.description}
              />
              {item.status < 2 ? <MeetingStatus status={item.status} /> : null}
              <div>
                <Text>
                  <Icon theme="twoTone" type="calendar" />
                  {` ${moment(new Date(item.planned_start)).format(
                    "DD.MM.YYYY."
                  )}`}
                </Text>
              </div>
              <div>
                <Text>
                  <Icon theme="twoTone" type="clock-circle" />
                  {` ${moment(new Date(item.planned_start)).format(
                    "HH:mm"
                  )} - ${moment(new Date(item.planned_end)).format("HH:mm")}`}
                </Text>
              </div>
            </Link>
          </List.Item>
        )}
      />
    </React.Fragment>
  );
};

export default meetingsList;
