//import liraries
import React, { Component, useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, FlatList, Button } from "react-native";
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
  const [user, setUser] = useState([]);
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
  // console.log(posts[0].downloadURL);

  useEffect(() => {
    console.log(searchUserEmail);
    console.log(currentUser.email);

    if (searchUserEmail === currentUser.email || searchUserEmail === "") {
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
      console.log(followingState);
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
    // dispatch(fetchUsersFollowingPosts(followingState[i]));
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
    // dispatch(fetchUsersFollowingPosts(followingState[i]));
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
        <Image
          source={{
            uri:
              "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMTAzMTRfMTAx%2FMDAxNjE1Njc5Mzk1OTcz.iBvH1vfI6y1H1hsNtDeT3VhyUNjioLisrqsw_3IAihgg.5aEfmqbFW1j3YwlLfbz9HW890MHHiiu3X42bdI0ZoeMg.JPEG.yhjhdh0828%2FKakaoTalk_20210314_082231928_04.jpg&type=a340",
          }}
        />
      </View>
      <View style={styles.containerGallery}>
        <FlatList
          numColumns={3}
          horizontal={false}
          data={userPosts}
          renderItem={({ item }) => (
            <View style={styles.containerImage}>
              {/* <Text>{item.downloadURL}</Text> */}
              <Image style={styles.image} source={{ uri: item.downloadURL }} />
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
