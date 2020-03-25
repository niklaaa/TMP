import {
  takeLatest,
  call,
  put,
  select,
  takeEvery,
  delay
} from "redux-saga/effects";
import axios from "../../../axios/axios-meetings";

import setRealStartForUsers from "../../../Helpers/setRealDateTimeUsers";

import * as actions from "./actions";
import {
  DESTROY_TOKEN_FOR_REDIRECT,
  SET_TOKEN_FROM_LOCALE_STORAGE
} from "../Users/actions";

const initialState = {
  meeting: {
    data: {},
    loading: true,
    removeUserLoading: false,
    error: null
  },

  users: {
    // used in update participants
    data: {},
    loading: true,
    error: null
  },
  transfer: {
    loading: false,
    error: null,
    status: ""
  },
  documents: {
    removeLoading: false,
    updateLoading: false,
    error: null,
    status: ""
  },
  udpateMeeting: {
    loading: false,
    error: null,
    status: "",
    closeForm: false
  },
  task: {
    loading: false,
    error: null,
    status: "",
    data: {}
  },
  command: {
    loading: false,
    error: null,
    status: ""
  },
  userCommand: {
    loading: false,
    error: null,
    status: ""
  },
  note: {
    laoding: false,
    error: null
  },
  link: {
    addLoading: false,
    removeLoading: false,
    errorRemove: null,
    errorAdd: null
  }
};

