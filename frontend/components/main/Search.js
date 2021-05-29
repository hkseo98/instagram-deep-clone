//import liraries
import React, { Component, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import firebase from "firebase";

// create a component
const Search = ({ navigation }) => {
  const [users, setUsers] = useState([]);

  const fetchUsers = (search) => {
    firebase
      .firestore()
      .collection("users")
      .where("name", ">=", search)
      .get()
      .then((snapshot) => {
        let users = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id; // uid
          return { id, ...data };
        });
        setUsers(users);
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={{
          marginTop: 10,
          borderColor: "black",
          borderWidth: 3,
          borderRadius: 5,
        }}
        placeholder="Type here"
        onChangeText={(search) => fetchUsers(search)}
      />
      <FlatList
        numColumns={1}
        horizontal={false}
        data={users}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Profile", {
                uid: item.id,
                email: item.email,
              })
            }
          >
            <Text style={{ fontSize: 20, marginTop: 10 }}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
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
export default Search;
