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
  
