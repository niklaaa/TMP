import { takeLatest, call, put, select } from "redux-saga/effects";
import axios from "../../../axios/axios-meetings";
 

import * as actions from "./actions";

 

import { DESTROY_TOKEN_FOR_REDIRECT } from "../Users/actions";

const initialState = {
  meetings: {
    data: null,
    loading: true,
    error: null
  }
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case actions.GET_DATA:
      return {
        ...state,
        meetings: {
          data: null,
          loading: true,
          error: null
        }
      };
    case actions.GET_DATA_SUCCESS:
      
      return {
        ...state,
        meetings: {
          data: action.data,
          loading: false,
          error: null
        }
      };
    case actions.GET_DATA_FAIL:
      return {
        ...state,
        meetings: {
          data: null,
          loading: false,
          error: action.error
        }
      };
    case actions.UPDATE_MEETING_LIST:
      const meetings = state.meetings.data.concat(action.data);
      console.log(meetings);
      return {
        ...state,
        meetings: {
          data: meetings,
          loading: false,
          error: null
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

// get meetings
export function* watcherMeetings() {
  yield takeLatest(actions.GET_DATA, getMeetings);
}

function fetchMeetings(options) {
  return axios(options).get("meetings/");
}

function* getMeetings(payload) {
  //payload ukoliko bude potrebe za dohvatanje satanaka na osnovu nekog filtera
  try {
    const token = yield select(authToken); 
    const options = {
      token: token
    };

    const response = yield call(fetchMeetings, options);
    const data = transformData(response);
    // dispatch a success action to the store with the new data
    yield put({ type: actions.GET_DATA_SUCCESS, data });
  } catch (error) {
    if (error.response && error.response.status === 401) {
      yield put({ type: DESTROY_TOKEN_FOR_REDIRECT });
    }
    yield put({ type: actions.GET_PREPARE_MEETING_SUCCESS, error: error });
    // dispatch a failure action to the store with the error
    yield put({ type: actions.GET_DATA_FAIL, error });
  }
}
// get meetings end
