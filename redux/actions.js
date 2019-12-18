export const setLocation = location => {
  return {
    type: "setLocation",
    payload: location
  };
};

export const setPosts = posts => {
  return {
    type: "setPosts",
    payload: posts
  };
};

export const setFilteredPosts = filteredPosts => {
  return {
    type: "setFilteredPosts",
    payload: filteredPosts
  };
};

export const setNotifications = notifications => {
  return {
    type: "setNotifications",
    payload: notifications
  };
};

export const setFilteredNotifications = filteredNotifications => {
  return {
    type: "setFilteredNotifications",
    payload: filteredNotifications
  };
};
