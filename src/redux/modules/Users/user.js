import { takeLatest, put, call, select } from "redux-saga/effects";

import axios_users from "../../../axios/axios-users";
import axios from "axios";

import * as actions from "./actions";

const initialState = {
  user: {
    data: {},
    token: "ff",
    loading: true,
    error: null,
    status: 200,
    expireTime: 3600 * 3,
    permission: false
  },
  users: {
    data: [],
    loading: false,
    error: null
  },
  registration: {
    data: {},
    loading: false,
    error: null
  }
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case actions.LOGOUT_PROCEED:
      return {
        ...state,
        user: {
          token: ""
        }
      };
    case actions.LOGIN:
      return {
        ...state,
        user: {
          data: {},
          token: "",
          loading: false,
          error: null,
          status: 200
        }
      };
    case actions.LOGIN_SUCCESS:
      return {
        ...state,
        user: {
          data: action.data.user,
          token: action.data.token,
          loading: false,
          error: null,
          status: 200
        }
      };
    case actions.LOGIN_FAIL:
      return {
        ...state,
        user: {
          data: {},
          token: "",
          loading: false,
          error: action.error,
          status: parseInt(action.error.message.split("code ")[1])
        }
      };
    case actions.USER:
      return {
        ...state,
        user: {
          data: {},
          loading: true,
          token: "ff",
          error: null,
          status: 0
        }
      };
    case actions.USER_SUCCESS:
      return {
        ...state,
        user: {
          data: action.data.user,
          token: action.data.token,
          loading: false,
          error: null,
          status: 200
        }
      };
    case actions.USER_FAIL:
      return {
        ...state,
        user: {
          data: {},
          token: "",
          loading: false,
          error: action.error,
          status: 400
        }
      };
    case actions.SET_TOKEN_FROM_LOCALE_STORAGE_PROCEED:
      return {
        ...state,
        user: {
          data: {},
          token: action.token.token,
          loading: false,
          error: null,
          status: 200
        }
      };

    case actions.DESTROY_TOKEN_FOR_REDIRECT:
      return {
        ...state,
        user: {
          data: {},
          token: "",
          loading: false,
          error: null,
          status: 401
        }
      };

    case actions.GET_ALL_USERS:
      return {
        ...state,
        users: {
          data: [],
          loading: true,
          error: null
        }
      };
    case actions.GET_ALL_USERS_SUCCESS:
      return {
        ...state,
        users: {
          data: action.data,
          loading: false,
          error: null
        }
      };
    case actions.GET_ALL_USERS_FAIL:
      return {
        ...state,
        users: {
          data: [],
          loading: false,
          error: action.error
        }
      };
    case actions.REGISTRATION:
      return {
        ...state,
        registration: {
          data: {},
          loading: true,
          error: null
        }
      };
    case actions.REGISTRATION_SUCCESS:
      return {
        ...state,
        registration: {
          data: action.data,
          loading: false,
          error: null
        }
      };
    case actions.REGISTRATION_FAIL:
      return {
        ...state,
        registration: {
          data: {},
          loading: false,
          error: action.error
        }
      };
    default:
      return { ...state };
  }
}

function transformData(data) {
  return data.data;
}

//set token from locale storage
function* setTokenFromLocaleStorage(token) {
  yield put({ type: actions.SET_TOKEN_FROM_LOCALE_STORAGE_PROCEED, token });
  // yield put({ type: actions.USER });
}

export function* watcherSetTokenFromLocaleStorage() {
  yield takeLatest(
    actions.SET_TOKEN_FROM_LOCALE_STORAGE,
    setTokenFromLocaleStorage
  );
}
//set token from locale storage end

//logout
function* logout() {
  yield localStorage.removeItem("token");
  yield localStorage.removeItem("authTime");
  yield put({ type: actions.LOGOUT_PROCEED });
}

export function* watcherLogout() {
  yield takeLatest(actions.LOGOUT, logout);
}
//logout end

// login
function postData(data) {
  return axios.post(
    "http://35.246.207.122:8000/login/",
    data.credentials
  );
}

export function* watcherLogin() {
  yield takeLatest(actions.LOGIN, login);
}

function* login(credentials) {
  //payload ukoliko bude potrebe za dohvatanje satanaka na osnovu nekog filtera
  try {
    const response = yield call(postData, credentials);
    const data = transformData(response);
    yield localStorage.setItem("token", data.token);
    yield localStorage.setItem("authTime", new Date().toString());

    // dispatch a success action to the store with the new data
    yield put({ type: actions.LOGIN_SUCCESS, data });
  } catch (error) {
    // dispatch a failure action to the store with the error
    yield put({ type: actions.LOGIN_FAIL, error });
  }
}
// End login

// get user by token

function fetchUser(options) {
  return axios_users(options).get(
    "getuser/"
  );
}

const authToken = () => localStorage.getItem("token"); //kada se ubaci login

export function* watcherGetUser() {
  yield takeLatest(actions.USER, getUser);
}

function* getUser() {
  //payload ukoliko bude potrebe za dohvatanje satanaka na osnovu nekog filtera
  try {
    const token = yield call(authToken);
    const options = {
      token: token
    };
    const response = yield call(fetchUser, options);
    const data = { ...transformData(response), ...{ token: options.token } };

    // dispatch a success action to the store with the new data

    yield put({ type: actions.USER_SUCCESS, data });
  } catch (error) {
    console.log(error);
    // dispatch a failure action to the store with the error
    yield put({ type: actions.USER_FAIL, error });
  }
}
// End login

// get all users
export function* watcherGetAllUsers() {
  yield takeLatest(actions.GET_ALL_USERS, getAllUsers);
}

function _getAllUsers(options) {
  return axios_users(options).get(`/users/`);
}

function* getAllUsers() {
  try {
    const token = yield select(authToken);
    const options = {
      token: token
    };
    const response = yield call(_getAllUsers, options);
    const data = transformData(response);
    // dispatch a success action to the store with the new data
    yield put({ type: actions.GET_ALL_USERS_SUCCESS, data });
  } catch (error) {
    if (error.response && error.response.status === 401) {
      yield put({ type: actions.DESTROY_TOKEN_FOR_REDIRECT });
    }
    // dispatch a failure action to the store with the error
    yield put({ type: actions.GET_ALL_USERS_FAIL, error });
  }
}
// get all users fail

// get all users
export function* watcherRegistration() {
  yield takeLatest(actions.REGISTRATION, registration);
}

function _registration(options) {
  return axios_users(options).post(`/registration/`, options.data);
}

function* registration(payload) {
  try {
    const token = yield select(authToken);
    const options = {
      token: token,
      data: payload.data
    };
    const response = yield call(_registration, options);
    const data = transformData(response);
    // dispatch a success action to the store with the new data
    yield put({ type: actions.REGISTRATION_SUCCESS, data });
    payload.callback();
  } catch (error) {
    if (error.response && error.response.status === 401) {
      yield put({ type: actions.DESTROY_TOKEN_FOR_REDIRECT });
    }
    // dispatch a failure action to the store with the error
    yield put({ type: actions.REGISTRATION_FAIL, error });
  }
}
// get all users fail
