//import liraries
import React, { Component, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { fetchUser } from "../redux/actions/index";
import { useDispatch, useSelector } from "react-redux";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Feed from "./main/Feed";
import Add from "./main/Add";
import Profile from "./main/Profile";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const Tab = createBottomTabNavigator();

const Main = ({ navigation }) => {
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  useEffect(() => {
    dispatch(fetchUser()).then((res) => {
      setTimeout(() => {
        setUser(res.payload);
      }, 20);
    });
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="Feed"
      tabBarOptions={{ showLabel: false, activeTintColor: "black" }}
    >
      <Tab.Screen
        name="Feed"
        component={Feed}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Add"
        component={Add}
        navigation={navigation}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="plus-box" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="account-circle" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
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
export default Main;