export default function reducer(state = initialState, action = {}) {
  let tmp = {};
  switch (action.type) {
    case actions.MEETING:
      return {
        ...state,
        meeting: { data: {}, loading: true, error: null }
      };
    case actions.MEETING_SUCCESS:
      tmp = setRealStartForUsers(action.data);
      return {
        ...state,
        meeting: { data: tmp, loading: false, error: null }
      };
    case actions.MEETING_FAIL:
      return {
        ...state,
        meeting: {
          data: {},
          loading: false,
          error: action.error
        }
      };
    case actions.REMOVE_USER:
      return {
        ...state,
        meeting: {
          data: state.meeting.data,
          loading: false,
          removeUserLoading: action.id,
          error: action.error
        }
      };
    case actions.REMOVE_USER_FAIL:
      return {
        ...state,
        meeting: {
          data: Object.create(state.meeting.data),
          loading: false,
          removeUserLoading: false,
          error: action.error
        }
      };
    case actions.REMOVE_USER_SUCCESS:
      const data = state.meeting.data;
      const index = data.users.findIndex(
        item => item.invited_user_id === action.data.invited_user_id
      );
      data.users.splice(index, 1);

      return {
        ...state,
        meeting: {
          data: data,
          loading: false,
          removeUserLoading: false,
          error: action.error
        }
      };
    case actions.GET_USERS:
      return {
        ...state,
        users: {
          data: {},
          loading: true,
          error: null
        }
      };
    case actions.GET_USERS_FAIL:
      return {
        ...state,
        users: {
          data: {},
          loading: false,
          error: action.error
        }
      };
    case actions.GET_USERS_SUCCESS:
      return {
        ...state,
        users: {
          data: action.data.users,
          loading: false,
          error: null
        }
      };
    case actions.SAVE_NEW_USERS:
      return {
        ...state,
        users: {
          data: [],
          saveLoading: true,
          error: null,
          status: ""
        }
      };
    case actions.SAVE_NEW_USERS_SUCCESS:
      tmp = { ...state.meeting };
      tmp.data.users = action.data.users;
      return {
        ...state,
        meeting: tmp,
        users: {
          data: [],
          saveLoading: false,
          error: null,
          status: "OK"
        }
      };
    case actions.SAVE_NEW_USERS_FAIL:
      return {
        ...state,
        users: {
          data: [],
          saveLoading: false,
          error: action.error,
          status: "FAIL"
        }
      };
    case actions.TRANSFER_USER:
      return {
        ...state,
        transfer: {
          loading: true,
          error: null,
          status: ""
        }
      };
    case actions.TRANSFER_USER_SUCCESS:
      console.log(action.data);
      const users = state.meeting.data.users.concat();
      const c_meeting = { ...state.meeting };
      c_meeting.users = users.map(item => {
        if (item.invited_user_id === +action.data.invited_user_id) {
          item.exhibitor = action.data.type;
        }
      });

      return {
        ...state,
        meeting: c_meeting,
        transfer: {
          loading: false,
          error: null,
          status: "OK"
        }
      };
    case actions.TRANSFER_USER_FAIL:
      return {
        ...state,
        transfer: {
          loading: false,
          error: action.error,
          status: "FAIL"
        }
      };

    case actions.REMOVE_DOCUMENT:
      return {
        ...state,
        documents: {
          updateLoading: false,
          removeLoading: action.id,
          error: null,
          removeStatus: "",
          updateStatus: ""
        }
      };
    case actions.REMOVE_DOCUMENT_FAIL:
      return {
        ...state,
        documents: {
          updateLoading: false,
          removeLoading: false,
          error: action.error,
          removeStatus: "FAIL",
          updateStatus: ""
        }
      };
    case actions.REMOVE_DOCUMENT_SUCCESS:
      const tmpMeeting = { ...state.meeting };
      tmpMeeting.data.documents.splice(
        tmpMeeting.data.documents.findIndex(item => item.id === action.data),
        1
      );
      return {
        ...state,
        meeting: tmpMeeting,
        documents: {
          updateLoading: false,
          removeLoading: false,
          error: null,
          removeStatus: "OK",
          updateStatus: ""
        }
      };

    case actions.UPDATE_DOCUMENTS:
      return {
        ...state,
        documents: {
          updateLoading: true,
          removeLoading: false,
          error: null,
          removeStatus: "",
          updateStatus: ""
        }
      };
    case actions.UPDATE_DOCUMENTS_SUCCESS:
      const tmpMeeting_d = { ...state.meeting };
      tmpMeeting_d.data.documents = action.data;
      return {
        ...state,
        meeting: tmpMeeting_d,
        documents: {
          updateLoading: false,
          removeLoading: false,
          error: null,
          removeStatus: "",
          updateStatus: "OK"
        }
      };
    case actions.UPDATE_DOCUMENTS_FAIL:
      return {
        ...state,
        documents: {
          updateLoading: false,
          removeLoading: false,
          error: action.error,
          removeStatus: "",
          updateStatus: "FAIL"
        }
      };

    case actions.UPDATE_MEETING:
      return {
        ...state,
        udpateMeeting: {
          loading: true,
          error: null,
          status: "",
          closeForm: false
        }
      };
    case actions.UPDATE_MEETING_SUCCESS:
      return {
        ...state,
        udpateMeeting: {
          loading: false,
          error: null,
          status: "OK",
          closeForm: true
        }
      };
    case actions.UPDATE_MEETING_FAIL:
      return {
        ...state,
        udpateMeeting: {
          loading: false,
          error: null,
          status: "FAIL",
          closeForm: false
        }
      };
    case actions.DESTROY_LAST_OPEND_MEETING_PROCEED:
      // if it is not destroyed after click on some another meeting first will be render of old meeting until new meeting data comes from API
      return {
        ...state,
        meeting: {
          data: {},
          error: false,
          loading: true
        }
      };
    case actions.CREATE_TASK:
      return {
        ...state,
        task: {
          loading: true,
          error: null,
          status: "",
          data: {}
        }
      };
    case actions.CREATE_TASK_SUCCESS:
      const tmpMeeting_t = { ...state.meeting };
      tmpMeeting_t.data.tasks.push(action.data);
      return {
        ...state,
        meeting: tmpMeeting_t,
        task: {
          loading: false,
          error: null,
          status: "OK",
          data: action.data
        }
      };
    case actions.CREATE_TASK_FAIL:
      return {
        ...state,
        task: {
          loading: false,
          error: action.error,
          status: "FAIL",
          data: {}
        }
      };
    case actions.START_MEETING:
      return {
        ...state,
        command: {
          loading: true,
          error: null,
          status: ""
        }
      };
    case actions.STOP_PAUSE_MEETING:
      return {
        ...state,
        command: {
          loading: true,
          error: null,
          status: ""
        }
      };
    case actions.START_MEETING_SUCCESS:
      const tmpMeeting_s = { ...state.meeting };
      tmpMeeting_s.data.status = 2;
      tmpMeeting_s.data.is_pause = 0;
      tmpMeeting_s.data.real_start = action.data.real_start;
      tmpMeeting_s.data = setRealStartForUsers(tmpMeeting_s.data);
      return {
        ...state,
        meeting: tmpMeeting_s,
        command: {
          loading: false,
          error: null,
          status: "OK"
        }
      };
    case actions.START_MEETING_FAIL:
      return {
        ...state,
        command: {
          loading: false,
          error: action.error,
          status: "FAIL"
        }
      };
    case actions.END_MEETING:
      return {
        ...state,
        command: {
          loading: true,
          error: null,
          status: ""
        }
      };
    case actions.END_MEETING_SUCCESS:
      tmp = { ...state.meeting };
      tmp.data.status = 3;
      tmp.data.real_end = action.data.real_end;
      return {
        ...state,
        meeting: tmp,
        command: {
          loading: false,
          error: null,
          status: "OK"
        }
      };
    case actions.END_MEETING_FAIL:
      return {
        ...state,
        meeting: tmp,
        command: {
          loading: false,
          error: action.error,
          status: "FAIL"
        }
      };
    case actions.PAUSE_MEETING:
      return {
        ...state,
        command: {
          loading: true,
          error: null,
          status: ""
        }
      };
    case actions.PAUSE_MEETING_SUCCESS:
      const tmpMeeting_p = { ...state.meeting };
      tmpMeeting_p.data.is_pause = 1;
      return {
        ...state,
        meeting: tmpMeeting_p,
        command: {
          loading: false,
          error: null,
          status: "OK"
        }
      };
    case actions.PAUSE_MEETING_FAIL:
      return {
        ...state,
        commandTriggered: false,
        command: {
          loading: false,
          error: action.error,
          status: "FAIL"
        }
      };
    case actions.AWAY:
      return {
        ...state,
        userCommand: {
          loading: true,
          error: null,
          status: ""
        }
      };

    case actions.AWAY_SUCCESS:
      const tmpMeeting_au = { ...state.meeting };
      tmpMeeting_au.data.users.find(
        item => item.invited_user_id === action.data.invited_user_id
      ).is_pause = 2;
      return {
        ...state,
        meeting: tmpMeeting_au,
        userCommand: {
          loading: false,
          error: null,
          status: "OK"
        }
      };
    case actions.AWAY_FAIL:
      return {
        ...state,
        userCommand: {
          loading: false,
          error: null,
          status: "FAIL"
        }
      };

    case actions.USER_START:
      return {
        ...state,
        userCommand: {
          loading: true,
          error: null,
          status: ""
        }
      };
    case actions.USER_START_SUCCESS:
      console.log(action.data.invited_user_id, "USER_START_SUCCESS");
      const tmpMeeting_su = { ...state.meeting };
      let user = tmpMeeting_su.data.users.find(
        item => item.invited_user_id === action.data.invited_user_id
      );
      user.is_pause = 0;
      user.start = action.data.start; // datetime
      return {
        ...state,
        meeting: tmpMeeting_su,
        userCommand: {
          loading: false,
          error: null,
          status: "OK"
        }
      };
    case actions.USER_START_FAIL:
      return {
        ...state,
        userCommand: {
          loading: false,
          error: null,
          status: "FAIL"
        }
      };
    case actions.USER_PAUSE:
      return {
        ...state,
        userCommand: {
          loading: true,
          error: null,
          status: ""
        }
      };
    case actions.USER_PAUSE_SUCCESS:
      tmp = { ...state.meeting };
      let user_pu = tmp.data.users.find(
        item => item.invited_user_id === action.data.invited_user_id
      );
      user_pu.is_pause = 1;
      return {
        ...state,
        meeting: tmp,
        userCommand: {
          loading: false,
          error: null,
          status: "OK"
        }
      };
    case actions.USER_PAUSE_FAIL:
      return {
        ...state,
        userCommand: {
          loading: false,
          error: null,
          status: "FAIL"
        }
      };
    case actions.NOTE:
      return {
        ...state,
        note: {
          loading: true,
          error: null
        }
      };
    case actions.NOTE_SUCCESS:
      console.log(action.data);
      const tmpMeeting_n = { ...state.meeting };
      tmpMeeting_n.data.note = action.data;
      return {
        ...state,
        meeting: tmpMeeting_n,
        note: {
          loading: false,
          error: null
        }
      };
    case actions.NOTE_FAIL:
      return {
        ...state,
        note: {
          loading: false,
          error: action.error
        }
      };
    case actions.LINK:
      return {
        ...state,
        link: {
          addLoading: true,
          removeLoading: false,
          errorRemove: null,
          errorAdd: null
        }
      };
    case actions.LINK_SUCCESS:
      tmp = { ...state.meeting };
      tmp.data.links.push(action.data);
      return {
        ...state,
        meeting: tmp,
        link: {
          addLoading: false,
          removeLoading: false,
          errorRemove: null,
          errorAdd: null
        }
      };
    case actions.LINK_FAIL:
      return {
        ...state,
        link: {
          addLoading: false,
          removeLoading: false,
          errorRemove: null,
          errorAdd: action.error
        }
      };
    case actions.REMOVE_LINK:
      return {
        ...state,
        link: {
          addLoading: false,
          removeLoading: action.id,
          errorRemove: null,
          errorAdd: action.error
        }
      };
    case actions.REMOVE_LINK_SUCCESS:
      tmp = { ...state.meeting };
      tmp.data.links.splice(
        tmp.data.links.findIndex(item => item.id === action.id),
        1
      );
      return {
        ...state,
        meeting: tmp,
        link: {
          addLoading: false,
          removeLoading: false,
          errorRemove: null,
          errorAdd: null
        }
      };
    case actions.REMOVE_LINK_FAIL:
      return {
        ...state,
        link: {
          addLoading: false,
          removeLoading: false,
          errorRemove: action.error,
          errorAdd: null
        }
      };
    case actions.STOP_USER_PAUSE:
      return {
        ...state,
        userCommand: {
          loading: true,
          error: null,
          status: ""
        }
      };

    case actions.STOP_USERS_PAUSE:
      tmp = { ...state.meeting };
      tmp.data.users.forEach(item => {
        if (action.data.users.find(id => id === item.invited_user_id)) {
          item.is_pause = 0;
        }
      });
      return {
        ...state,
        meeting: tmp
      };

    case actions.LEAVE:
      return {
        ...state,
        userCommand: {
          loading: true,
          error: null,
          status: ""
        }
      };
    case actions.LEAVE_SUCCESS:
      tmp = { ...state.meeting };
      tmp.data.users.find(
        user => user.invited_user_id === action.data.invited_user_id
      ).leave = action.data.leave;
      return {
        ...state,
        meeting: tmp,
        userCommand: {
          loading: false,
          error: null,
          status: "OK"
        }
      };
    case actions.LEAVE_FAIL:
      return {
        ...state,
        userCommand: {
          loading: false,
          error: action.error,
          status: "OK"
        }
      };

    default:
      return state;
  }
}

