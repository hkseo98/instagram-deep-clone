//import liraries
import React, { Component, useState, useEffect } from "react";
import { View, TextInput, StyleSheet, Button } from "react-native";
import firebase from "firebase";
// create a component
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSignUp = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  return (
    <View style={styles.container}>
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
      <Button onPress={onSignUp} title="Sign In" />
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
export default Login;
