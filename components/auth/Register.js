//import liraries
import React, { Component, useState, useEffect } from "react";
import { View, TextInput, StyleSheet, Button } from "react-native";
import firebase from "firebase";
// create a component
const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const onSignUp = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        firebase
          .firestore()
          .collection("users")
          .doc(firebase.auth().currentUser.uid)
          .set({
            name,
            email,
            password,
          });
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="name"
        value={name}
        onChangeText={(name) => setName(name)}
      />
      <TextInput
        placeholder="email"
        value={email}
        onChangeText={(email) => setEmail(email)}
      />
      <TextInput
        placeholder="password"
        value={password}
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />
      <Button onPress={onSignUp} title="Sign Up" />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

//make this component available to the app
export default Register;