function transformData(data) {
  return data.data;
}

const authToken = () => localStorage.getItem("token"); //kada se ubaci login

// get meeting
export function* watcherMeeting() {
  yield takeLatest(actions.MEETING, getMeeting);
}

function fetchData(options) {
  return axios(options).get(`/meetings/${options.id}/`);
}

function* getMeeting(payload) {
  try {
    const token = yield select(authToken);
    const options = {
      token: token,
      id: payload.id
    };

    const response = yield call(fetchData, options);
    const data = transformData(response);
    // dispatch a success action to the store with the new data
    yield put({ type: actions.MEETING_SUCCESS, data });
  } catch (error) {
    console.log(error);
    if (error.response && error.response.status === 401) {
      yield put({ type: DESTROY_TOKEN_FOR_REDIRECT });
    }
    // dispatch a failure action to the store with the error
    yield put({ type: actions.MEETING_FAIL, error });
  }
}
//get meeting end

// remove user
export function* watcherRemoveUser() {
  yield takeLatest(actions.REMOVE_USER, removeUser);
}

function remove(options) {
  return axios(options).put(`/updateparticipant/${options.id}/remove/`);
}

function* removeUser(payload) {
  try {
    const token = yield select(authToken);
    const options = {
      token: token,
      id: payload.id
    };

    const response = yield call(remove, options);
    const data = {
      ...transformData(response),
      ...{ invited_user_id: options.id }
    };
    // dispatch a success action to the store with the new data
    yield put({ type: actions.REMOVE_USER_SUCCESS, data });
  } catch (error) {
    if (error.response && error.response.status === 401) {
      yield put({ type: DESTROY_TOKEN_FOR_REDIRECT });
    }
    // dispatch a failure action to the store with the error
    yield put({ type: actions.REMOVE_USER_FAIL, error });
  }
}
//remove user end

