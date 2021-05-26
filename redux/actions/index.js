import firebase from "firebase";
import { store } from "../../App";
import { useSelector } from "react-redux";

import {
  USER_STATE_CHANGE,
  USER_POSTS_STATE_CHANGE,
  USER_FOLLOWING_STATE_CHANGE,
  USERS_POSTS_STATE_CHANGE,
  USERS_DATA_STATE_CHANGE,
} from "../constants/index";

export const fetchUser = async () => {
  const user = await firebase
    .firestore()
    .collection("users")
    .doc(firebase.auth().currentUser.uid)
    .get()
    .then((user) => user.data());
  // console.log(user);
  return {
    type: USER_STATE_CHANGE,
    payload: user,
  };
};

export const fetchUserPosts = async () => {
  const snapshot = await firebase
    .firestore()
    .collection("post")
    .doc(firebase.auth().currentUser.uid)
    .collection("userPosts")
    .orderBy("creation", "asc") // 정렬 기준, 정렬 방식 ascend, descend
    .get()
    .then((snapshot) => {
      let posts = snapshot.docs.map((doc) => {
        const data = doc.data();
        const id = doc.id;
        return { id, ...data };
      });
      return posts;
    });
  return {
    type: USER_POSTS_STATE_CHANGE,
    payload: snapshot,
  };
};

export const fetchUserFollowing = async () => {
  const snapshot = await firebase
    .firestore()
    .collection("following")
    .doc(firebase.auth().currentUser.uid)
    .collection("userFollowing")
    .get()
    .then((snapshot) => {
      let following = snapshot.docs.map((doc) => {
        const id = doc.id;
        return id;
      });
      return following;
    });
  return {
    type: USER_FOLLOWING_STATE_CHANGE,
    payload: snapshot,
  };
};

export const fetchUsersData = async (uid) => {
  // 팔로우 한 유저 정보 가져오기
  const user = await firebase
    .firestore()
    .collection("users")
    .doc(uid)
    .get()
    .then((snapshot) => {
      let user = snapshot.data();
      user.uid = snapshot.id;
      let post = firebase
        .firestore()
        .collection("post")
        .doc(uid)
        .collection("userPosts")
        .orderBy("creation", "asc") // 정렬 기준, 정렬 방식 ascend, descend
        .get()
        .then((snapshot) => {
          snapshot.docs.map((doc) => {
            const data = doc.data();
            console.log(data);
            return { ...data };
          });
        });
      return { user, post };
    });
  return {
    type: USERS_DATA_STATE_CHANGE,
    payload: user,
  };
};

// export const fetchUsersFollowingPosts = async (uid) => {
//   const users = useSelector((state) => state.usersState.users);
//   const snapshot = await firebase
//     .firestore()
//     .collection("post")
//     .doc(uid)
//     .collection("userPosts")
//     .orderBy("creation", "asc") // 정렬 기준, 정렬 방식 ascend, descend
//     .get()
//     .then((snapshot) => {
//       const uid = snapshot.query.EP.path.segmants[1];
//       console.log({ snapshot, uid });
//       const user = users.find((el) => el.uid === uid);
//       let posts = snapshot.docs.map((doc) => {
//         const data = doc.data();
//         const id = doc.id;
//         return { id, ...data, user };
//       });
//       Dispatch({ type: USERS_POSTS_STATE_CHANGE, posts, uid });
//     });
// };
