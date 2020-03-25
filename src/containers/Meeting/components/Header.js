import React, { Component } from "react";

import moment from "moment";

import { Tooltip, Icon, Typography } from "antd";

const { Title, Text } = Typography;

class Header extends Component {
  state = {};

  render() {

    const {meeting} = this.props; 



    return (
      <React.Fragment>
        <Title level={3}>{meeting.title.name}</Title>
        <Text>
          <Tooltip title="Dobavljač">{meeting.supplier.name}</Tooltip>
          {", "}
          <Tooltip title="Proizvod">{meeting.product.name}</Tooltip>
          <div></div>
          <Tooltip title="Planirano vrijeme sastanka">
            <Icon type="calendar" theme="twoTone" />{" "}
            {moment(meeting.planned_start).format("DD.MM.YYYY. HH:mm")} -{" "}
            {moment(meeting.planned_end).format("HH:mm")}
          </Tooltip>{" "}
          <div>
            <Icon type="pushpin" theme="twoTone" />{" "}
            {meeting.country.name +
              ", " +
              meeting.city.name +
              ", " +
              meeting.location.name +
              ", " +
              meeting.room.name}
          </div>
        </Text>
      </React.Fragment>
    );
  }
}

export default Header;
