import React, { Component } from "react";

import moment from "moment";

import { UnorderedListOutlined } from "@ant-design/icons";

import {
  Form,
  Button,
  Col,
  Row,
  Input,
  Select,
  DatePicker,
  Alert,
  Tabs,
  Icon,
  List,
  Avatar
} from "antd";

// const {UnorderedListOutlined} = icons;
// console.log(icons);

const { Option } = Select;

const { TextArea } = Input;

const { TabPane } = Tabs;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class Task extends Component {
  state = {
    usersOftask: []
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.form.resetFields();
        this.props.createTask(values);
      }
    });
  };

  showUsersOfTask = (event, taskId) => {
    const tasksElements = document.getElementsByClassName("task");
    const index = this.props.tasks.filter(item => item.id <= taskId).length;
    let top = 0;
    for (let i = 0; i < index - 1; i++) {
      top += tasksElements[i].offsetHeight;
    }

    const users = this.props.tasks.find(item => item.id === taskId).user;
    this.setState({ usersOftask: users });
    document.getElementById("usersOfTask").style.top = top + "px";
  };

  cleareUsersOfTasks = () => {
    this.setState({ usersOftask: [] });
  };
  render() {
    const { getFieldDecorator, getFieldsError } = this.props.form;
    const { users } = this.props;

    const alert = (
      <Alert
        style={{ marginBottom: "10px", zIndex: "1" }}
        message="Dogodila se greša"
        description="Dogodila se greška prilikom spremanja na server molimo vas probajte ponovo!"
        type="error"
      />
    );

    const alertAllUsers = (
      <Alert
        style={{ marginBottom: "10px", zIndex: "1", maxWidth: "600px" }}
        message="Dogodila se greša"
        description="Dogodila se greška prilikom povlačenja korisnika sa servera molimo probajte ponovo otvoriti tab Zadaci!"
        type="error"
      />
    );

    return (
      <Tabs onTabClick={this.cleareUsersOfTasks} defaultActiveKey="create">
        {this.props.meetingStatus < 3 ? (
          <TabPane tab={<Icon type="edit" />} key="create">
            <React.Fragment>
              {this.props.task.status === "FAIL" ? alert : null}
              {this.props.allUsers.error ? alertAllUsers : null}
              <Form
                style={{ maxWidth: "600px" }}
                layout="vertical"
                hideRequiredMark
                onSubmit={this.handleSubmit}
              >
                <Row gutter={3}>
                  <Col span={24}>
                    <Form.Item label="Naslov zadatka">
                      {getFieldDecorator("title", {
                        rules: [
                          { required: true, message: "Unesite opis zadatka!" }
                        ]
                      })(<Input placeholder="Naslov zadatka" />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={3}>
                  <Col span={24}>
                    <Form.Item label="Opis zadatka">
                      {getFieldDecorator("description", {
                        rules: [
                          { required: true, message: "Unesite opis zadatka!" }
                        ]
                      })(<TextArea placeholder="Opis zadatka..." rows={3} />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={3}>
                  <Col span={12}>
                    <Form.Item label="Odgovorne osobe">
                      {getFieldDecorator("user", {
                        rules: [
                          {
                            required: true,
                            message: "Odaberite tko je zaduzen za zadatak!"
                          }
                        ]
                      })(
                        <Select
                          mode="multiple"
                          allowClear={true}
                          style={{ width: "100%" }}
                          placeholder="Odaberite ..."
                          loading={this.props.allUsers.loading}
                        >
                          {this.props.allUsers.data &&
                          this.props.allUsers.data.length > 0
                            ? this.props.allUsers.data.map(user => (
                                <Option value={user.id} key={user.id}>
                                  {user.name}
                                </Option>
                              ))
                            : null}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Zadatak zadao">
                      {getFieldDecorator("owner", {
                        rules: [
                          {
                            required: true,
                            message: "Odaberite tko je zaduzen za zadatak!"
                          }
                        ]
                      })(
                        <Select
                          mode="single"
                          style={{ width: "100%" }}
                          placeholder="Odaberite ..."
                        >
                          {users && users.length > 0
                            ? users.map(user => (
                                <Option
                                  value={user.invited_user_id}
                                  key={user.invited_user_id}
                                >
                                  {user.user.name}
                                </Option>
                              ))
                            : null}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={3}>
                  <Col span={24}>
                    <Form.Item label="Vrijeme izvrsavanja">
                      {getFieldDecorator("planned_end", {
                        rules: [
                          {
                            required: true,
                            message: "Odaberite vrijeme izvrsavanja!"
                          }
                        ]
                      })(<DatePicker />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Button
                  loading={this.props.task.loading}
                  type="primary"
                  htmlType="submit" 
                  disabled={hasErrors(getFieldsError())}
                >
                  Spremi
                </Button>
              </Form>
            </React.Fragment>
          </TabPane>
        ) : null}
        <TabPane tab={<UnorderedListOutlined />} key="taskList">
          <Row>
            <Col span={14}>
              <List
                itemLayout="horizontal"
                dataSource={this.props.tasks}
                renderItem={item => (
                  <List.Item
                    className="task"
                    extra={
                      <Button
                        onClick={e => this.showUsersOfTask(e, item.id)}
                        loading={false}
                        icon="user"
                      />
                    }
                  >
                    <List.Item.Meta
                      title={item.title}
                      description={
                        <React.Fragment>
                          <div
                            style={{
                              border: "1px solid #e8e8e8",
                              marginRight: "10px",
                              padding: "3px"
                            }}
                          >
                            {item.description}
                          </div>
                          <div style={{ marginTop: "5px" }}>
                            <span
                              style={{
                                textAlign: "left",
                                display: "inline-block",
                                width: "50%"
                              }}
                            >
                              <span style={{ fontWeight: "bold" }}>Rok:</span>
                              {" " +
                                moment(item.planned_end).format("DD-MM-YYYY")}
                            </span>
                            <span
                              style={{
                                textAlign: "right",
                                display: "inline-block",
                                width: "50%"
                              }}
                            >
                              <span style={{ fontWeight: "bold" }}>Zadao:</span>
                              {" " + item.creator.name}
                            </span>
                          </div>
                        </React.Fragment>
                      }
                    />
                  </List.Item>
                )}
              />
            </Col>
            <Col span={10}>
              <List
                id="usersOfTask"
                itemLayout="horizontal"
                dataSource={this.state.usersOftask}
                style={{
                  padding: "0 10px",
                  position: "realtive",
                  width: "70%",
                  margin: "0 auto"
                }}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                      }
                      title={item.name}
                    />
                  </List.Item>
                )}
              />
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    );
  }
}

export default Form.create()(Task);
