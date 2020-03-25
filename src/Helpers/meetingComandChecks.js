import moment from "moment";

export function disableTransfer(users, userId) {
  const numOfusers = users.filter(
    item =>
      item.exhibitor === users.find(item => item.user.id === userId).exhibitor
  ); //participants or exhibitors
  if (numOfusers.length < 2) {
    return true;
  }
  return false;
}

export function removeAway(meetingRealStart, meeting) {
  // option away can be call just in 5 min after meetings start
  const minutes = moment
    .duration(moment(new Date()).diff(moment(meetingRealStart)))
    .asMinutes();
  if (minutes > 5) {
    return true;
  }
  return false;
}

export function disableStart(meeting, userId, commandTriggerd) {
  const user = meeting.users.find(item => item.user.id === userId);
  
  if (commandTriggerd || user.is_pause === 0 || user.is_pause === null || user.leave || meeting.is_pause !== 0) {
    return true;
  }
  return false;
}

 
