import React, { Component } from "react";

import { Form, Button, Col, Row, Input, Alert } from "antd";


const { TextArea } = Input;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class CreateNoteForm extends Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.form.resetFields();
        this.props.createNote(values);
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

    return (
      <React.Fragment>
        {this.props.note.error ? alert : null}
        <Form layout="vertical" hideRequiredMark onSubmit={this.handleSubmit}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Biljeska">
                {getFieldDecorator("content", {
                  initialValue: this.props.note.loading ? "..." : this.props.meeting.note.text || "",
                  rules: [{ required: true, message: "Unesite tekst bilješke!" }]
                })(<TextArea disabled={this.props.meeting.status === 3} style={{maxWidth: "600px"}} placeholder="Tekst biljeske..." rows={3} />)}
              </Form.Item>
            </Col>
          </Row>
         {this.props.meeting.status !== 2 ? null : <Button
            loading={this.props.note.loading}
            type="primary"
            htmlType="submit"
            disabled={hasErrors(getFieldsError())}
          >
            Spremi
          </Button>}
        </Form>
      </React.Fragment>
    );
  }
}

export default Form.create()(CreateNoteForm);
