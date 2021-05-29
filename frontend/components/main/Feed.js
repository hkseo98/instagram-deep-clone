//import liraries
import React, { Component, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { FETCH_ALL_FEEDS } from "../../redux/constants/index";
import firebase from "firebase";
import Icon from "react-native-vector-icons/AntDesign";
import { fetchUsersFollowingLikes } from "../../redux/actions/index";

// create a component
const Feed = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [like, setLike] = useState(0);
  let userLoaded = useSelector((state) => state.usersState.userLoaded);
  let users = useSelector((state) => state.usersState.users);

  const dispatch = useDispatch();
  useEffect(() => {
    let posts = [];
    for (let i = 0; i < users.length; i++) {
      for (let j = 0; j < users[i].posts.length; j++) {
        let user = users[i].user;
        let post = users[i].posts[j];
        posts.push({ user, post });
      }
    }
    posts.sort(
      (x, y) => y.post.data.creation.seconds - x.post.data.creation.seconds
    );
    posts.map((post) =>
      dispatch(fetchUsersFollowingLikes(post.user.uid, post.post.postId))
    );

    setPosts(posts);
  }, [userLoaded, like]);

  const onLikePress = (userId, postId) => {
    firebase
      .firestore()
      .collection("post")
      .doc(userId)
      .collection("userPosts")
      .doc(postId)
      .collection("likes")
      .doc(firebase.auth().currentUser.uid)
      .set({});
    dispatch(fetchUsersFollowingLikes(userId, postId));
    posts.map((post) => {
      if (post.post.postId == postId) {
        post.post.data.likesCount += 1;
      }
      return post;
    });
    setPosts(posts);
  };

  const onDislikePress = (userId, postId) => {
    firebase
      .firestore()
      .collection("post")
      .doc(userId)
      .collection("userPosts")
      .doc(postId)
      .collection("likes")
      .doc(firebase.auth().currentUser.uid)
      .delete();
    dispatch(fetchUsersFollowingLikes(userId, postId));
    posts.map((post) => {
      if (post.post.postId == postId) {
        post.post.data.likesCount -= 1;
      }
      return post;
    });
    setPosts(posts);
  };

  return (
    <View style={styles.container}>
      <FlatList
        numColumns={1}
        horizontal={false}
        data={posts}
        renderItem={({ item }) => (
          <View style={styles.containerImage}>
            <Text style={styles.container}>{item.user.name}</Text>
            <Image
              style={styles.image}
              source={{ uri: item.post.data.downloadURL }}
            />
            {item.post.currentUserLike ? (
              <TouchableOpacity
                onPress={() => onDislikePress(item.user.uid, item.post.postId)}
              >
                <Icon size={20} name="heart" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => onLikePress(item.user.uid, item.post.postId)}
              >
                <Icon size={20} name="hearto" />
              </TouchableOpacity>
            )}
            <Text>
              {item.post.data.likesCount ? item.post.data.likesCount : 0} likes
            </Text>

            <Text
              style={{ marginBottom: 10 }}
              onPress={() =>
                navigation.navigate("Comment", {
                  postId: item.post.postId,
                  uid: item.user.uid,
                })
              }
            >
              View Comments...
            </Text>
          </View>
        )}
      />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    aspectRatio: 1 / 1,
  },
  containerImage: {
    flex: 1 / 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
  },
});

//make this component available to the app
export default Feed;
