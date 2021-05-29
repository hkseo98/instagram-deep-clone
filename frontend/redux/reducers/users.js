import {
  USERS_DATA_STATE_CHANGE,
  USERS_POSTS_STATE_CHANGE,
  DELETE_FOLLOWING,
  CLEAR_DATA,
  FETCH_ALL_USER,
  USER_LIKES_STATE_CHANGE,
  FETCH_ALL_FEEDS,
} from "../constants/index";

const initialState = {
  users: [],
  userLoaded: 0,
  allUsers: [],
};

export const users = (state = initialState, action) => {
  switch (action.type) {
    case USERS_DATA_STATE_CHANGE:
      return {
        ...state,
        users: [...state.users, action.payload],
        userLoaded: state.users.length + 1,
      };
    case DELETE_FOLLOWING:
      return {
        ...state,
        users: [],
        userLoaded: state.users.length - 1,
      };
    case CLEAR_DATA:
      return { users: [], userLoaded: 0 };
    case FETCH_ALL_FEEDS:
      return { ...state, allFeeds: action.payload };
    case FETCH_ALL_USER:
      return { ...state, allUsers: action.payload };
    case USER_LIKES_STATE_CHANGE:
      return {
        ...state,
        users: state.users.map((user) => {
          if (user.user.uid === action.payload.uid) {
            let posts = user.posts.map((post) => {
              if (post.postId === action.payload.postId) {
                post.currentUserLike = action.payload.currentUserLike;
                return post;
              } else {
                return post;
              }
            });
            user.posts = posts;
            return user;
          } else {
            return user;
          }
        }),
      };

    default:
      return state;
  }
};
