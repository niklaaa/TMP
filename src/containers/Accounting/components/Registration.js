import React, { Component } from "react";

import { Row, Col, Form, Input, Alert, Button, Divider } from "antd";

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class Registration extends Component {
  state = {
    successVisible: false
  };

  alertSuccess = () => {
    this.setState({ successVisible: true });
    setTimeout(() => {
      this.setState({ successVisible: false });
    }, 4500);
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (values.password !== values.password2) {
          this.props.form.setFields({
            password2: {
              errors: [new Error("Lozinka se ne podudara!")]
            }
          });
          return;
        }
        this.props.handleRegistration(values, this.alertSuccess.bind(this));
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

    const alertSuccess = (
      <Alert
        style={{ marginBottom: "10px", zIndex: "1", maxWidth: "400px" }}
        message="Korisni uspješno dodan!"
        type="success"
      />
    );
    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 8
        }
      },
      wrapperCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 16
        }
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 16,
          offset: 8
        }
      }
    };

    return (
      <>
        <Divider />
        <Row type="flex" justify="center">
          <Col span={12}>
            {this.props.registration.error ? alert : null}

            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
              Dodaj novog korisnika
            </h2>
            <Form
              {...formItemLayout}
              style={{ width: "400px" }}
              layout="vertical"
              onSubmit={this.handleSubmit}
            >
              <Form.Item label="E-mail">
                {getFieldDecorator("email", {
                  rules: [
                    {
                      type: "email",
                      message: "Nepravilan unos E-mail!"
                    },
                    {
                      required: true,
                      message: "Unesite E-mail!"
                    }
                  ]
                })(<Input placeholder="E-mail" />)}
              </Form.Item>
              <Form.Item label="Lozinka">
                {getFieldDecorator("password", {
                  rules: [
                    {
                      required: true,
                      message: "Unesite lozinku!"
                    }
                  ]
                })(<Input.Password placeholder="Lozinka" />)}
              </Form.Item>
              <Form.Item label="Potvrdite lozinku">
                {getFieldDecorator("password2", {
                  dependencies: ["password"],
                  rules: [
                    {
                      required: true,
                      message: "Unesite lozinku!"
                    }
                  ]
                })(<Input.Password placeholder="Potvrdite lozinku" />)}
              </Form.Item>

              <Form.Item label="Ime">
                {getFieldDecorator("first_name", {
                  rules: [
                    {
                      required: true,
                      message: "Unesite ime!"
                    }
                  ]
                })(<Input placeholder="Ime" />)}
              </Form.Item>
              <Form.Item label="Prezime">
                {getFieldDecorator("last_name", {
                  rules: [
                    {
                      required: true,
                      message: "Unesite prezime"
                    }
                  ]
                })(<Input placeholder="Prezime" />)}
              </Form.Item>
              <Form.Item label="Korisničko ime">
                {getFieldDecorator("username", {
                  initialValue: "-",
                  rules: [
                    {
                      required: false
                    }
                  ]
                })(<Input placeholder="Korisničko ime" />)}
              </Form.Item>

              <Form.Item {...tailFormItemLayout}>
                <Button
                  loading={this.props.registration.loading}
                  type="primary"
                  htmlType="submit"
                  disabled={hasErrors(getFieldsError())}
                >
                  Spremi
                </Button>
              </Form.Item>
            </Form>
            {this.state.successVisible ? alertSuccess : null}
          </Col>
        </Row>
      </>
    );
  }
}

export default Form.create()(Registration);
