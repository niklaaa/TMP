import { takeLatest, call, put, select } from "redux-saga/effects";
import axios from "../../../axios/axios-meetings";

import * as actions from "./actions";
import { DESTROY_TOKEN_FOR_REDIRECT } from "../Users/actions";

const initialState = {
  data: null,
  loading: false,
  error: null,
  closeForm: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case actions.CREATE_MEETING:
      return {
        ...state,
        data: null,
        loading: true,
        error: null,
        closeForm: false
      };
    case actions.CREATE_MEETING_SUCCESS:
      return {
        ...state,
        data: action.data,
        loading: false,
        error: null,
        closeForm: true
      };
    case actions.CREATE_MEETING_FAIL:
      return {
        ...state,
        data: null,
        loading: false,
        error: "Could't not fetch data",
        closeForm: false
      };
    default:
      return state;
  }
}

function postData(options) {
  return axios(options).post(options.endpoint, options.meeting.meeting);
}

function transformData(data) {
  return data.data;
}

const authToken = () => localStorage.getItem("token"); //kada se ubaci login

// create meeting
export function* watcherCreateMeeting() {
  yield takeLatest(actions.CREATE_MEETING, createMeeting);
}

function* createMeeting(meeting) {
  //payload ukoliko bude potrebe za dohvatanje satanaka na osnovu nekog filtera
  try {
    const token = yield select(authToken);
    const options = {
      token: token,
      endpoint: "meetings/",
      meeting: meeting
    };

    console.log(options);

    const response = yield call(postData, options);
    const data = transformData(response);

    // dispatch a success action to the store with the new data
    yield put({ type: actions.UPDATE_MEETING_LIST, data });
    yield put({ type: actions.CREATE_MEETING_SUCCESS, data });
  } catch (error) {
    if (error.response && error.response.status === 401) {
      yield put({ type: DESTROY_TOKEN_FOR_REDIRECT });
    }
    yield put({ type: actions.GET_PREPARE_MEETING_SUCCESS, error: error });
    // dispatch a failure action to the store with the error
    yield put({ type: actions.CREATE_MEETING_FAIL, error });
  }
}
// get meetings end
