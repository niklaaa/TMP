const setRealStartForUsers = data => {
  let users = data.users.concat();
  data.users = users.map(item => {
    if (!item.start) {
      item.start = data.real_start;
    }
    return item;
  });

  return data;
};


export default setRealStartForUsers;