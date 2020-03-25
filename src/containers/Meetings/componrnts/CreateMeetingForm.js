import React, { Component } from "react";
import moment from "moment";

import { connect } from "react-redux";

import * as actions from "../../../redux/modules/Meetings/actions";

import Spinner from "../../../components/LoadingScreen/index";
import AddPlace from "./AddPlace";
import AddTitle from "./AddTitle";

import {
  Drawer,
  Form,
  Button,
  Col,
  Row,
  Input,
  Select,
  DatePicker,
  TimePicker,
  Icon,
  Alert,
  Upload,
  Radio,
  Checkbox
} from "antd";

const { Option } = Select;
const { TextArea } = Input;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class CreateMeetingForm extends Component {
  state = {
    fileList: [],
    selectedUsers: [],
    suppliers: [],
    products: [],
    cities: [],
    streets: [],
    locations: [],
    rooms: [],
    requiredUsers: [],
    selected: {
      city: false,
      street: false,
      location: false,
      customer: false,
      prodcut: false
    },
    visibleAddPlaceOfMeeting: false,
    addType: "",
    addPlaceWarning: {
      message: "Odaberite {1} da bi postavili {2}",
      key: null
    },
    visibleAddNewTitle: false
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  componentDidUpdate(prevProps) {
    // console.log(this.props.closeForm);
    if (this.props.closeForm !== prevProps.closeForm) {
      this.props.close();
    }

    if (this.props.reset !== prevProps.reset) {
      const selected = { ...this.state.selected };
      for (const item in selected) {
        selected[item] = false;
      }
      this.setState({
        requiredUsers: [],
        selectedUsers: [],
        selected
      });
    }
    if (this.props.suppliers !== prevProps.suppliers) {
      this.setState({
        suppliers: this.props.suppliers.data.concat()
      });
    }

    if (this.props.products !== prevProps.products) {
      this.setState({
        products: this.props.products.data.concat()
      });
    }

    if (this.props.cities !== prevProps.cities) {
      this.setState({
        cities: this.props.cities.data.concat()
      });
    }

    if (this.props.streets !== prevProps.streets) {
      this.setState({
        streets: this.props.streets.data.concat()
      });
    }

    if (this.props.locations !== prevProps.locations) {
      this.setState({
        locations: this.props.locations.data.concat()
      });
    }

    if (this.props.rooms !== prevProps.rooms) {
      this.setState({
        rooms: this.props.rooms.data.concat()
      });
    }
  }

  addNewTitle = () => {
    this.setState({ visibleAddNewTitle: true });
  };

  closeAddTitle = () => {
    this.setState({ visibleAddNewTitle: false });
  };

  saveTitle = values => {
    this.props.onSaveNewTitle(values, this.closeAddTitle.bind(this));
  };

  addPlaceOfMeeting = addType => {
    switch (addType) {
      case "street":
        if (!this.props.form.getFieldValue("city")) {
          const addPlaceWarning = {
            message: this.state.addPlaceWarning.message
              .replace("{1}", "grad")
              .replace("{2}", "ulicu"),
            key: addType
          };
          this.setState({ addPlaceWarning });
          return;
        }
        break;

      case "location":
        if (
          !this.props.form.getFieldValue("street") ||
          !this.props.form.getFieldValue("city")
        ) {
          const addPlaceWarning = {
            message: this.state.addPlaceWarning.message
              .replace("{1}", "grad, ulicu")
              .replace("{2}", "lokaciju"),
            key: addType
          };
          this.setState({ addPlaceWarning });
          return;
        }
        break;
      case "room":
        if (
          !this.props.form.getFieldValue("location") ||
          !this.props.form.getFieldValue("street") ||
          !this.props.form.getFieldValue("city")
        ) {
          const addPlaceWarning = {
            message: this.state.addPlaceWarning.message
              .replace("{1}", "grad, ulicu, lokaciju")
              .replace("{2}", "sobu"),
            key: addType
          };
          this.setState({ addPlaceWarning });
          return;
        }
        break;
    }
    this.openFormAddNewPlace(addType);
  };

  openFormAddNewPlace = addType => {
    const addPlaceWarning = {
      message: "Odaberite {1} da bi postavili {2}",
      key: null
    };
    this.setState({
      visibleAddPlaceOfMeeting: true,
      addType,
      addPlaceWarning
    });
  };

  closeAddPlaceWarning = () => {
    const addPlaceWarning = {
      message: "Odaberite {1} da bi postavili {2}",
      key: null
    };
    this.setState({ addPlaceWarning });
  };

  closeAddPlace = () => {
    this.setState({ visibleAddPlaceOfMeeting: false });
  };

  saveNewPlace = values => {
    this.props.onSaveNewPlace(
      values,
      this.state.addType,
      this.closeAddPlace.bind(this)
    );
  };

  citySelected = cityID => {
    if (this.props.edit) {
      const selected = { ...this.state.selected };
      selected.city = true;
      this.setState({ selected });
    }

    this.props.form.resetFields(["street", "location", "room"]);
    this.setState({
      streets: this.props.streets.data.filter(item => item.city === cityID)
    });
  };

  streetSelected = streetID => {
    if (this.props.edit) {
      const selected = { ...this.state.selected };
      selected.street = true;
      this.setState({ selected });
    }

    this.props.form.resetFields(["location", "room"]);
    this.setState({
      locations: this.props.locations.data.filter(
        item => item.street === streetID
      )
    });
  };

  locationSelected = locationID => {
    if (this.props.edit) {
      const selected = { ...this.state.selected };
      selected.location = true;
      this.setState({ selected });
    }
    this.props.form.resetFields(["room"]);
    this.setState({
      rooms: this.props.rooms.data.filter(item => item.location === locationID)
    });
  };
  supplierSelected = supplierID => {
    if (this.props.edit) {
      const selected = { ...this.state.selected };
      selected.supplier = true;
      this.setState({ selected });
    }
    this.props.onGetProducts(supplierID);
  };
  productSeleted = productID => {
    if (this.props.edit) {
      const selected = { ...this.state.selected };
      selected.product = true;
      this.setState({ selected });
    }
    this.props.onGetSuppliers(productID);
  };
  getProducts = supplierID => {
    this.props.onGetProducts(supplierID);
  };
  getSuppliers = productID => {
    this.props.onGetSuppliers(productID);
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.planned_start = moment(values.start_time).format(
          "YYYY-MM-DD HH:mm"
        );
        values.planned_end = moment(values.start_time)
          .add(
            new Date(values.durationTime).getMinutes() +
              new Date(values.durationTime).getHours() * 60,
            "m"
          )
          .format("YYYY-MM-DD HH:mm");

        values.participant =
          this.props.edit ||
          values.participant.map(item => {
            if (this.state.requiredUsers.includes(item.key)) {
              return {
                id: item.key,
                required: 1
              };
            }
            return {
              id: item.key,
              required: 0
            };
          });
        values.exhibitor =
          this.props.edit ||
          values.exhibitor.map(item => {
            if (this.state.requiredUsers.includes(item.key)) {
              return {
                id: item.key,
                required: 1
              };
            }
            return {
              id: item.key,
              required: 0
            };
          });
        values.country = 1; // zakovano trenutno se koristi samo an nivou BiH
        // values.creator = 1; // the id will be set on backend
        if (values.type === 1) {
          values.subtype = "";
        }

        //form data posto sa kreiranjem sastanka idu i dokumenti
        let formData = new FormData();
        formData.append("data", JSON.stringify(values));

        this.state.fileList.forEach(item => {
          formData.append("files", item);
        });

        this.props.onSubmit(formData);
        this.setState({ submitted: true });
      }
    });
  };

  filterForForm = (id, key, item) => {
    // used when is form for update then will filter data based on parent selection
    if (this.props.edit && !this.state.selected[key]) {
      if (id === item[key]) return true;
      return false;
    }
    return true;
  };

  setInitialValue = (key, parentKey) => {
    // used only for update meeting because after reset fileds initialValue returns on starting point i dont want it if some parent node is sellected
    if (!this.props.edit) {
      return null;
    }
    if (!this.state.selected[parentKey]) {
      return this.props[key];
    }
    return null;
  };

  takeUser = e => {
    let arr = this.state.selectedUsers.concat(e.key);
    this.setState({ selectedUsers: arr });
    //ukoliko je izabran za izlagaca korisnik ne moze biti sudionik ili obrnuto
  };
  clearUser = e => {
    const index = this.state.selectedUsers.indexOf(e.key);
    const indexOfReqUser = this.state.requiredUsers.indexOf(e.key); //index of requried user
    if (index > -1) {
      let arr = this.state.selectedUsers.concat();
      arr.splice(index, 1);
      this.setState({ selectedUsers: arr });
    }
    if (indexOfReqUser > -1) {
      let arr_r = this.state.requiredUsers.concat();
      arr_r.splice(indexOfReqUser, 1);
      this.setState({ requiredUsers: arr_r });
    }
  };

  beforeUpload = file => {
    this.setState(state => ({
      fileList: [...state.fileList, file]
    }));
    return false;
  };

  removeFile = file => {
    let fileList = this.state.fileList.concat();
    const index = fileList.indexOf(file);
    fileList.splice(index, 1);
    this.setState({ fileList, fileList });
  };

  setRequired = id => {
    //user id
    let arr = this.state.requiredUsers.concat(id);
    this.setState({ requiredUsers: arr });
  };

  render() {
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    const alert = (
      <Alert
        style={{ marginBottom: "10px", zIndex: "1" }}
        message="Dogodila se greša"
        description="Dogodila se greška prilikom spremanja na server molimo vas probajte ponovo!"
        type="error"
      />
    );

    const newPlaceWarming = (
      <Alert
        style={{ maxWidth: "400px", margin: "5px auto" }}
        message={this.state.addPlaceWarning.message}
        type="warning"
        closable
        onClose={this.closeAddPlaceWarning}
      />
    );

    const titleError = isFieldTouched("title") && getFieldError("title");
    const descError =
      isFieldTouched("description") && getFieldError("description");
    const startTimeError =
      isFieldTouched("start_time") && getFieldError("start_time");
    const cityError = isFieldTouched("place") && getFieldError("place");
    const streetError = isFieldTouched("place") && getFieldError("place");
    const locationError = isFieldTouched("place") && getFieldError("place");
    const roomError = isFieldTouched("place") && getFieldError("place");
    const exhibitorError =
      isFieldTouched("exhibitor") && getFieldError("exhibitor");
    const participantError =
      isFieldTouched("participant") && getFieldError("participant");
    const productError = isFieldTouched("product") && getFieldError("product");
    const customerError =
      isFieldTouched("customer") && getFieldError("customer");
    const supplierError =
      isFieldTouched("supplier") && getFieldError("supplier");
    const durationTimeError =
      isFieldTouched("durationTime") && getFieldError("durationTime");
    const meetingType =
      isFieldTouched("meetingType") && getFieldError("meetingType");

    const addPlaceOfMeeting = (
      <AddPlace
        newPlace={this.props.saveNewPlace}
        onClose={this.closeAddPlace}
        type={this.state.addType}
        cities={this.state.cities}
        streets={this.state.streets}
        locations={this.state.locations}
        rooms={this.state.rooms}
        saveNewPlace={this.saveNewPlace}
        selected={this.state.selected}
        values={this.props.form.getFieldsValue([
          "city",
          "street",
          "location",
          "room"
        ])}
      />
    );

    const addTitle = (
      <AddTitle
        titles={this.props.titles}
        onClose={this.closeAddTitle}
        addTitle={this.props.addTitle}
        saveTitle={this.saveTitle}
      />
    );

    const createMeeting =
      this.props.prepareMeeting.loading || this.props.formRequestLoading ? (
        <div style={{ width: "100%" }}>
          <Spinner />
        </div>
      ) : (
        <div style={{ width: "100%" }}>
          {this.props.error ? alert : null}
          <Form
            style={{ width: "100%" }}
            layout="vertical"
            hideRequiredMark
            onSubmit={this.handleSubmit}
          >
            <Row gutter={16}>
              <Col span={24}>
                <Row type="flex" align="middle">
                  <Col span={21}>
                    {" "}
                    <Form.Item
                      label="Naslov"
                      validateStatus={titleError ? "error" : ""}
                      help={titleError || ""}
                    >
                      {getFieldDecorator("title", {
                        initialValue: this.props.title || null,
                        rules: [
                          {
                            required: true,
                            message: "Unesite naslov sastanka!"
                          }
                        ]
                      })(
                        <Select
                          mode="single"
                          showSearch
                          placeholder="Odaberite Naslov"
                          optionFilterProp="name"
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {this.props.titles.data &&
                          this.props.titles.data.length > 0
                            ? this.props.titles.data.map(item => (
                                <Option value={item.id} key={item.id}>
                                  {item.name}
                                </Option>
                              ))
                            : []}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={3}>
                    {" "}
                    {/*dodaj novi naslov*/}{" "}
                    {!this.props.edit ? (
                      <Button
                        style={{ marginBottom: "5px" }}
                        icon="plus"
                        type=""
                        size="default"
                        disabled={false}
                        onClick={() => this.addNewTitle()}
                      />
                    ) : null}
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="Opis"
                  validateStatus={descError ? "error" : ""}
                  help={descError || ""}
                >
                  {getFieldDecorator("description", {
                    initialValue: this.props.description || null,
                    rules: [
                      { required: true, message: "Unesite opis sastanka!" }
                    ]
                  })(<TextArea rows={4} placeholder="Opis sastanka..." />)}
                </Form.Item>
              </Col>
            </Row>
            {this.props.edit ? null : (
              <Row gutter={16}>
                <Col span={10}>
                  <Form.Item
                    label="Izlagač"
                    validateStatus={exhibitorError ? "error" : ""}
                    help={exhibitorError || ""}
                  >
                    {getFieldDecorator("exhibitor", {
                      rules: [
                        { required: true, message: "Odaberite izlagače!" }
                      ]
                    })(
                      <Select
                        allowClear={true}
                        onSelect={this.takeUser}
                        onDeselect={this.clearUser}
                        mode="multiple"
                        showSearch
                        labelInValue
                        placeholder="Odaberite izlagače"
                        optionFilterProp="name"
                        filterOption={(input, option) => {
                          // console.log(option.props.children);
                          return (
                            option.props.children[0].key
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          );
                        }}
                      >
                        {this.props.users.data &&
                        this.props.users.data.length > 0
                          ? this.props.users.data.map(item => {
                              if (!this.state.selectedUsers.includes(item.id)) {
                                return (
                                  <Option value={item.id} key={item.id + "i"}>
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
                              }
                            })
                          : []}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item
                    label="Sudionik"
                    validateStatus={participantError ? "error" : ""}
                    help={participantError || ""}
                  >
                    {getFieldDecorator("participant", {
                      rules: [
                        { required: true, message: "Odaberite Sudionike!" }
                      ]
                    })(
                      <Select
                        allowClear={true}
                        onSelect={this.takeUser}
                        onDeselect={this.clearUser}
                        mode="multiple"
                        showSearch
                        labelInValue
                        // style={{ width: 200 }}
                        placeholder="Odaberite Sudionike"
                        optionFilterProp="name"
                        filterOption={(input, option) =>
                          option.props.children[0].key
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {this.props.users.data &&
                        this.props.users.data.length > 0
                          ? this.props.users.data.map(item => {
                              if (!this.state.selectedUsers.includes(item.id)) {
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
                              }
                            })
                          : []}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
            )}
            {/* dobavljac produkt kupac */}
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label="Dobavljač"
                  validateStatus={supplierError ? "error" : ""}
                  help={supplierError || ""}
                >
                  {getFieldDecorator("supplier", {
                    initialValue: this.setInitialValue("supplier", "product"), //this.props.supplier || null,
                    rules: [
                      { required: true, message: "Odaberite dobavljača!" }
                    ]
                  })(
                    <Select
                    allowClear={true}
                      onSelect={this.supplierSelected}
                      disabled={this.props.suppliers.loading}
                      mode="single"
                      showSearch
                      style={{ width: 200 }}
                      placeholder="Odaberite dobavljača"
                      optionFilterProp="name"
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {this.state.suppliers && this.state.suppliers.length > 0
                        ? this.state.suppliers.map(item => (
                            <Option value={item.id} key={item.id + "_supplier"}>
                              {item.name}
                            </Option>
                          ))
                        : []}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Proizvod"
                  validateStatus={productError ? "error" : ""}
                  help={productError || ""}
                >
                  {getFieldDecorator("product", {
                    initialValue: this.setInitialValue("product", "supplier"), //this.props.product || null,
                    rules: [{ required: true, message: "Odaberite proizvod!" }]
                  })(
                    <Select
                      allowClear={true}
                      onSelect={this.productSeleted}
                      disabled={this.props.products.loading}
                      mode="single"
                      showSearch
                      style={{ width: 200 }}
                      placeholder="Odaberite proizvod"
                      optionFilterProp="name"
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {this.state.products && this.state.products.length > 0
                        ? this.state.products.map(item => (
                            <Option value={item.id} key={item.id + "_product"}>
                              {item.name}
                            </Option>
                          ))
                        : []}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Kupac"
                  validateStatus={customerError ? "error" : ""}
                  help={customerError || ""}
                >
                  {getFieldDecorator("customer", {
                    initialValue: this.props.customer || null,
                    rules: [{ required: true, message: "Odaberite kupca!" }]
                  })(
                    <Select
                      mode="single"
                      showSearch
                      style={{ width: 200 }}
                      placeholder="Odaberite kupca"
                      optionFilterProp="name"
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {this.props.customers.data &&
                      this.props.customers.data.length > 0
                        ? this.props.customers.data.map(item => (
                            <Option value={item.id} key={item.id + "_customer"}>
                              {item.name}
                            </Option>
                          ))
                        : []}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label="Vrijeme Sastanka"
                  validateStatus={startTimeError ? "error" : ""}
                  help={startTimeError || ""}
                >
                  {getFieldDecorator("start_time", {
                    initialValue: this.props.edit
                      ? moment(this.props.startDate)
                      : moment(new Date().toDateString()),
                    rules: [
                      {
                        required: true,
                        message: "Odaberite vrijeme pocetka sastanka!"
                      }
                    ]
                  })(
                    <DatePicker
                      format="YYYY-MM-DD HH:mm"
                      showTime={true}
                      placeholder="Odaberite vrijeme..."
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Vrijeme trajanja sastanka"
                  validateStatus={durationTimeError ? "error" : ""}
                  help={durationTimeError || ""}
                >
                  {getFieldDecorator("durationTime", {
                    initialValue: this.props.edit
                      ? moment(this.props.durationTime, "HH:mm")
                      : moment("01:00", "HH:mm"),
                    rules: [
                      {
                        required: true,
                        message: "Odaberite vrijeme trajanja sastanka!"
                      }
                    ]
                  })(<TimePicker format="HH:mm" />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Tip sastanka"
                  validateStatus={meetingType ? "error" : ""}
                  help={meetingType || ""}
                >
                  {getFieldDecorator("type", {
                    initialValue: this.props.type || 1,
                    rules: [
                      {
                        required: true,
                        message: "Odaberite vrijeme trajanja sastanka!"
                      }
                    ]
                  })(
                    <Radio.Group buttonStyle="solid">
                      <Radio.Button value={1}>Face To Face</Radio.Button>
                      <Radio.Button value={2}>Video</Radio.Button>
                    </Radio.Group>
                  )}
                </Form.Item>
              </Col>
            </Row>

            {this.props.form.getFieldValue("type") === 2 ? (
              <Row>
                <Col span={24} push={12}>
                  <Form.Item
                    label="Podtip sastanka"
                    validateStatus={meetingType ? "error" : ""}
                    help={meetingType || ""}
                  >
                    {getFieldDecorator("subtype", {
                      initialValue: this.props.subtype || 1,
                      rules: [
                        {
                          required: true,
                          message: "Odaberite vrijeme trajanja sastanka!"
                        }
                      ]
                    })(
                      <Radio.Group buttonStyle="solid">
                        {this.props.subTypes.map(item => (
                          <Radio.Button value={item.id}>
                            {item.name}
                          </Radio.Button>
                        ))}
                      </Radio.Group>
                    )}
                  </Form.Item>
                </Col>
              </Row>
            ) : null}

            <Row gutter={16}>
              {this.state.addPlaceWarning.key !== null ? newPlaceWarming : null}
              <Col span={12}>
                <Row type="flex" align="middle">
                  <Col span={21}>
                    {" "}
                    <Form.Item
                      label="Odaberite grad"
                      validateStatus={cityError ? "error" : ""}
                      help={cityError || ""}
                    >
                      {getFieldDecorator("city", {
                        initialValue: this.props.city || null,
                        rules: [
                          {
                            required: true,
                            message: "Odaberite grad!"
                          }
                        ]
                      })(
                        <Select
                          allowClear={true}
                          onSelect={this.citySelected}
                          mode="single"
                          showSearch
                          placeholder="Odaberite grad"
                          optionFilterProp="name"
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {this.state.cities && this.state.cities.length > 0
                            ? this.state.cities.map(item => (
                                <Option value={item.id} key={item.id + "_city"}>
                                  {item.name}
                                </Option>
                              ))
                            : []}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={3}>
                    {" "}
                    {/*dodaj novo mjesto*/}{" "}
                    {!this.props.edit ? (
                      <Button
                        style={{ marginBottom: "5px" }}
                        icon="plus"
                        type=""
                        size="default"
                        disabled={this.props.form.getFieldValue("city")}
                        onClick={() => this.addPlaceOfMeeting("city")}
                      />
                    ) : null}
                  </Col>
                </Row>
              </Col>
              <Col span={12}>
                <Row type="flex" align="middle">
                  <Col span={21}>
                    {" "}
                    <Form.Item
                      label="Odaberite ulicu"
                      validateStatus={streetError ? "error" : ""}
                      help={streetError || ""}
                    >
                      {getFieldDecorator("street", {
                        initialValue: this.setInitialValue("street", "city"),
                        rules: [
                          {
                            required: true,
                            message: "Odaberite ulicu sastanka!"
                          }
                        ]
                      })(
                        <Select
                          onSelect={this.streetSelected}
                          mode="single"
                          allowClear={true}
                          showSearch
                          placeholder="Odaberite ulicu"
                          optionFilterProp="name"
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {this.state.streets && this.state.streets.length > 0
                            ? this.state.streets
                                .filter(
                                  this.filterForForm.bind(
                                    this,
                                    this.props.city,
                                    "city"
                                  )
                                )
                                .map(item => (
                                  <Option
                                    value={item.id}
                                    key={item.id + "_street"}
                                  >
                                    {item.name}
                                  </Option>
                                ))
                            : []}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={3}>
                    {" "}
                    {/*dodaj novo mjesto*/}{" "}
                    {!this.props.edit ? (
                      <Button
                        style={{ marginBottom: "5px" }}
                        icon="plus"
                        type=""
                        size="default"
                        disabled={this.props.form.getFieldValue("street")}
                        onClick={() => this.addPlaceOfMeeting("street")}
                      />
                    ) : null}
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Row type="flex" align="middle">
                  <Col span={21}>
                    {" "}
                    <Form.Item
                      label="Odaberite objekat"
                      validateStatus={locationError ? "error" : ""}
                      help={locationError || ""}
                    >
                      {getFieldDecorator("location", {
                        initialValue: this.setInitialValue(
                          "location",
                          "street"
                        ),
                        rules: [
                          {
                            required: true,
                            message: "Odaberite lokaciju za sastanke!"
                          }
                        ]
                      })(
                        <Select
                          onSelect={this.locationSelected}
                          mode="single"
                          allowClear={true}
                          showSearch
                          placeholder="Odaberite objekt"
                          optionFilterProp="name"
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {this.state.locations &&
                          this.state.locations.length > 0
                            ? this.state.locations
                                .filter(
                                  this.filterForForm.bind(
                                    this,
                                    this.props.street,
                                    "street"
                                  )
                                )
                                .map(item => (
                                  <Option
                                    value={item.id}
                                    key={item.id + "_location"}
                                  >
                                    {item.name}
                                  </Option>
                                ))
                            : []}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={3}>
                    {" "}
                    {/*dodaj novo mjesto*/}{" "}
                    {!this.props.edit ? (
                      <Button
                        style={{ marginBottom: "5px" }}
                        icon="plus"
                        type=""
                        size="default"
                        disabled={this.props.form.getFieldValue("location")}
                        onClick={() => this.addPlaceOfMeeting("location")}
                      />
                    ) : null}
                  </Col>
                </Row>
              </Col>
              <Col span={12}>
                <Row type="flex" align="middle">
                  <Col span={21}>
                    <Form.Item
                      label="Odaberite sobu"
                      validateStatus={roomError ? "error" : ""}
                      help={roomError || ""}
                    >
                      {getFieldDecorator("room", {
                        initialValue: this.setInitialValue("room", "location"),
                        rules: [
                          {
                            required: true,
                            message: "Odaberite sobu za sastanke!"
                          }
                        ]
                      })(
                        <Select
                          mode="single"
                          allowClear={true}
                          showSearch
                          placeholder="Odaberite sobu"
                          optionFilterProp="name"
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {this.state.rooms && this.state.rooms.length > 0
                            ? this.state.rooms
                                .filter(
                                  this.filterForForm.bind(
                                    this,
                                    this.props.location,
                                    "location"
                                  )
                                )
                                .map(item => (
                                  <Option
                                    value={item.id}
                                    key={item.id + "_room"}
                                  >
                                    {item.name}
                                  </Option>
                                ))
                            : []}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={3}>
                    {" "}
                    {/*dodaj novo mjesto*/}{" "}
                    {!this.props.edit ? (
                      <Button
                        style={{ marginBottom: "5px" }}
                        icon="plus"
                        type=""
                        size="default"
                        disabled={this.props.form.getFieldValue("room")}
                        onClick={() => this.addPlaceOfMeeting("room")}
                      />
                    ) : null}
                  </Col>
                </Row>
              </Col>
            </Row>
            {this.props.edit ? null : (
              <Row gutter={16}>
                <Col span={16}>
                  <Form.Item>
                    <Upload
                      beforeUpload={this.beforeUpload}
                      onRemove={this.removeFile}
                      multiple={true}
                      showUploadList={true}
                    >
                      <Button>
                        <Icon type="upload" /> Click to Upload
                      </Button>
                    </Upload>
                  </Form.Item>
                </Col>
              </Row>
            )}

            <Button
              type="primary"
              htmlType="submit"
              disabled={hasErrors(getFieldsError())}
            >
              {this.props.edit ? "Uredi" : "Spremi Sastanak"}
            </Button>
          </Form>
        </div>
      );
    if (this.state.visibleAddNewTitle) {
      return addTitle;
    }

    return this.state.visibleAddPlaceOfMeeting
      ? addPlaceOfMeeting
      : createMeeting;
  }
}

const mapDispatchToProps = dispatch => {
  return {
    // onGetPrepareMeetings: () => dispatch({ type: actions.GET_PREPARE_MEETING }),
    onGetProducts: supplierID =>
      dispatch({ type: actions.GET_PRODUCTS, supplierID: supplierID }),
    onGetSuppliers: productID =>
      dispatch({ type: actions.GET_SUPPLIERS, productID: productID }),
    onSaveNewPlace: (values, addType, callback) =>
      dispatch({ type: actions.SAVE_NEW_PLACE, values, addType, callback }),
    onSaveNewTitle: (values, callback) =>
      dispatch({ type: actions.SAVE_NEW_TITLE, values, callback })
  };
};

const mapStateToProps = state => {
  return {
    prepareMeeting: state.prepareMeetingsReducer.prepareMeeting,
    titles: state.prepareMeetingsReducer.titles,
    customers: state.prepareMeetingsReducer.customers,
    countries: state.prepareMeetingsReducer.countries,
    users: state.prepareMeetingsReducer.users,
    cities: state.prepareMeetingsReducer.cities,
    streets: state.prepareMeetingsReducer.streets,
    locations: state.prepareMeetingsReducer.locations,
    rooms: state.prepareMeetingsReducer.rooms,
    products: state.prepareMeetingsReducer.products,
    suppliers: state.prepareMeetingsReducer.suppliers,
    saveNewPlace: state.prepareMeetingsReducer.saveNewPlace,
    addTitle: state.prepareMeetingsReducer.saveNewTitle,
    subTypes: state.prepareMeetingsReducer.subTypes
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form.create()(CreateMeetingForm));
