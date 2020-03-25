import React, { Component } from "react";

import { List, Checkbox, Icon, Modal, Row, Col } from "antd";

class StopMeetingPause extends Component {
  state = {
    users: []
  };

  setUser = id => {
    let userIndex = this.state.users.indexOf(id);
    if (userIndex === -1) {
      this.setState({ users: this.state.users.concat([id]) });
    } else {
      let _users = this.state.users.concat();
      _users.splice(userIndex, 1);
      this.setState({ users: _users });
    }
  };

  close = () => {
    this.setState({ users: [] });
    this.props.onCancel();
  };

  onOk = () => {
    this.setState({ users: [] });
    this.props.proccedStart(this.state.users);
  };

  render() {


    return (
      <Modal
        visible={this.props.stopMeetingPauseVisible}
        onCancel={this.close}
        destroyOnClose={true}
        confirmLoading={this.props.loading} 
        onOk={this.onOk}
        title={"Korisnici koji su na pauzi"}
        okText="Nastavi"
      >
        <List
          header={
            <Row>
              <Col span={6} push={18}>
                <div style={{ textAlign: "right" }}>Pauza gotova</div>
              </Col>
            </Row>
          }
          itemLayout="horizontal"
          dataSource={this.props.invited_users}
          renderItem={item => (
            <List.Item
              extra={
                <Checkbox onChange={id => this.setUser(item.invited_user_id)} />
              }
            >
              <List.Item.Meta
                avatar={<Icon type="user" />}
                description={item.user.name}
              />
            </List.Item>
          )}
        ></List>
      </Modal>
    );
  }
}

export default StopMeetingPause;