// get users
export function* watcherGetUsers() {
  yield takeLatest(actions.GET_USERS, getUsers);
}

function fetchUsers(options) {
  return axios(options).get(
    `/availableusers/?meeting_id=${options.meeting_id}`
  );
}

function* getUsers(payload) {
  try {
    const token = yield select(authToken);
    const options = {
      token: token,
      meeting_id: payload.meeting_id
    };

    const response = yield call(fetchUsers, options);
    const data = transformData(response);

    // dispatch a success action to the store with the new data
    yield put({ type: actions.GET_USERS_SUCCESS, data });
  } catch (error) {
    if (error.response && error.response.status === 401) {
      yield put({ type: DESTROY_TOKEN_FOR_REDIRECT });
    }
    // dispatch a failure action to the store with the error
    yield put({ type: actions.GET_USERS_FAIL, error });
  }
}

//get users end

// save new users
export function* watcherSaveNewUsers() {
  yield takeLatest(actions.SAVE_NEW_USERS, saveNewUsers);
}

function updateInvitedUsers(options) {
  return axios(options).put(`/updateparticipant/add_user/`, options.data);
}

function* saveNewUsers(payload) {
  try {
    const token = yield select(authToken);
    const options = {
      token: token,
      data: payload.data
    };

    const response = yield call(updateInvitedUsers, options);
    const data = transformData(response);
    payload.callback();
    // dispatch a success action to the store with the new data
    yield put({ type: actions.SAVE_NEW_USERS_SUCCESS, data });
  } catch (error) {
    if (error.response && error.response.status === 401) {
      yield put({ type: DESTROY_TOKEN_FOR_REDIRECT });
    }
    // dispatch a failure action to the store with the error

    yield put({ type: actions.SAVE_NEW_USERS_FAIL, error });
  }
}

