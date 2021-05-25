//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet, Image, FlatList } from "react-native";
import { useSelector, shallowEqual } from "react-redux";

// create a component
const Profile = () => {
  const user = useSelector(
    (state) => state.userState.currentUser,
    shallowEqual
  );
  const posts = useSelector((state) => state.userState.posts, shallowEqual);
  // console.log(posts[0].downloadURL);
  return (
    <View style={styles.container}>
      <View style={styles.containerInfo}>
        <Text>{user.name}</Text>
        <Text>{user.email}</Text>
      </View>
      <View style={styles.containerGallery}>
        <FlatList
          numColumns={3}
          horizontal={false}
          data={posts}
          renderItem={({ item }) => (
            <View style={styles.containerImage}>
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
