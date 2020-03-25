import React, { Component } from "react";

import { Form, List, Row, Col, Avatar, Button, Input, Alert } from "antd";

import { FileTextOutlined } from "@ant-design/icons";

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class Links extends Component {
  state = {};

  createLink = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.form.resetFields();
        this.props.createLink(values);
      }
    });
  };

  removeLink = id => {
    this.props.removeLink(id);
  };

  render() {
    const alert = (
      <Alert
        style={{ marginBottom: "10px", zIndex: "1" }}
        message="Dogodila se greša"
        description="Dogodila se greška prilikom spremanja na server molimo vas probajte ponovo!"
        type="error"
      />
    );
    const { getFieldDecorator, getFieldsError } = this.props.form;
    return (
      <Row>
        <Col span={12}>
          {this.props.link.errorRemove ? alert : null}
          <List
            style={{ maxWidth: "400px" }}
            itemLayout="horizontal"
            dataSource={this.props.meeting.links}
            renderItem={item => (
              <List.Item
                avatar={<FileTextOutlined />}
                extra={
                  <Button
                    onClick={id => this.removeLink(item.id)}
                    loading={this.props.link.removeLoading === item.id}
                    icon="delete"
                  />
                }
              >
                <List.Item.Meta
                  description={
                    <a href={item.link} target="_blank">
                      {item.title}
                    </a>
                  }
                />
              </List.Item>
            )}
          ></List>
        </Col>
        <Col span={12}>
          {this.props.link.errorAdd ? alert : null}
          {this.props.meeting.status !== 3 ? (
            <Form layout="vertical" hideRequiredMark onSubmit={this.createLink}>
              <Row gutter={10}>
                <Col span={24}>
                  <Form.Item label="Naslov Linka">
                    {getFieldDecorator("title", {
                      rules: [{ required: true, message: "Unesite naslov!" }]
                    })(<Input placeholder="Naslov" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item label="Link">
                    {getFieldDecorator("link", {
                      rules: [{ required: true, message: "Unesite Link!" }]
                    })(<Input placeholder="Link" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Button
                loading={this.props.link.addLoading}
                type="primary"
                htmlType="submit"
                disabled={hasErrors(getFieldsError())}
              >
                Spremi
              </Button>
            </Form>
          ) : null}
        </Col>
      </Row>
    );
  }
}

export default Form.create()(Links);
