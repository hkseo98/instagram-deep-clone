import {
  USERS_DATA_STATE_CHANGE,
  USERS_POSTS_STATE_CHANGE,
  DELETE_FOLLOWING,
} from "../constants/index";

const initialState = {
  users: [],
  userLoaded: 0,
};

export const users = (state = initialState, action) => {
  switch (action.type) {
    case USERS_DATA_STATE_CHANGE:
      return {
        ...state,
        users: [...state.users, action.payload],
      };
    case DELETE_FOLLOWING:
      return {
        ...state,
        users: [],
      };
    case USERS_POSTS_STATE_CHANGE:
      return {
        ...state,
        userLoaded: state.userLoaded + 1,
        users: state.users.map((user) =>
          user.uid === action.uid ? { ...users, posts: action.posts } : user
        ),
      };
    default:
      return state;
  }
};
