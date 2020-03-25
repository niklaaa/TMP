import React, { Component } from "react";

import { Form, Button, Col, Row, Input, Icon, Alert } from "antd";

const { TextArea } = Input;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class CreateNoteForm extends Component {
  state = {
    titleExsits: false
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let check = this.props.titles.data.findIndex(
          item => item.name.toLowerCase() === values.title.toLowerCase()
        );
        if (check !== -1) {
          this.setState({ titleExsits: true });
          setTimeout(() => {
            this.setState({ titleExsits: false });
          }, 4000);
          return;
        }

        this.props.saveTitle(values);
      }
    });
  };

  render() {
    const { getFieldDecorator, getFieldsError } = this.props.form;

    const alert = (
      <Alert
        style={{ marginBottom: "10px", zIndex: "1" }}
        message="Dogodila se greša"
        description="Dogodila se greška prilikom spremanja na server molimo vas probajte ponovo!"
        type="error"
      />
    );

    const alertTitleExsits = (
      <Alert
        style={{ marginBottom: "10px", zIndex: "1" }}
        message="Upozorenje"
        description="Navedeni naslov vec postoji!"
        type="warning"
      />
    );

    return (
      <React.Fragment>
        <Row gutter={10}>
          <Col span={20}>
            <h2>Novi naslov sastanka</h2>
            {this.props.addTitle.error ? alert : null}
            {this.state.titleExsits ? alertTitleExsits : null}
          </Col>
          <Col span={4}>
            <Button onClick={this.props.onClose}>
              <Icon type="close" />
            </Button>
          </Col>
        </Row>
        <Form layout="vertical" hideRequiredMark onSubmit={this.handleSubmit}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Naslov">
                {getFieldDecorator("title", {
                  rules: [{ required: true, message: "Unesite naslov!" }]
                })(
                  <Input
                    style={{ maxWidth: "400px" }}
                    placeholder="Unesite naslov"
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Button
            loading={this.props.addTitle.loading}
            type="primary"
            htmlType="submit"
            disabled={hasErrors(getFieldsError())}
          >
            Spremi
          </Button>
        </Form>
      </React.Fragment>
    );
  }
}

export default Form.create()(CreateNoteForm);
