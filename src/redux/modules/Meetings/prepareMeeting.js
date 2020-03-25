import { takeLatest, call, put, select, takeEvery } from "redux-saga/effects";
import axios from "../../../axios/axios-meetings";

import * as actions from "./actions";

import { DESTROY_TOKEN_FOR_REDIRECT } from "../Users/actions";

const initialState = {
  prepareMeeting: {
    error: null,
    loading: true
  }, // data koja se povlace na pocetno stanje za kreiranje sastanka
  titles: {
    data: [],
    error: null,
    loading: false
  },
  customers: {
    error: null,
    loading: false,
    data: []
  },
  countries: {
    data: [],
    error: null,
    loading: false
  },
  users: {
    data: [],
    error: null,
    loading: false
  },
  cities: {
    data: [],
    error: null,
    loading: false
  },
  streets: {
    data: [],
    error: null,
    loading: false
  },
  locations: {
    data: [],
    error: null,
    loading: false
  },
  rooms: {
    data: [],
    error: null,
    loading: false
  },
  products: {
    data: [],
    error: null,
    loading: false
  },
  suppliers: {
    data: [],
    error: null,
    loading: false
  },
  saveNewPlace: {
    loading: false,
    error: null
  },
  saveNewTitle: {
    loading: false,
    error: null
  }
};

