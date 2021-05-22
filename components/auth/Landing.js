//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet, Button } from "react-native";

// create a component
const Landing = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Button
        title="Register"
        onPress={() => navigation.navigate("Register")}
      ></Button>
      <Button
        title="Login"
        onPress={() => navigation.navigate("Login")}
      ></Button>
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
export default Landing;
