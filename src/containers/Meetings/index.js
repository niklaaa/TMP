import React, { Component } from "react";

import { connect } from "react-redux";
import * as actions from "../../redux/modules/Meetings/actions";
import history from "../../history";

// AntDesign Components
import { PageHeader, Drawer, Icon, Button, Divider, Row, Col } from "antd";

import CreateMeetingForm from "./componrnts/CreateMeetingForm";
import MeetingsList from "./componrnts/MeetingsList";
import Spinner from "../../components/LoadingScreen";

 

class Meetings extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    visible: false,
    resetForm: false
  };

  componentDidMount() {
    this.props.onGetMeetings();
  }

  onClose = () => {
    this.setState({ visible: false });
  };

  onCreateButtonClick = () => {
    this.props.onGetPrepareMeetings();
    this.setState({ resetForm: !this.state.resetForm });
    this.setState({
      visible: true
    });
  };

  submitNewMeeting = meeting => {
    this.props.onCreateMeeting(meeting);
  };

  render() {

    return (
      <div>
        <div>
          <Button
            type={"primary"}
            icon={"plus"}
            onClick={() => this.onCreateButtonClick()}
          >
            Novi Sastanak
          </Button>
        </div>
        <Divider />

        <Row gutter={8}>
          <Col span={8}>
            {this.props.loading ? (
              <Spinner />
            ) : (
              <MeetingsList
                key={0 + "_meetingList"}
                meetings={
                  this.props.meetings.data &&
                  this.props.meetings.data.length > 0
                    ? this.props.meetings.data.filter(item => item.status < 2)
                    : null
                }
                title="Planirani sastanci"
              />
            )}
          </Col>
          <Col span={8}>
            {this.props.loading ? (
              <Spinner />
            ) : (
              <MeetingsList
                key={1 + "_meetingList"}
                meetings={
                  this.props.meetings.data &&
                  this.props.meetings.data.length > 0
                    ? this.props.meetings.data.filter(item => item.status === 2)
                    : null
                }
                title={"U tijeku sastanci"}
              />
            )}
          </Col>
          <Col span={8}>
            {this.props.loading ? (
              <Spinner />
            ) : (
              <MeetingsList
                key={2 + "_meetingList"}
                meetings={
                  this.props.meetings.data &&
                  this.props.meetings.data.length > 0
                    ? this.props.meetings.data.filter(item => item.status === 3)
                    : null
                }
                title="Zavrseni sastanci"
              />
            )}
          </Col>
        </Row>
        <Drawer
          width={720}
          visible={this.state.visible}
          onClose={this.onClose}
          title={
            <span>
              <Icon type="snippets" theme="twoTone" /> Novi Sastanak
            </span>
          }
        >
          <CreateMeetingForm
            closeForm={this.props.closeForm}
            close={this.onClose}
            error={this.props.createMeetingError}
            reset={this.state.resetForm}
            onSubmit={this.submitNewMeeting}
            formRequestLoading={this.props.formRequestLoading}
          />
        </Drawer>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onGetMeetings: () => dispatch({ type: actions.GET_DATA }),
    onGetPrepareMeetings: () => dispatch({ type: actions.GET_PREPARE_MEETING }),
    onCreateMeeting: meeting =>
      dispatch({ type: actions.CREATE_MEETING, meeting: meeting })
  };
};

const mapStateToProps = state => {
  return {
    meetings: state.meetingsReducer.meetings,
    loading: state.meetingsReducer.meetings.loading,
    createMeetingError: state.createMeetingReducer.error,
    closeForm: state.createMeetingReducer.closeForm,
    formRequestLoading: state.createMeetingReducer.loading,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Meetings);