export default function reducer(state = initialState, action = {}) {
  let tmp = {};
  switch (action.type) {
    case actions.GET_PREPARE_MEETING:
      return {
        ...state,
        prepareMeeting: {
          loading: true,
          error: null
        }
      };
    case actions.GET_PREPARE_MEETING_FAIL:
      return {
        ...state,
        prepareMeeting: {
          loading: false,
          error: "Coudn't fetch data"
        }
      };
    case actions.GET_PREPARE_MEETING_SUCCESS:
      return {
        ...state,
        prepareMeeting: {
          loading: false,
          error: null
        },
        titles: {
          data: action.data.titles,
          error: null,
          loading: false
        },
        customers: {
          error: null,
          loading: false,
          data: action.data.customers
        },
        countries: {
          data: action.data.countries,
          error: null,
          loading: false
        },
        users: {
          data: action.data.users,
          error: null,
          loading: false
        },
        suppliers: {
          data: action.data.suppliers,
          error: null,
          loading: false,
          productID: 0,
          productName: ""
        },
        products: {
          data: action.data.products,
          error: null,
          loading: false,
          supplierID: 0,
          supplierName: ""
        },
        cities: {
          data: action.data.cities,
          error: null,
          loading: false
        },

        streets: {
          data: action.data.streets,
          error: null,
          loading: false
        },
        locations: {
          data: action.data.locations,
          error: null,
          loading: false
        },
        rooms: {
          data: action.data.rooms,
          error: null,
          loading: false
        },
        subTypes: action.data.subtypes
      };
    case actions.GET_PRODUCTS:
      return {
        ...state,
        products: {
          data: [],
          error: null,
          loading: true,
          supplierID: 0,
          supplierName: ""
        }
      };
    case actions.GET_PRODUCTS_FAIL:
      return {
        ...state,
        products: {
          data: [],
          error: "Couldn't fetch data",
          loading: false,
          supplierID: 0,
          supplierName: ""
        }
      };
    case actions.GET_PRODUCTS_SUCCESS:
      return {
        ...state,
        products: {
          data: action.data.products,
          error: null,
          loading: false,
          supplierID: action.data.id,
          supplierName: action.data.name
        }
      };
    case actions.GET_SUPPLIERS:
      return {
        ...state,
        suppliers: {
          data: [],
          error: null,
          loading: true,
          productID: 0,
          productName: ""
        }
      };
    case actions.GET_SUPPLIERS_FAIL:
      return {
        ...state,
        suppliers: {
          data: [],
          error: "Couldn't fetch data",
          loading: false,
          productID: 0,
          productName: ""
        }
      };
    case actions.GET_SUPPLIERS_SUCCESS:
      return {
        ...state,
        suppliers: {
          data: action.data.suppliers,
          error: null,
          loading: false,
          productID: action.data.id,
          productName: action.data.name
        }
      };
    case actions.SAVE_NEW_PLACE:
      return {
        ...state,
        saveNewPlace: {
          loading: true,
          error: null
        }
      };
    case actions.SAVE_NEW_PLACE_SUCCESS:
      let cities = { ...state.cities };
      let city = cities.data.findIndex(item => item.id === action.data.city.id);
      if (city === -1) {
        cities.data.push(action.data.city);
      }
      let streets = { ...state.streets };
      let street = streets.data.findIndex(
        item => item.id === action.data.street.id
      );
      if (street === -1) {
        streets.data.push(action.data.street);
      }
      let locations = { ...state.locations };
      let location = locations.data.findIndex(
        item => item.id === action.data.location.id
      );
      console.log(location);
      if (location === -1) {
        locations.data.push(action.data.location);
      }
      let rooms = { ...state.rooms };
      rooms.data.push(action.data.room);

      return {
        ...state,
        cities,
        streets,
        locations,
        rooms,
        saveNewPlace: {
          loading: false,
          error: null
        }
      };
    case actions.SAVE_NEW_PLACE_FAIL:
      return {
        ...state,
        saveNewPlace: {
          loading: false,
          error: action.error
        }
      };

    case actions.SAVE_NEW_TITLE:
      return {
        ...state,
        saveNewTitle: {
          loading: true,
          error: null
        }
      };
    case actions.SAVE_NEW_TITLE_SUCCESS:
      tmp = { ...state.titles };
      tmp.data.push(action.data);
      console.log(tmp);
      return {
        ...state,
        titles: tmp,
        saveNewTitle: {
          loading: false,
          error: null
        }
      };
    case actions.SAVE_NEW_TITLE_FAIL:
      return {
        ...state,
        saveNewTitle: {
          loading: false,
          error: action.error
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

// get meeting prepare
export function* watcherPrepareMeetings() {
  yield takeLatest(actions.GET_PREPARE_MEETING, getPrepareMeetings);
}

function fetchPrepareMeetings(options) {
  return axios(options).get("prepare/");
}

function* getPrepareMeetings() {
  try {
    const token = yield select(authToken);
    const options = {
      token: token
    };
    const response = yield call(fetchPrepareMeetings, options);
    const data = transformData(response);

    yield put({ type: actions.GET_PREPARE_MEETING_SUCCESS, data });
  } catch (error) {
    if (error.response && error.response.status === 401) {
      yield put({ type: DESTROY_TOKEN_FOR_REDIRECT });
    }
    yield put({ type: actions.GET_PREPARE_MEETING_SUCCESS, error: error });
  }
}
// get meeting prepare end

// get Products
export function* watcherGetProducts() {
  yield takeLatest(actions.GET_PRODUCTS, getProducts);
}

function fetchProducts(options) {
  return axios(options).get(`suppliers/${options.supplier.supplierID}/`);
}

function* getProducts(supplierID) {
  try {
    const token = yield select(authToken);
    const options = {
      token: token,
      supplier: supplierID
    };
    const response = yield call(fetchProducts, options);
    const data = transformData(response);

    // dispatch a success action to the store with the new data
    yield put({ type: actions.GET_PRODUCTS_SUCCESS, data });
  } catch (error) {
    if (error.response && error.response.status === 401) {
      yield put({ type: DESTROY_TOKEN_FOR_REDIRECT });
    }
    // dispatch a failure action to the store with the error
    yield put({ type: actions.GET_PRODUCTS_FAIL, error });
  }
}
// get Products end

// get Suppliers
export function* watcherGetSuppliers() {
  yield takeLatest(actions.GET_SUPPLIERS, getSuppliers);
}

function fetchSuppliers(options) {
  return axios(options).get(`products/${options.product.productID}/`);
}

function* getSuppliers(productID) {
  try {
    const token = yield select(authToken);
    const options = {
      token: token,
      product: productID
    };
    const response = yield call(fetchSuppliers, options);
    const data = transformData(response);
    // dispatch a success action to the store with the new data
    yield put({ type: actions.GET_SUPPLIERS_SUCCESS, data });
  } catch (error) {
    if (error.response && error.response.status === 401) {
      yield put({ type: DESTROY_TOKEN_FOR_REDIRECT });
    }
    // dispatch a failure action to the store with the error
    yield put({ type: actions.GET_SUPPLIERS_FAIL, error });
  }
}
// get Suppliers end

// save new place
export function* watcherSaveNewPlace() {
  yield takeLatest(actions.SAVE_NEW_PLACE, saveNewPlace);
}

function _saveNewPlace(options) {
  let route = "";
  switch (options.addType) {
    case "city":
      route = "cities";
      break;
    case "street":
      route = "streets";
      break;
    case "location":
      route = "locations";
      break;
  }
  return axios(options).post(`/${route}/`, options.data);
}

function* saveNewPlace(payload) {
  try {
    const token = yield select(authToken);
    const options = {
      token: token,
      data: payload.values,
      addType: payload.addType
    };
    const response = yield call(_saveNewPlace, options);
    const data = transformData(response);
    // dispatch a success action to the store with the new data
    yield put({ type: actions.SAVE_NEW_PLACE_SUCCESS, data });
    payload.callback();
  } catch (error) {
    if (error.response && error.response.status === 401) {
      yield put({ type: DESTROY_TOKEN_FOR_REDIRECT });
    }
    // dispatch a failure action to the store with the error
    yield put({ type: actions.SAVE_NEW_PLACE_FAIL, error });
  }
}
// save new place end

// save new title
export function* watcherSaveNewTitle() {
  yield takeLatest(actions.SAVE_NEW_TITLE, saveNewTitle);
}

function _saveNewTitle(options) {
  return axios(options).post(`/titles/`, { name: options.data.title });
}

function* saveNewTitle(payload) {
  console.log(payload);
  try {
    const token = yield select(authToken);
    const options = {
      token: token,
      data: payload.values
    };
    const response = yield call(_saveNewTitle, options);
    const data = transformData(response);
    // dispatch a success action to the store with the new data
    yield put({ type: actions.SAVE_NEW_TITLE_SUCCESS, data });
    payload.callback();
  } catch (error) {
    console.log(error);
    if (error.response && error.response.status === 401) {
      yield put({ type: DESTROY_TOKEN_FOR_REDIRECT });
    }
    // dispatch a failure action to the store with the error
    yield put({ type: actions.SAVE_NEW_TITLE_FAIL, error });
  }
}
// save new title end