//save new users end

// transfer user
export function* watcherTransferUser() {
  yield takeLatest(actions.TRANSFER_USER, transferUser);
}

function _transferUser(options) {
  return axios(options).put(
    `/updateparticipant/${options.invited_user_id}/transfer/`,
    {
      type: options.type
    }
  );
}

function* transferUser(payload) {
  console.log(payload);
  try {
    const token = yield select(authToken);
    const options = {
      token: token,
      invited_user_id: payload.data.invited_user_id,
      type: payload.data.type
    };

    const response = yield call(_transferUser, options);
    const data = transformData(response);

    // dispatch a success action to the store with the new data
    yield put({ type: actions.TRANSFER_USER_SUCCESS, data });
  } catch (error) {
    if (error.response && error.response.status === 401) {
      yield put({ type: DESTROY_TOKEN_FOR_REDIRECT });
    }
    // dispatch a failure action to the store with the error
    yield put({ type: actions.TRANSFER_USER_FAIL, error });
  }
}

//transfer user

// remvoe document
export function* watcherRemoveDocument() {
  yield takeLatest(actions.REMOVE_DOCUMENT, removeDocument);
}

function _removeDocument(options) {
  return axios(options).post(`/documents/${options.data}/remove/`);
}

function* removeDocument(payload) {
  try {
    const token = yield select(authToken);
    const options = {
      token: token,
      data: payload.id
    };

    const response = yield call(_removeDocument, options);
    const data = transformData(response);

    // dispatch a success action to the store with the new data
    yield put({ type: actions.REMOVE_DOCUMENT_SUCCESS, data: payload.id });
  } catch (error) {
    if (error.response && error.response.status === 401) {
      yield put({ type: DESTROY_TOKEN_FOR_REDIRECT });
    }
    // dispatch a failure action to the store with the error
    console.log(error);
    yield put({ type: actions.REMOVE_DOCUMENT_FAIL, error });
  }
}

//remove document end

// update documents
export function* watcherUpdateDocuments() {
  yield takeLatest(actions.UPDATE_DOCUMENTS, updateDocument);
}

function _updateDocument(options) {
  return axios(options).post(`/documents/`, options.data);
}

function* updateDocument(payload) {
  try {
    const token = yield select(authToken);
    const options = {
      token: token,
      data: payload.data
    };

    const response = yield call(_updateDocument, options);
    const data = transformData(response);

    // dispatch a success action to the store with the new data
    yield put({ type: actions.UPDATE_DOCUMENTS_SUCCESS, data });
  } catch (error) {
    console.log(error);
    if (error.response && error.response.status === 401) {
      yield put({ type: DESTROY_TOKEN_FOR_REDIRECT });
    }
    // dispatch a failure action to the store with the error

    yield put({ type: actions.UPDATE_DOCUMENTS_FAIL, error });
  }
}

//update documents end

//update meeting

export function* watcherUpdateMeeting() {
  yield takeLatest(actions.UPDATE_MEETING, updateMeeting);
}

function _updateMeeting(options) {
  return axios(options).patch(`/meetings/${options.meeting_id}/`, options.data);
}

function* updateMeeting(payload) {
  try {
    const token = yield select(authToken);
    const options = {
      token: token,
      data: payload.data.meeting,
      meeting_id: payload.data.meeting_id
    };

    const response = yield call(_updateMeeting, options);
    const data = transformData(response);
    // dispatch a success action to the store with the new data
    yield put({ type: actions.MEETING_SUCCESS, data });
    yield put({ type: actions.UPDATE_MEETING_SUCCESS, data });
  } catch (error) {
    if (error.response.status === 401) {
      yield put({ type: DESTROY_TOKEN_FOR_REDIRECT });
    }
    // dispatch a failure action to the store with the error
    yield put({ type: actions.UPDATE_MEETING_FAIL, error });
  }
}

