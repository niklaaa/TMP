import React, { Component } from "react";

import { Form, Col, Row, Select, Modal, Checkbox, Alert } from "antd";

import Spinner from "../../../components/LoadingScreen";

const { Option } = Select;

class AddUsers extends Component {
  state = {
    requiredUsers: []
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.users = values.users.map(item => {
          if (this.state.requiredUsers.includes(item.key)) {
            return {
              id: item.key,
              is_required: 1
            };
          }
          return {
            id: item.key,
            is_required: 0
          };
        });
        this.props.action(values.users);
        this.props.form.resetFields();
      }
    });
  };

  clearUser = e => {
    const indexOfReqUser = this.state.requiredUsers.indexOf(e.key); //index of requried user
    if (indexOfReqUser > -1) {
      let arr_r = this.state.requiredUsers.concat();
      arr_r.splice(indexOfReqUser, 1);
      this.setState({ requiredUsers: arr_r });
    }
  };

  setRequired = id => {
    let arr = this.state.requiredUsers.concat(id);
    this.setState({ requiredUsers: arr });
  };

  render() {
    const { getFieldDecorator, getFieldsError } = this.props.form;
    const { visible, onCancel, users } = this.props;

    const alert =
      this.props.status === "FAIL" ? (
        <Alert
          message="Dogodila se greša"
          description="Dogodila se greška prilikom spremanja na server molimo vas probajte ponovo!"
          type="error"
        />
      ) : null;

    return (
      <Modal
        visible={visible}
        onCancel={onCancel}
        onOk={this.handleSubmit}
        title={this.props.title}
        confirmLoading={this.props.saveLoading}
        okText="Spremi"
      >
        {this.props.loading ? (
          <Spinner />
        ) : (
          <React.Fragment>
            {alert}
            <Form
              layout="vertical"
              hideRequiredMark
              onSubmit={this.handleSubmit}
            >
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item label="Odaberite osobe">
                    {getFieldDecorator("users", {
                      rules: [
                        {
                          required: true,
                          message: "Odaberite osobe koje zelite dodati!"
                        }
                      ]
                    })(
                      <Select
                        onDeselect={this.clearUser}
                        mode="multiple"
                        showSearch
                        labelInValue
                        placeholder="Odaberite Sudionike"
                        optionFilterProp="name"
                        filterOption={(input, option) =>
                          option.props.children[0].key
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {users && users.length > 0
                          ? users.map(item => {
                              return (
                                <Option value={item.id} key={item.id + "s"}>
                                  <span key={item.name}>{item.name} </span>
                                  <span className="showCheckbox">
                                    <Checkbox
                                      onChange={this.setRequired.bind(
                                        this,
                                        item.id
                                      )}
                                    />
                                  </span>
                                </Option>
                              );
                            })
                          : []}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </React.Fragment>
        )}
      </Modal>
    );
  }
}

export default Form.create()(AddUsers);
