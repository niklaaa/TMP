import { combineReducers } from 'redux';
import { firebaseReducer } from 'react-redux-firebase';
import meetingsReducer from "../redux/modules/Meetings/meetings";
import prepareMeetingsReducer from "./modules/Meetings/prepareMeeting";
import usersReducer from "../redux/modules/Users/user";
import createMeetingReducer from "./modules/Meetings/createMeeting";
import meetingReducer from "./modules/Meetings/meeting";



export default combineReducers({
    // firebase: firebaseReducer,
    meetingsReducer,
    usersReducer,
    prepareMeetingsReducer,
    createMeetingReducer,
    meetingReducer
});