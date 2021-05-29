//import liraries
import React, { Component, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TextInput,
  Button,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";
import firebase from "firebase";
import { useSelector } from "react-redux";
// create a component
const Photo = (props) => {
  const [text, setText] = useState("");
  const users = useSelector((state) => state.usersState.allUsers.users);
  const [comments, setComments] = useState([]);
  const user = props.route.params.user;
  const post = props.route.params.post;
  const uid =
    props.route.params.uid !== undefined
      ? props.route.params.uid
      : firebase.auth().currentUser.uid;

  const matchUserToComment = (comments) => {
    for (let i = 0; i < comments.length; i++) {
      if (comments[i].hasOwnProperty("user")) {
        continue;
      }
      const user = users.find((x) => x.uid === comments[i].creator);
      comments[i].user = user;
    }
    comments.sort((x, y) => x.creation.seconds - y.creation.seconds);
    setComments(comments);
  };
  useEffect(() => {
    firebase
      .firestore()
      .collection("post")
      .doc(uid)
      .collection("userPosts")
      .doc(post.id)
      .collection("comments")
      .get()
      .then((snapshot) => {
        let comments = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        matchUserToComment(comments);
      });
  }, []);

  const onCommentSend = () => {
    if (text === "") {
      return;
    }
    firebase
      .firestore()
      .collection("post")
      .doc(uid)
      .collection("userPosts")
      .doc(post.id)
      .collection("comments")
      .add({
        // 자동으로 아이디 생성됨
        creation: firebase.firestore.FieldValue.serverTimestamp(),
        creator: firebase.auth().currentUser.uid,
        text: text,
      });
    setText("");
    let newComment = {
      creation: firebase.firestore.FieldValue.serverTimestamp(),
      creator: firebase.auth().currentUser.uid,
      text: text,
    };
    matchUserToComment([...comments, newComment]);
  };

  const onDelete = (comment) => {
    firebase
      .firestore()
      .collection("post")
      .doc(uid)
      .collection("userPosts")
      .doc(post.id)
      .collection("comments")
      .doc(comment.id)
      .delete();
    let newComments = comments.filter((item) => item.id !== comment.id);
    setComments(newComments);
  };

  const onImageDelete = () => {
    Alert.alert("Delete Image", "really??", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          var desertRef = firebase.storage().ref().child(post.downloadURL);
          desertRef
            .delete()
            .then(function () {})
            .catch(function (error) {
              console.log("failed deleting");
            });

          //   firebase
          //     .firestore()
          //     .collection("post")
          //     .doc(uid)
          //     .collection("userPosts")
          //     .doc(post.id);
          //     .collection('comments')
          //     .doc
          //     .delete()

          //   firebase
          //     .firestore()
          //     .collection("post")
          //     .doc(uid)
          //     .collection("userPosts")
          //     .doc(post.id);
          //     .collection('likes')
          //     .delete()

          //   firebase
          //     .firestore()
          //     .collection("post")
          //     .doc(uid)
          //     .collection("userPosts")
          //     .doc(post.id)
          //     .delete();

          props.navigation.navigate("Profile");
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={{ fontSize: 20, margin: 10 }}>{user.name}</Text>
        {uid === firebase.auth().currentUser.uid && (
          <Button title="delete" onPress={() => onImageDelete()} />
        )}
      </View>

      <Image style={styles.image} source={{ uri: post.downloadURL }} />
      <Text style={{ fontSize: 20, marginBottom: 20 }}>
        caption: {props.route.params.post.caption}
      </Text>

      <View>
        <TextInput
          style={{ borderWidth: 1, borderRadius: 5 }}
          value={text}
          placeholder="write some comment"
          placeholderTextColor="#6ccad0"
          onChangeText={(text) => setText(text)}
        />
        <Button title="Send" onPress={() => onCommentSend()} />
        <Button
          title="Back"
          onPress={() => props.navigation.navigate("Feed")}
        />
      </View>

      <View>
        <Text
          style={{
            textDecorationLine: "underline",
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          Comments
        </Text>

        <SafeAreaView>
          <ScrollView>
            {comments.map((comment, idx) => {
              return comment.user.uid === firebase.auth().currentUser.uid ? (
                <View
                  key={idx}
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    borderBottomWidth: 1,
                    borderColor: "black",
                  }}
                >
                  <Text style={styles.text}>
                    {comment.user.name} {""}
                  </Text>
                  <Text>
                    {comment.text} {""}
                  </Text>
                  <TouchableOpacity onPress={() => onDelete(comment)}>
                    <Text style={{ color: "#6ccad0" }}>delete</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  key={idx}
                  style={{
                    flexDirection: "row",
                    borderBottomWidth: 1,
                    borderColor: "black",
                  }}
                >
                  <Text style={styles.text}>
                    {comment.user.name} {""}
                  </Text>
                  <Text>{comment.text}</Text>
                </View>
              );
            })}
          </ScrollView>
        </SafeAreaView>
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#2c3e50",
  },
  image: {
    width: 300,
    aspectRatio: 1 / 1,
  },
  text: {
    fontWeight: "bold",
    fontSize: 15,
  },
});

//make this component available to the app
export default Photo;
