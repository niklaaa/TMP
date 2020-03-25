import React, { Component } from "react";

import { connect } from "react-redux";

import css from "./Meeting.module.scss";

import { Col, Row, Drawer, Icon, Button, Typography, Tabs } from "antd";

import * as actions from "../../redux/modules/Meetings/actions";
import {GET_ALL_USERS} from "../../redux/modules/Users/actions";

import MeetingTimeView from "./components/MeetingTimeView";
import Header from "./components/Header";
import UserPanel from "./components/UserPanel";
import Spinner from "../../components/LoadingScreen";
import Commands from "./components/Commands";
import CreateMeetingForm from "../Meetings/componrnts/CreateMeetingForm";
import Notes from "./components/Notes";
import Task from "./components/Task";
import AddUsers from "./components/AddUsers";
import Documents from "./components/Documents";
import Links from "./components/Links";
import MeetingUser from "./components/MeetingUser";

import moment from "moment";

const { Paragraph } = Typography;

const { TabPane } = Tabs;

class Meeting extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    visibleUserPanel: false,
    visibleUpdateMeeting: false,

    user: {
      // info about invited user
      user: {} // user info
    },
    addUserVisible: false,
    addusersFlag: null,
    resetForm: false
  };

  componentDidUpdate(prevProps) {
    if (prevProps.userCommand.status !== this.props.userCommand.status) {
      if (this.props.userCommand.status === "OK") {
        this.setState({ visibleUserPanel: false });
      }
    }
  }

  componentDidMount() {
    this.props.onGetMeeting(this.props.match.params.id);
  }

  updateDocuments = data => {
    data.append("meeting_id", this.props.meeting.data.id);
    this.props.onUpdateDocuments(data);
  };

  removeDocument = id => {
    this.props.onRemoveDocument(id);
  };

  transferUser = user => {
    this.props.onTransferUser(user);
  };

  closeUserPanel = () => {
    this.setState({ visibleUserPanel: false });
  };

  addUsersForm = flag => {
    this.props.onGetUsers(this.props.meeting.data.id);
    this.setState({ addUserVisible: true, addusersFlag: flag });
  };

  onCloseUpdateMeeting = () => {
    this.setState({ visibleUpdateMeeting: false });
  };

  onEditMeeting = () => {
    this.setState({
      visibleUpdateMeeting: true,
      resetForm: !this.state.resetForm
    });
    this.props.onGetPrepareMeetings();
  };

  openUserPanel = id => {
    const user = this.props.meeting.data.users.find(
      item => item.user.id === id
    );
    this.setState({ user: user });
    // setTimeout(() => {
    // }, 0);
    // this.setState({ user: user });
    this.setState({ visibleUserPanel: true });
  };

  removeUser = id => {
    this.props.onRemoveUser(id);
  };

  addUsers = users => {
    const data = {
      users,
      meeting_id: this.props.meeting.data.id,
      type: this.state.addusersFlag // means is add participiants or exhibitors
    };
    this.props.onSaveNewUsers(data, this.onAddUserClose.bind(this));
  };

  editMeeting = meeting => {
    const data = {
      meeting,
      meeting_id: this.props.meeting.data.id
    };
    this.props.onEditMeetingRequest(data);
    this.setState({ visibleUpdateMeeting: false });
  };

  onAddUserClose = () => {
    this.setState({
      addUserVisible: false
    });
  };

  destroyLastOpendMeeting = () => {
    this.props.onDestroyLastOpendMeeting();
  };

  createTask = data => {
    const _data = { ...data, meeting: this.props.meeting.data.id };
    this.props.onCreateTask(_data);
  };

  createNote = data => {
    const _data = { ...data, note_id: this.props.meeting.data.note.id };
    this.props.onCreateNote(_data);
  };

  createLink = data => {
    const _data = { ...data, meeting: this.props.meeting.data.id };
    this.props.onCreateLink(_data);
  };

  removeLink = id => {
    this.props.onRemoveLink(id);
  };

  startMeeting = invited_users => {
    this.props.onStartMeeting(this.props.meeting.data.id, invited_users);
  };

  startMeetingAfterPause = (invited_users, callback) => {
    this.props.onStopPauseMeeting(
      { meeting: this.props.meeting.data.id, invited_users },
      callback
    );
  };

  pauseMeeting = () => {
    this.props.onPauseMeeting(this.props.meeting.data.id);
  };

  stopMeeting = () => {
    this.props.onStopMeeting(this.props.meeting.data.id);
  };

  userAway = invited_user_id => {
    this.props.onUserAway(invited_user_id);
  };

  userStart = invited_user_id => {
    this.props.onUserStart(invited_user_id);
  };

  userPause = invited_user_id => {
    this.props.onPauseUser(invited_user_id);
  };

  stopUserPause = invited_user_id => {
    this.props.onStopUserPause(invited_user_id);
  };

  swapUsers = () => {
    this.props.onSwapUsers(
      this.props.meeting.data.id,
      this.closeUserPanel.bind(this)
    );
  };

  userLeave = invited_user_id => {
    this.props.onLeaveUser(invited_user_id);
  };

  getAllUsers = key => {
    if (key === "1_task") {
      this.props.onGetAllUsers();
    }
  };

  render() {
    const { data, loading } = this.props.meeting;

    let isExhibitor = loading
      ? 0
      : data.users.find(item => item.user.id === this.props.userID);
    if (isExhibitor) {
      isExhibitor = isExhibitor.exhibitor === 1 ? 1 : 0;
    }

    isExhibitor = 1;

    data.planned_start = moment(data.planned_start);
    data.planned_end = moment(data.planned_end);

    const addUsers = (
      <AddUsers
        loading={this.props.users.loading}
        saveLoading={this.props.users.saveLoading}
        visible={this.state.addUserVisible}
        users={this.props.users.data}
        onCancel={this.onAddUserClose}
        action={this.addUsers}
        status={this.props.users.status}
        title={
          this.state.addusersFlag
            ? "Odaberite izlagače sastanka"
            : "Odaberite sudionike sastanka"
        }
      />
    );


    return loading ? (
      <Spinner />
    ) : (
      <React.Fragment>
        <Row className={css.meetingHeader}>
          <Col span={8}>
            <Header meeting={data} onEditMeeting={this.editMeeting} />

            <Paragraph>{data.description}</Paragraph>
            {data.status < 2 ? (
              <div
                style={{ marginTop: "10px", position: "relative", bottom: "0" }}
              >
                {isExhibitor ? (
                  <Button icon="edit" onClick={this.onEditMeeting} />
                ) : null}
              </div>
            ) : null}
          </Col>
          <Col span={16}>
            <Row justify="center">
              <Col span={12} id="commands">
                {isExhibitor ? (
                  <Commands
                    command={this.props.command}
                    startMeeting={this.startMeeting}
                    startMeetingAfterPause={this.startMeetingAfterPause}
                    pauseMeeting={this.pauseMeeting}
                    stopMeeting={this.stopMeeting}
                    meeting={data}
                    type="meeting"
                  />
                ) : null}
              </Col>
              <Col push={4} span={12}>
                <MeetingTimeView
                  destroyLastOpendMeeting={this.destroyLastOpendMeeting}
                  meeting={data}
                  type="vertical"
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className={css.participants}>
          <Col span={9}>
            <h3>
              Izlagaci{" "}
              {data.status < 2 && isExhibitor === 1 ? (
                <Button
                  type=""
                  icon="plus"
                  size="default"
                  onClick={this.addUsersForm.bind(this, 1)}
                />
              ) : null}
            </h3>
            {data.users && data.users.length > 0
              ? data.users
                  .filter(item => item.exhibitor === 1)
                  .map(item => (
                    <MeetingUser
                      key={item.invited_user_id + "Meetinguser"}
                      removeUser={this.removeUser}
                      openUserPanel={this.openUserPanel}
                      isExhibitor={isExhibitor}
                      meeting={data}
                      user={item}
                      css={css}
                      exhibitor={item.exhibitor}
                    />
                  ))
              : null}
          </Col>
          <Col span={15}>
            <h3>
              Sudionici{" "}
              {data.status < 2 && isExhibitor === 1 ? (
                <Button
                  type=""
                  icon="plus"
                  size="default"
                  onClick={this.addUsersForm.bind(this, 0)}
                />
              ) : null}
            </h3>
            {data.users && data.users.length > 0
              ? data.users
                  .filter(item => item.exhibitor === 0)
                  .map(item => (
                    <MeetingUser
                      key={item.invited_user_id + "Meetinguser"}
                      removeUser={this.removeUser}
                      openUserPanel={this.openUserPanel}
                      isExhibitor={isExhibitor}
                      meeting={data}
                      user={item}
                      css={css}
                      exhibitor={item.exhibitor}
                    />
                  ))
              : null}
            {addUsers}
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Tabs onTabClick={this.getAllUsers} defaultActiveKey="3_documents">
              <TabPane tab="Dokumenti" key="3_documents">
                <Documents
                  document={this.props.document}
                  documents={data.documents}
                  updateDocuments={this.updateDocuments}
                  removeDocument={this.removeDocument}
                  meetingStatus={data.status}
                  isExhibitor={isExhibitor}
                />
              </TabPane>
              <TabPane tab="Links" key="3_Links">
                <Links
                  createLink={this.createLink}
                  meeting={data}
                  link={this.props.link}
                  removeLink={this.removeLink}
                />
              </TabPane>
              <TabPane disabled={data.status < 2} tab="Zadaci" key="1_task">
                <Task
                  isExhibitor={isExhibitor}
                  users={data.users}
                  allUsers={this.props.allUsers}
                  meetingStatus={data.status}
                  createTask={this.createTask}
                  task={this.props.task}
                  tasks={data.tasks}
                />
              </TabPane>
              <TabPane disabled={data.status < 2} tab="Biljeske" key="2_notes">
                <Notes
                  createNote={this.createNote}
                  meeting={data}
                  note={this.props.note}
                  isExhibitor={isExhibitor}
                  meetingStatus={data.status}
                />
              </TabPane>
            </Tabs>
          </Col>
        </Row>

        <Drawer
          width={720}
          visible={this.state.visibleUpdateMeeting}
          onClose={this.onCloseUpdateMeeting}
          title={
            <span>
              <Icon type="snippets" theme="twoTone" /> Uredi Sastanak
            </span>
          }
        >
          <CreateMeetingForm
            edit={true}
            onSubmit={this.editMeeting}
            title={data.title.id}
            description={data.description}
            supplier={data.supplier.id}
            product={data.product.id}
            customer={data.customer.id}
            startDate={data.planned_start}
            durationTime={moment
              .duration(data.planned_end.diff(data.planned_start))
              .asHours()}
            city={data.city.id}
            street={data.street.id}
            location={data.location.id}
            room={data.room.id}
            type={data.type}
            reset={this.state.resetForm}
            closeForm={this.props.closeForm}
            close={this.onCloseUpdateMeeting}
            error={this.props.createMeetingError}
            formRequestLoading={this.props.formRequestLoading}
          />
        </Drawer>
        <Drawer
          width={720}
          visible={this.state.visibleUserPanel}
          onClose={this.closeUserPanel}
          title={
            <span>
              <Icon type="user" /> {this.state.user.user.name || ""}
            </span>
          }
          destroyOnClose={true}
        >
          <UserPanel
            transferUser={this.transferUser}
            transfer={this.props.transfer}
            user={this.state.user}
            close={this.closeUserPanel}
            userCommand={this.props.userCommand}
            meeting={data}
            userAway={this.userAway}
            userStart={this.userStart}
            userPause={this.userPause}
            stopUserPause={this.stopUserPause}
            swap={this.swapUsers}
            leave={this.userLeave}
          />
        </Drawer>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onGetMeeting: id => dispatch({ type: actions.MEETING, id }),
    onGetPrepareMeetings: () => dispatch({ type: actions.GET_PREPARE_MEETING }),
    onRemoveUser: invited_user_id =>
      dispatch({ type: actions.REMOVE_USER, id: invited_user_id }),
    onGetUsers: id => dispatch({ type: actions.GET_USERS, meeting_id: id }),
    onSaveNewUsers: (data, callback) =>
      dispatch({ type: actions.SAVE_NEW_USERS, data, callback }),
    onTransferUser: data => dispatch({ type: actions.TRANSFER_USER, data }),
    onRemoveDocument: id => dispatch({ type: actions.REMOVE_DOCUMENT, id }),
    onUpdateDocuments: data =>
      dispatch({ type: actions.UPDATE_DOCUMENTS, data }),
    onEditMeetingRequest: data =>
      dispatch({ type: actions.UPDATE_MEETING, data }),
    onDestroyLastOpendMeeting: () =>
      dispatch({ type: actions.DESTROY_LAST_OPEND_MEETING }),
    onCreateTask: data => dispatch({ type: actions.CREATE_TASK, data }),
    onStartMeeting: id => dispatch({ type: actions.START_MEETING, id }),
    onPauseMeeting: id => dispatch({ type: actions.PAUSE_MEETING, id }),
    onStopPauseMeeting: (data, callback) =>
      dispatch({ type: actions.STOP_PAUSE_MEETING, data, callback: callback }),
    onStopMeeting: meeting => dispatch({ type: actions.END_MEETING, meeting }),
    onUserAway: invited_user_id =>
      dispatch({ type: actions.AWAY, invited_user_id }),
    onUserStart: invited_user_id =>
      dispatch({ type: actions.USER_START, invited_user_id }),
    onPauseUser: invited_user_id =>
      dispatch({ type: actions.USER_PAUSE, invited_user_id }),
    onCreateNote: data => dispatch({ type: actions.NOTE, data }),
    onCreateLink: data => dispatch({ type: actions.LINK, data }),
    onRemoveLink: id => dispatch({ type: actions.REMOVE_LINK, id }),
    onStopUserPause: invited_user_id =>
      dispatch({ type: actions.STOP_USER_PAUSE, invited_user_id }),
    onSwapUsers: (meeting, callback) =>
      dispatch({ type: actions.SWAP_USERS, meeting, callback }),
    onLeaveUser: invited_user_id =>
      dispatch({ type: actions.LEAVE, invited_user_id }),
    onGetAllUsers: () => dispatch({ type: GET_ALL_USERS })
  };
};

const mapStateToProps = state => {
  return {
    meeting: state.meetingReducer.meeting,
    removeUserLoading: state.meetingReducer.meeting.removeUserLoading,
    users: state.meetingReducer.users,
    transfer: state.meetingReducer.transfer,
    document: state.meetingReducer.documents,
    createMeetingError: state.meetingReducer.udpateMeeting.error,
    closeForm: state.meetingReducer.udpateMeeting.closeForm,
    formRequestLoading: state.meetingReducer.udpateMeeting.loading,
    userID: state.usersReducer.user.data.id,
    task: state.meetingReducer.task,
    command: state.meetingReducer.command,
    userCommand: state.meetingReducer.userCommand,
    note: state.meetingReducer.note,
    link: state.meetingReducer.link,
    allUsers: state.usersReducer.users
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Meeting);
