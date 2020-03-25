import React, { Component } from "react";

import { Row, Col, Button, Form, Input, Icon, Alert } from "antd";

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class AddPlace extends Component {
  state = {

    warning: {
      visible: false,
      message: "{1} već postoji!"
    }
  };

  setInitialValue = key => {
    switch (key) {
      case "city":
        let city = this.props.cities.find(
          item => item.id === this.props.values[key]
        );
        if (!city) {
          return null;
        }
        return city.name;
      case "street":
        let street = this.props.streets.find(
          item => item.id === this.props.values[key]
        );
        if (!street) {
          return null;
        }
        return street.name;
      case "location":
        let location = this.props.locations.find(
          item => item.id === this.props.values[key]
        );
        if (!location) {
          return null;
        }
        return location.name;
      case "room":
        let room = this.props.rooms.find(
          item => item.id === this.props.values[key]
        );
        if (!room) {
          return null;
        }
        return room.name;

      default:
        return null;
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      let warning = {...this.state.warning};
      warning.visible = false;
      warning.message = "{1} već postoji!";
      this.setState({warning});
      if (!err) {

        // validacija is exsits
        
        // city
        if(this.props.type === "city" && this.props.cities.findIndex(item => item.name.toLowerCase() === values.city.toLowerCase()) !== -1){
          warning.visible = true;
          warning.message = warning.message.replace("{1}", "Grad");
          this.setState({warning});
          return;
        }
        // street
        if(this.props.type === "street" && this.props.streets.findIndex(item => item.name.toLowerCase() === values.street.toLowerCase()) !== -1){
          warning.visible = true;
          warning.message = warning.message.replace("{1}", "Ulica");
          this.setState({warning});
          return;
        }
        // location
        if(this.props.type === "location" && this.props.locations.findIndex(item => item.name.toLowerCase() === values.location.toLowerCase()) !== -1){
          warning.visible = true;
          warning.message = warning.message.replace("{1}", "Objekt");
          this.setState({warning});
          return;
        }
        //room
        if(this.props.rooms.findIndex(item => item.name.toLowerCase() === values.room.toLowerCase()) !== -1){
          warning.visible = true;
          warning.message = warning.message.replace("{1}", "Soba");
          this.setState({warning});
          return;
        }

        // validacija is exsits end


        let cityIndex = this.props.cities.findIndex(
          item => item.name === values.city
        );
        if (cityIndex !== -1) {
          values.city = this.props.cities[cityIndex].id;
        }
        //
        let streetIndex = this.props.streets.findIndex(
          item => item.name === values.street
        );
        if (streetIndex !== -1) {
          values.street = this.props.streets[streetIndex].id;
        }
        //
        let locationIndex = this.props.locations.findIndex(
          item => item.name === values.location
        );
        if (locationIndex !== -1) {
          values.location = this.props.locations[locationIndex].id;
        }


        
         

        this.props.saveNewPlace(values);
      }
    });
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


    const warning = (
      <Alert
      style={{ marginBottom: "10px", zIndex: "1" }}
      message="Upozorenje"
      description={this.state.warning.message}
      type="warning"
    />
    )

    const { getFieldDecorator, getFieldsError } = this.props.form;
    return (
      <>
        <Row gutter={10}>
          <Col span={20}>
            <h2>Novo mjesto sastanka</h2>
            {this.props.newPlace.error ? alert : null}
            {this.state.warning.visible ? warning : null}
          </Col>
          <Col span={4}>
            <Button onClick={this.props.onClose}>
              <Icon type="close" />
            </Button>
          </Col>
        </Row>
        <Form
          style={{ maxWidth: "600px" }}
          layout="vertical"
          hideRequiredMark
          onSubmit={this.handleSubmit}
        >
          <Row gutter={3}>
            <Col span={18}>
              <Form.Item label="Grad">
                {getFieldDecorator("city", {
                  initialValue: this.setInitialValue("city"),
                  rules: [{ required: true, message: "Unesite grad!" }]
                })(
                  <Input
                    disabled={
                      this.props.cities.findIndex(
                        item => item.id === this.props.values.city
                      ) !== -1
                    }
                    placeholder="Naziv grada"
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={3}>
            <Col span={18}>
              <Form.Item label="Ulica">
                {getFieldDecorator("street", {
                  initialValue: this.setInitialValue("street"),
                  rules: [{ required: true, message: "Unesite ulicu!" }]
                })(
                  <Input
                    disabled={
                      this.props.streets.findIndex(
                        item => item.id === this.props.values.street
                      ) !== -1
                    }
                    placeholder="Naziv ulice"
                  />
                )}
              </Form.Item>
            </Col>
          </Row>{" "}
          <Row gutter={3}>
            <Col span={18}>
              <Form.Item label="Objekt">
                {getFieldDecorator("location", {
                  initialValue: this.setInitialValue("location"),
                  rules: [{ required: true, message: "Unesite lokaciju!" }]
                })(
                  <Input
                    disabled={
                      this.props.locations.findIndex(
                        item => item.id === this.props.values.location
                      ) !== -1
                    }
                    placeholder="Naziv obkelta"
                  />
                )}
              </Form.Item>
            </Col>
          </Row>{" "}
          <Row gutter={3}>
            <Col span={18}>
              <Form.Item label="Soba">
                {getFieldDecorator("room", {
                  initialValue: this.setInitialValue("room"),
                  rules: [{ required: true, message: "Unesite soba!" }]
                })(
                  <Input
                    disabled={
                      this.props.rooms.findIndex(
                        item => item.id === this.props.values.room
                      ) !== -1
                    }
                    placeholder="Naziv sobe"
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Button
            loading={this.props.newPlace.loading}
            type="primary"
            htmlType="submit"
            disabled={hasErrors(getFieldsError())}
          >
            Spremi
          </Button>
        </Form>
      </>
    );
  }
}

export default Form.create()(AddPlace);
