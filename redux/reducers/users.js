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
        userLoaded: state.users.length + 1,
      };
    case DELETE_FOLLOWING:
      return {
        ...state,
        users: [],
        userLoaded: state.users.length - 1,
      };
    default:
      return state;
  }
};
