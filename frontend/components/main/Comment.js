//import liraries
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  TouchableOpacity,
  TextInput,
} from "react-native";
import firebase from "firebase";
import { useSelector } from "react-redux";

// create a component
const Comment = (props) => {
  const [comments, setComments] = useState([]);
  const [postId, setPostId] = useState("");
  const [text, setText] = useState("");

  const users = useSelector((state) => state.usersState.allUsers.users);

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
    if (props.route.params.postId !== postId) {
      firebase
        .firestore()
        .collection("post")
        .doc(props.route.params.uid)
        .collection("userPosts")
        .doc(props.route.params.postId)
        .collection("comments")
        .get()
        .then((snapshot) => {
          let comments = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          matchUserToComment(comments);
          console.log(comments);
        });
      setPostId(props.route.params.postId);
    } else {
      matchUserToComment(comments);
    }
  }, [props.route.params.postId, users]);

  const onCommentSend = () => {
    if (text === "") {
      return;
    }
    firebase
      .firestore()
      .collection("post")
      .doc(props.route.params.uid)
      .collection("userPosts")
      .doc(props.route.params.postId)
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

  const onDelete = (item) => {
    console.log(item);
    firebase
      .firestore()
      .collection("post")
      .doc(props.route.params.uid)
      .collection("userPosts")
      .doc(props.route.params.postId)
      .collection("comments")
      .doc(item.id)
      .delete();
    let newComment = comments.filter((comment) => comment.id !== item.id);
    setComments(newComment);
  };

  return (
    <View>
      <View
        style={{
          marginTop: 100,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TextInput
          value={text}
          placeholder="write some comment"
          onChangeText={(text) => setText(text)}
        />
        <Button title="Send" onPress={() => onCommentSend()} />
        <Button
          title="Back"
          onPress={() => props.navigation.navigate("Feed")}
        />
      </View>
      <View>
        <FlatList
          numColumns={1}
          horizontal={false}
          data={comments}
          renderItem={({ item, index }) => (
            <View>
              <Text>{item.user.name}</Text>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <Text>{item.text}</Text>
                {item.creator === firebase.auth().currentUser.uid && (
                  <TouchableOpacity
                    onPress={() => onDelete(item)}
                    style={{
                      borderColor: "blue",
                      borderWidth: 1,
                      marginLeft: 5,
                    }}
                  >
                    <Text>delete</Text>
                  </TouchableOpacity>
                )}
              </View>
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
    justifyContent: "center",
    alignItems: "center",
    margin: 50,
  },
});

//make this component available to the app
export default Comment;