//update meeting end

//destroy last opend meeting

function* destroyLastOpendMeeting() {
  yield put({ type: actions.DESTROY_LAST_OPEND_MEETING_PROCEED });
}

export function* watcherdestroyLastOpendMeeting() {
  yield takeLatest(actions.DESTROY_LAST_OPEND_MEETING, destroyLastOpendMeeting);
}

//destroy last opend meeting end

// create task
export function* watcherCreateTask() {
  yield takeLatest(actions.CREATE_TASK, createTask);
}

function _createTask(options) {
  return axios(options).post(`/tasks/`, options.data);
}

function* createTask(payload) {
  try {
    const token = yield select(authToken);
    const options = {
      token: token,
      data: payload.data
    };

    const response = yield call(_createTask, options);
    const data = transformData(response);

    // dispatch a success action to the store with the new data
    yield put({ type: actions.CREATE_TASK_SUCCESS, data });
  } catch (error) {
    if (error.response && error.response.status === 401) {
      yield put({ type: DESTROY_TOKEN_FOR_REDIRECT });
    }
    // dispatch a failure action to the store with the error
    yield put({ type: actions.CREATE_TASK_FAIL, error });
  }
}

// create task end

// start meeting
export function* watcherStartMeeting() {
  yield takeLatest(actions.START_MEETING, startMeeting);
}

function _startMeeting(options) {
  return axios(options).put(`/meetings/${options.meeting}/start/`);
}

function* startMeeting(payload) {
  try {
    const token = yield select(authToken);
    const options = {
      token: token,
      meeting: payload.id
    };

    const response = yield call(_startMeeting, options);
    const data = transformData(response);

    // dispatch a success action to the store with the new data
    yield put({ type: actions.START_MEETING_SUCCESS, data });
  } catch (error) {
    if (error.response && error.response.status === 401) {
      yield put({ type: DESTROY_TOKEN_FOR_REDIRECT });
    }
    // dispatch a failure action to the store with the error
    yield put({ type: actions.START_MEETING_FAIL, error });
  }
}

// start meeting end

// pause meeting
export function* watcherPauseMeeting() {
  yield takeLatest(actions.PAUSE_MEETING, pauseMeeting);
}

function _pauseMeeting(options) {
  return axios(options).put(`/meetings/${options.meeting}/start_pause/`);
}

function* pauseMeeting(payload) {
  try {
    const token = yield select(authToken);
    const options = {
      token: token,
      meeting: payload.id
    };

    const response = yield call(_pauseMeeting, options);
    const data = transformData(response);

    // dispatch a success action to the store with the new data
    yield put({ type: actions.PAUSE_MEETING_SUCCESS, data });
  } catch (error) {
    if (error.response && error.response.status === 401) {
      yield put({ type: DESTROY_TOKEN_FOR_REDIRECT });
    }
    // dispatch a failure action to the store with the error
    yield put({ type: actions.PAUSE_MEETING_FAIL, error });
  }
}

// pause meeting end

// start meeting after pause
export function* watcherStopMeetingPause() {
  yield takeLatest(actions.STOP_PAUSE_MEETING, stopPauseMeeting);
}

function _stopPauseMeeting(options) {
  return axios(options).put(`/meetings/${options.meeting}/stop_pause/`, {
    invited_users: options.invited_users
  });
}

function* stopPauseMeeting(payload) {
  try {
    const token = yield select(authToken);
    const options = {
      token: token,
      meeting: payload.data.meeting,
      invited_users: payload.data.invited_users
    };

    const response = yield call(_stopPauseMeeting, options);
    const data = transformData(response);

    // dispatch a success action to the store with the new data
    yield put({ type: actions.START_MEETING_SUCCESS, data });

    if (payload.callback) {
      payload.callback(); // close modal popup
      yield put({
        type: actions.STOP_USERS_PAUSE, // it happends that some users alreday set paused so on stop meeting pause the exhibitor can sat also users that stop pause
        data: { users: payload.data.invited_users }
      });
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      yield put({ type: DESTROY_TOKEN_FOR_REDIRECT });
    }
    payload.callback();
    // dispatch a failure action to the store with the error
    yield put({ type: actions.START_MEETING_FAIL, error });
  }
}

