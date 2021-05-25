import firebase from "firebase";
import { USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE } from "../constants/index";

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
