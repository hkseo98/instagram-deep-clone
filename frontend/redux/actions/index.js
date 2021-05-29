import firebase from "firebase";
import { store } from "../../App";
import { useSelector } from "react-redux";

import {
  USER_STATE_CHANGE,
  USER_POSTS_STATE_CHANGE,
  USER_FOLLOWING_STATE_CHANGE,
  USERS_POSTS_STATE_CHANGE,
  USERS_DATA_STATE_CHANGE,
  CLEAR_DATA,
  FETCH_ALL_USER,
  USER_LIKES_STATE_CHANGE,
} from "../constants/index";

export const clearData = () => {
  return {
    type: CLEAR_DATA,
  };
};

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
      if (snapshot.exists) {
        let user = snapshot.data();
        user.uid = snapshot.id;
        return user;
      } else {
        console.log("does not exist");
      }
    });
  let post = [];
  const posts = await firebase
    .firestore()
    .collection("post")
    .doc(uid)
    .collection("userPosts")
    .orderBy("creation", "asc")
    .get()
    .then((snapshot) => {
      snapshot.docs.map((doc) => {
        const data = doc.data();
        const postId = doc.id;
        post.push({ data, postId });
      });
      return post;
    });
  return {
    type: USERS_DATA_STATE_CHANGE,
    payload: { user, posts },
  };
};

export const fetchAllUser = async () => {
  const users = await firebase
    .firestore()
    .collection("users")
    .get()
    .then((snapshot) => {
      let users = snapshot.docs.map((doc) => {
        const data = doc.data();
        const uid = doc.id;
        return { uid, ...data };
      });
      return users;
    });
  return {
    type: FETCH_ALL_USER,
    payload: { users },
  };
};

export const fetchUsersFollowingLikes = async (uid, postId) => {
  let currentUserLike = false;
  await firebase
    .firestore()
    .collection("post")
    .doc(uid)
    .collection("userPosts")
    .doc(postId)
    .collection("likes")
    .get()
    .then((snapshot) => {
      for (let i = 0; i < snapshot.docs.length; i++) {
        if (snapshot.docs[i].id === firebase.auth().currentUser.uid) {
          currentUserLike = true;
        }
      }
    });
  return {
    type: USER_LIKES_STATE_CHANGE,
    payload: { currentUserLike, postId, uid },
  };
};
