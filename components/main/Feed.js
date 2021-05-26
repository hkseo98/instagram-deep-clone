//import liraries
import React, { Component, useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, FlatList } from "react-native";
import { useSelector } from "react-redux";

// create a component
const Feed = () => {
  const [posts, setPosts] = useState([]);
  let userLoaded = useSelector((state) => state.usersState.userLoaded);
  let users = useSelector((state) => state.usersState.users);
  useEffect(() => {
    let posts = [];
    for (let i = 0; i < users.length; i++) {
      for (let j = 0; j < users[i].posts.length; j++) {
        let user = users[i].user;
        let post = users[i].posts[j];
        posts.push({ user, post });
      }
    }

    posts.sort((x, y) => x.post.creation.seconds - y.post.creation.seconds);
    setPosts(posts);
  }, [userLoaded]);

  return (
    <View style={styles.container}>
      <View style={styles.containerGallery}>
        <FlatList
          numColumns={1}
          horizontal={false}
          data={posts}
          renderItem={({ item }) => (
            <View style={styles.containerImage}>
              <Text style={styles.container}>{item.user.user.name}</Text>
              <Image
                style={styles.image}
                source={{ uri: item.post.downloadURL }}
              />
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
export default Feed;
