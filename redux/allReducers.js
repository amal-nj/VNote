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

const allReducers = combineReducers({
  location: locationReducer,
  posts: postsReducer,
  filteredPosts: filteredPostsReducer
});

export default allReducers;
