import firebase from "firebase";
import { USER_STATE_CHANGE } from "../constants/index";

export const fetchUser = async () => {
  const user = await firebase
    .firestore()
    .collection("users")
    .doc(firebase.auth().currentUser.uid)
    .get()
    .then((user) => user.data());
  console.log(user);
  return {
    type: USER_STATE_CHANGE,
    payload: user,
  };
};
