//import liraries
import React, { Component, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Button,
  TouchableHighlight,
} from "react-native";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import firebase from "firebase";
import { DELETE_FOLLOWING } from "../../redux/constants/index";
import {
  fetchUserFollowing,
  fetchUsersData,
  // fetchUsersFollowingPosts,
} from "../../redux/actions/index";

// create a component
const Profile = (props) => {
  const dispatch = useDispatch();
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [following, setFollowing] = useState(false);

  const currentUser = useSelector(
    (state) => state.userState.currentUser,
    shallowEqual
  );

  const followingState = useSelector((state) => state.userState.following);

  let searchUserEmail = "";
  if (props.route.params === undefined) {
    searchUserEmail = "";
  } else {
    searchUserEmail = props.route.params.email;
  }

  const posts = useSelector((state) => state.userState.posts, shallowEqual);

  useEffect(() => {
    if (
      searchUserEmail === currentUser.email ||
      searchUserEmail === "" ||
      props.currentUser
    ) {
      setUser(currentUser);
      setUserPosts(posts);
    } else {
      firebase
        .firestore()
        .collection("users")
        .doc(props.route.params.uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            setUser(snapshot.data());
          } else {
            console.log("does not exist");
          }
        });
      firebase
        .firestore()
        .collection("post")
        .doc(props.route.params.uid)
        .collection("userPosts")
        .orderBy("creation", "asc")
        .get()
        .then((snapshot) => {
          let posts = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          setUserPosts(posts);
        });
      setFollowing(false);
      followingState.map((id) => {
        if (id === props.route.params.uid) {
          setFollowing(true);
        }
      });
    }
  }, [searchUserEmail, followingState]);

  const onFollow = () => {
    firebase
      .firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .doc(props.route.params.uid)
      .set({});
    setFollowing(!following);
    dispatch(fetchUserFollowing());
    dispatch(fetchUsersData(props.route.params.uid));
  };

  const onUnfollow = () => {
    firebase
      .firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .doc(props.route.params.uid)
      .delete();
    setFollowing(!following);
    dispatch(fetchUserFollowing());
    dispatch({ type: DELETE_FOLLOWING, payload: props.route.params.uid });
    for (let i = 0; i < followingState.length; i++) {
      fetchUsersData(followingState[i]);
    }
  };

  const onImagePress = (user, post, uid) => {
    props.navigation.navigate("Photo", { user, post, uid });
  };

  if (user === null) {
    return <View />;
  }
  return (
    <View style={styles.container}>
      <View style={styles.containerInfo}>
        <Text>{user.name}</Text>
        <Text>{user.email}</Text>
        {searchUserEmail !== "" && searchUserEmail !== currentUser.email ? (
          <View>
            {following ? (
              <Button title="Following" onPress={() => onUnfollow()} />
            ) : (
              <Button title="Follow" onPress={() => onFollow()} />
            )}
          </View>
        ) : null}
      </View>
      <View style={styles.containerGallery}>
        <FlatList
          numColumns={3}
          horizontal={false}
          data={userPosts}
          renderItem={({ item, index }) => (
            <View style={styles.containerImage}>
              <TouchableHighlight
                onPress={() =>
                  props.route.params
                    ? onImagePress(user, item, props.route.params.uid)
                    : onImagePress(user, item)
                }
              >
                <Image
                  style={styles.image}
                  source={{ uri: item.downloadURL }}
                />
              </TouchableHighlight>
            </View>
          )}
        />
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2c3e50",
  },
  containerInfo: {
    margin: 20,
  },
  containerGallery: {
    flex: 1,
  },
  image: {
    flex: 1,
    aspectRatio: 1 / 1,
  },
  containerImage: {
    flex: 1 / 3,
  },
});

//make this component available to the app
export default Profile;
