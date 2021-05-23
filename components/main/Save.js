//import liraries
import React, { Component, useState } from "react";
import { View, Text, StyleSheet, TextInput, Image, Button } from "react-native";
import firebase from "firebase";

// create a component
const Save = (props) => {
  const [Caption, setCaption] = useState("");

  const uploadImage = async () => {
    const uri = props.route.params.image;
    const childPath = `post/${
      firebase.auth().currentUser.uid
    }/${Math.random().toString(36)}`;
    const response = await fetch(uri);
    const blob = await response.blob();
    console.log(childPath);

    const task = firebase.storage().ref().child(childPath).put(blob);
    const taskProgress = () => {
      console.log(`transferred: ${task.snapshot.bytesTransfered}`);
    };
    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        savePostData(snapshot); // firestore에 데이터 저장, storage는 사진, 동영상 용
        console.log(snapshot);
      });
    };
    const taskError = (snapshot) => {
      console.log(snapshot);
    };
    task.on("state_changed", taskProgress, taskError, taskCompleted);
  };

  const savePostData = (downloadURL) => {
    firebase
      .firestore()
      .collection("post")
      .doc(firebase.auth().currentUser.uid)
      .collection("userPosts")
      .add({
        downloadURL,
        caption: Caption,
        creation: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(function () {
        props.navigation.popToTop(); // App 컴포넌트에서부터 차례로 navigation을 porps로 전달해주어야 사용 가능!
      });
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: props.route.params.image }} style={{ flex: 1 }} />
      <TextInput
        placeholder="write a caption"
        onChangeText={(caption) => setCaption(caption)}
      />
      <Button title="Save" onPress={() => uploadImage()} />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2c3e50",
  },
});

//make this component available to the app
export default Save;
