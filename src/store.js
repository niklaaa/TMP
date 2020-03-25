import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { reactReduxFirebase } from "react-redux-firebase";
import createSagaMiddleware from "redux-saga";


import { composeWithDevTools } from "redux-devtools-extension";

import rootReducer from "./redux/rootReducer";

import { watcherMeetings } from "./redux/modules/Meetings/meetings";
import {
  watcherLogout,
  watcherSetTokenFromLocaleStorage,
  watcherGetUser,
  watcherGetAllUsers,
  watcherLogin,
  watcherRegistration
} from "./redux/modules/Users/user";
import { watcherCreateMeeting } from "./redux/modules/Meetings/createMeeting";
import {
  watcherMeeting,
  watcherRemoveUser,
  watcherGetUsers,
  watcherSaveNewUsers,
  watcherTransferUser,
  watcherRemoveDocument,
  watcherUpdateDocuments,
  watcherUpdateMeeting,
  watcherdestroyLastOpendMeeting,
  watcherCreateTask,
  watcherStartMeeting,
  watcherPauseMeeting,
  watcherStopMeetingPause,
  watcherEndMeeting,
  watcherAwayUser,
  watcherStartUser,
  watcherPauseUser,
  watcherAddMeetingNote,
  watcherAddLink,
  watcherRemoveLink,
  watcherStopUserPause,
  watcherSwapUsers,
  watcherLeave
} from "./redux/modules/Meetings/meeting";

import {
  watcherGetProducts,
  watcherGetSuppliers,
  watcherPrepareMeetings,
  watcherSaveNewPlace,
  watcherSaveNewTitle
} from "./redux/modules/Meetings/prepareMeeting";

const firebaseConfig = {
  apiKey: "AIzaSyDaZwFiXROxlEjznZHz9eEmyEJ_4_zjEsA",  
  authDomain: "productivity-tracker-224713.firebaseapp.com",
  databaseURL: "https://productivity-tracker-224713.firebaseio.com",
  projectId: "productivity-tracker-224713",
  storageBucket: "productivity-tracker-224713.appspot.com",
  messagingSenderId: "236707776931",
  appId: "1:236707776931:web:685ccc7ee419abdd"
};

firebase.initializeApp(firebaseConfig);

firebase.firestore();

const rrfConfig = {
  userProfile: "users", // firebase root where user profiles are stored
  enableLogging: false, // enable/disable Firebase's database logging
  useFirestoreForProfile: true
};

// create the saga middleware
export const sagaMiddleware = createSagaMiddleware();

const initialState = {};

const createStoreWithFirebase = compose(
  //reduxFirestore(firebase),
  reactReduxFirebase(firebase, rrfConfig),
  applyMiddleware(thunk, sagaMiddleware)
)(createStore);

// const middleware = routerMiddleware(browserHistory);

const store = createStoreWithFirebase(rootReducer, initialState);

sagaMiddleware.run(watcherMeetings);
sagaMiddleware.run(watcherLogout);
sagaMiddleware.run(watcherPrepareMeetings);
sagaMiddleware.run(watcherGetProducts);
sagaMiddleware.run(watcherGetSuppliers);
sagaMiddleware.run(watcherCreateMeeting);
sagaMiddleware.run(watcherLogin);
sagaMiddleware.run(watcherGetUser);
sagaMiddleware.run(watcherSetTokenFromLocaleStorage);
sagaMiddleware.run(watcherMeeting);
sagaMiddleware.run(watcherRemoveUser);
sagaMiddleware.run(watcherGetUsers);
sagaMiddleware.run(watcherSaveNewUsers);
sagaMiddleware.run(watcherTransferUser);
sagaMiddleware.run(watcherRemoveDocument);
sagaMiddleware.run(watcherUpdateDocuments);
sagaMiddleware.run(watcherUpdateMeeting);
sagaMiddleware.run(watcherdestroyLastOpendMeeting);
sagaMiddleware.run(watcherCreateTask);
sagaMiddleware.run(watcherStartMeeting);
sagaMiddleware.run(watcherPauseMeeting);
sagaMiddleware.run(watcherStopMeetingPause);
sagaMiddleware.run(watcherEndMeeting);
sagaMiddleware.run(watcherAwayUser);
sagaMiddleware.run(watcherStartUser);
sagaMiddleware.run(watcherPauseUser);
sagaMiddleware.run(watcherAddMeetingNote);
sagaMiddleware.run(watcherAddLink);
sagaMiddleware.run(watcherRemoveLink);
sagaMiddleware.run(watcherStopUserPause);
sagaMiddleware.run(watcherSwapUsers);
sagaMiddleware.run(watcherLeave);
sagaMiddleware.run(watcherSaveNewPlace);
sagaMiddleware.run(watcherSaveNewTitle);
sagaMiddleware.run(watcherGetAllUsers);
sagaMiddleware.run(watcherRegistration);

export const rrfProps = {
  dispatch: store.dispatch
};

export default store;
