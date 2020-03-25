import React, { Component } from 'react';

import {Button, Icon} from "antd";


class MeetingUser extends Component {
    state = {  }
    render() { 

        const item = this.props.user;
        const {isExhibitor, meeting} = this.props;

        return ( 
            <span
                      style={{ width: "100%" }}
                      key={item.user.id}
                      className={this.props.css.Users}
                    >
                      <Button
                        disabled={!isExhibitor || (item.leave && meeting.status===2)}
                        onClick={id => this.props.openUserPanel(item.user.id)}
                      >
                        {item.is_required ? (
                          <Icon type="exclamation-circle" />
                        ) : null}
                        {item.user.name}
                        {item.status === 1 ? (
                          <Icon style={{ color: "#1890ff" }} type="check" />
                        ) : null}
                         {item.is_pause === 1 ? (
                         <Icon style={{ color: "#1890ff" }} type="pause" />
                        ) : null}
                        {item.is_pause === 2 ? (
                         <Icon style={{ color: "#1890ff" }} type="stop" />
                        ) : null}
                      </Button>
                      {meeting.status < 2 && isExhibitor === 1 ? (
                        <Button
                          disabled={!isExhibitor}
                          loading={
                            this.props.removeUserLoading ===
                            item.invited_user_id
                          }
                          icon="close"
                          type=""
                          size="default"
                          disabled={
                            meeting.users.filter(item => item.exhibitor === this.props.exhibitor)
                              .length < 2
                          }
                          onClick={() => this.props.removeUser(item.invited_user_id)}
                        />
                      ) : null}
                    </span>
         );
    }
}
 
export default MeetingUser;