// away user
export function* watcherAwayUser() {
  yield takeLatest(actions.AWAY, awayUser);
}

function _awayUser(options) {
  return axios(options).put(`/inviteduser/${options.invited_user_id}/away/`);
}

function* awayUser(payload) {
  try {
    const token = yield select(authToken);
    const options = {
      token: token,
      invited_user_id: payload.invited_user_id
    };

    const response = yield call(_awayUser, options);
    const data = {
      ...transformData(response),
      ...{ invited_user_id: options.invited_user_id }
    };

    // dispatch a success action to the store with the new data
    yield put({ type: actions.AWAY_SUCCESS, data });
  } catch (error) {
    if (error.response && error.response.status === 401) {
      yield put({ type: DESTROY_TOKEN_FOR_REDIRECT });
    }
    // dispatch a failure action to the store with the error
    yield put({ type: actions.AWAY_FAIL, error });
  }
}

// away user end

// start user
export function* watcherStartUser() {
  yield takeLatest(actions.USER_START, startUser);
}

function _startUser(options) {
  return axios(options).put(`/inviteduser/${options.invited_user_id}/start/`);
}

function* startUser(payload) {
  try {
    const token = yield select(authToken);
    const options = {
      token: token,
      invited_user_id: payload.invited_user_id
    };

    const response = yield call(_startUser, options);
    const data = {
      ...transformData(response),
      ...{ invited_user_id: options.invited_user_id }
    };

    // dispatch a success action to the store with the new data
    yield put({ type: actions.USER_START_SUCCESS, data });
  } catch (error) {
    if (error.response && error.response.status === 401) {
      yield put({ type: DESTROY_TOKEN_FOR_REDIRECT });
    }
    // dispatch a failure action to the store with the error
    yield put({ type: actions.USER_START_FAIL, error });
  }
}

// start user end

// pause user
export function* watcherPauseUser() {
  yield takeLatest(actions.USER_PAUSE, pauseUser);
}

function _pauseUser(options) {
  return axios(options).put(
    `/inviteduser/${options.invited_user_id}/start_pause/`
  );
}

function* pauseUser(payload) {
  try {
    const token = yield select(authToken);
    const options = {
      token: token,
      invited_user_id: payload.invited_user_id
    };

    const response = yield call(_pauseUser, options);
    const data = {
      ...transformData(response),
      ...{ invited_user_id: options.invited_user_id }
    };

    // dispatch a success action to the store with the new data
    yield put({ type: actions.USER_PAUSE_SUCCESS, data });
  } catch (error) {
    if (error.response && error.response.status === 401) {
      yield put({ type: DESTROY_TOKEN_FOR_REDIRECT });
    }
    // dispatch a failure action to the store with the error
    yield put({ type: actions.USER_PAUSE_FAIL, error });
  }
}

// pause user end

//add meeting note

export function* watcherAddMeetingNote() {
  yield takeLatest(actions.NOTE, addMeetingNote);
}

function _addMeetingNote(options) {
  return axios(options).put(`/notes/${options.note_id}/`, {
    text: options.note
  });
}

function* addMeetingNote(payload) {
  try {
    const token = yield select(authToken);
    const options = {
      token: token,
      note_id: payload.data.note_id,
      note: payload.data.content
    };

    const response = yield call(_addMeetingNote, options);
    const data = transformData(response);

    // dispatch a success action to the store with the new data
    yield put({ type: actions.NOTE_SUCCESS, data });
  } catch (error) {
    if (error.response && error.response.status === 401) {
      yield put({ type: DESTROY_TOKEN_FOR_REDIRECT });
    }
    // dispatch a failure action to the store with the error
    yield put({ type: actions.NOTE_FAIL, error });
  }
}

//add meeting note end

// add link

export function* watcherAddLink() {
  yield takeLatest(actions.LINK, addLink);
}

function _addLink(options) {
  return axios(options).post(`/links/ `, options.data);
}

function* addLink(payload) {
  try {
    const token = yield select(authToken);
    const options = {
      token: token,
      data: payload.data
    };

    const response = yield call(_addLink, options);
    const data = transformData(response);

    // dispatch a success action to the store with the new data
    yield put({ type: actions.LINK_SUCCESS, data });
  } catch (error) {
    if (error.response && error.response.status === 401) {
      yield put({ type: DESTROY_TOKEN_FOR_REDIRECT });
    }
    // dispatch a failure action to the store with the error
    yield put({ type: actions.LINK_FAIL, error });
  }
}
// add link end

// add link

