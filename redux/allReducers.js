import { combineReducers } from "redux";

const locationReducer = (state = {}, action) => {
  switch (action.type) {
    case "setLocation":
      return action.payload;
    default:
      return state;
  }
};

const postsReducer = (state = [], action) => {
  switch (action.type) {
    case "setPosts":
      console.log("notifications set");

      return action.payload;
    default:
      return state;
  }
};

const filteredPostsReducer = (state = [], action) => {
  switch (action.type) {
    case "setFilteredPosts":
      return action.payload;
    default:
      return state;
  }
};

const notifictionsReducer = (state = [], action) => {
  switch (action.type) {
    case "setNotifications":
      console.log("notifications set");
      return action.payload;
    default:
      return state;
  }
};

const filteredNotificationsReducer = (state = [], action) => {
  switch (action.type) {
    case "setFilteredNotifications":
      return action.payload;
    default:
      return state;
  }
};

const shouldFilterReducer = (state = true, action) => {
  switch (action.type) {
    case "setShouldFilter":
      return action.payload;
    default:
      return state;
  }
};

const allReducers = combineReducers({
  location: locationReducer,
  posts: postsReducer,
  filteredPosts: filteredPostsReducer,
  notifications: notifictionsReducer,
  filteredNotifications: filteredNotificationsReducer,
  shouldFilter: shouldFilterReducer
});

export default allReducers;