export function* watcherRemoveLink() {
  yield takeLatest(actions.REMOVE_LINK, removeLink);
}

function _removeLink(options) {
  return axios(options).delete(`/links/${options.id}/ `);
}

function* removeLink(payload) {
  try {
    const token = yield select(authToken);
    const options = {
      token: token,
      id: payload.id
    };

    yield call(_removeLink, options);
    // const response = yield call(_removeLink, options);
    // const data = transformData(response);

    // dispatch a success action to the store with the new data
    yield put({ type: actions.REMOVE_LINK_SUCCESS, id: payload.id });
  } catch (error) {
    if (error.response && error.response.status === 401) {
      yield put({ type: DESTROY_TOKEN_FOR_REDIRECT });
    }
    // dispatch a failure action to the store with the error
    yield put({ type: actions.REMOVE_LINK_FAIL, error });
  }
}
// add link end

// start user
export function* watcherStopUserPause() {
  yield takeLatest(actions.STOP_USER_PAUSE, stopUserPause);
}

function _stopUserPause(options) {
  return axios(options).put(
    `/inviteduser/${options.invited_user_id}/stop_pause/`
  );
}

function* stopUserPause(payload) {
  try {
    const token = yield select(authToken);
    const options = {
      token: token,
      invited_user_id: payload.invited_user_id
    };

    const response = yield call(_stopUserPause, options);
    const data = {
      ...transformData(response),
      ...{ invited_user_id: options.invited_user_id }
    };

    // dispatch a success action to the store with the new data
    yield put({ type: actions.USER_START_SUCCESS, data });
  } catch (error) {
    if (error.response && error.response.status === 401) {
      yield put({ type: DESTROY_TOKEN_FOR_REDIRECT });
    }
    // dispatch a failure action to the store with the error
    yield put({ type: actions.USER_START_FAIL, error });
  }
}

// start user end

// swap users
export function* watcherSwapUsers() {
  yield takeLatest(actions.SWAP_USERS, swapUsers);
}

function _swapUsers(options) {
  return axios(options).put(`/updateparticipant/swap/`, {
    meeting_id: options.meeting
  });
}

function* swapUsers(payload) {
  try {
    const token = yield select(authToken);
    const options = {
      token: token,
      meeting: payload.meeting
    };

    const response = yield call(_swapUsers, options);
    const data = transformData(response);

    // dispatch a success action to the store with the new data
    yield put({ type: actions.SAVE_NEW_USERS_SUCCESS, data });
    payload.callback();
  } catch (error) {
    if (error.response && error.response.status === 401) {
      yield put({ type: DESTROY_TOKEN_FOR_REDIRECT });
    }
    // dispatch a failure action to the store with the error
    yield put({ type: actions.SAVE_NEW_USERS_FAIL, error });
  }
}

// swap users end

// end meeting
export function* watcherEndMeeting() {
  yield takeLatest(actions.END_MEETING, endMeeting);
}

function _endMeeting(options) {
  return axios(options).put(`meetings/${options.meeting}/end/`);
}

function* endMeeting(payload) {
  try {
    const token = yield select(authToken);
    const options = {
      token: token,
      meeting: payload.meeting
    };

    const response = yield call(_endMeeting, options);
    const data = transformData(response);

    // dispatch a success action to the store with the new data
    yield put({ type: actions.END_MEETING_SUCCESS, data });
  } catch (error) {
    if (error.response && error.response.status === 401) {
      yield put({ type: DESTROY_TOKEN_FOR_REDIRECT });
    }
    // dispatch a failure action to the store with the error
    yield put({ type: actions.END_MEETING_FAIL, error });
  }
}

// end meeting end

// leave
export function* watcherLeave() {
  yield takeLatest(actions.LEAVE, leave);
}

function _leave(options) {
  return axios(options).put(`inviteduser/${options.invited_user_id}/leave/`);
}

function* leave(payload) {
  try {
    const token = yield select(authToken);
    const options = {
      token: token,
      invited_user_id: payload.invited_user_id
    };

    const response = yield call(_leave, options);
    const data = {
      ...transformData(response),
      ...{ invited_user_id: payload.invited_user_id }
    };

    // dispatch a success action to the store with the new data
    yield put({ type: actions.LEAVE_SUCCESS, data });
  } catch (error) {
    if (error.response && error.response.status === 401) {
      yield put({ type: DESTROY_TOKEN_FOR_REDIRECT });
    }
    // dispatch a failure action to the store with the error
    yield put({ type: actions.LEAVE_FAIL, error });
  }
}

// end leave
