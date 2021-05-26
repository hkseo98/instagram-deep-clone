import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Landing from "./components/auth/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import MainScreen from "./components/Main";
import Save from "./components/main/Save";

import firebase from "firebase/app";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import rootReducer from "./redux/reducers/index";
import thunk from "redux-thunk";
import promiseMiddleware from "redux-promise"; // 비동기적으로 promise 객체를 받을 수 있게 해줌.
import { composeWithDevTools } from "redux-devtools-extension";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBglDtPomLjpIdhJWYSBoMRReIB1weqyko",
  authDomain: "instagram-demo-e571d.firebaseapp.com",
  projectId: "instagram-demo-e571d",
  storageBucket: "instagram-demo-e571d.appspot.com",
  messagingSenderId: "212734285005",
  appId: "1:212734285005:web:44479eefbe1ee97091c584",
  measurementId: "G-9CJCYDYRJ3",
};

firebase.initializeApp(firebaseConfig);

const Stack = createStackNavigator();

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(promiseMiddleware, thunk))
);

export default function App(props) {
  const [loaded, setLoaded] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        setLoggedIn(false);
        setLoaded(true);
      } else {
        setLoggedIn(true);
        setLoaded(true);
      }
    });
  }, []);
  if (!loaded) {
    return (
      <View>
        <Text>loading...</Text>
      </View>
    );
  }
  if (!loggedIn) {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Landing">
          <Stack.Screen
            name="Landing"
            component={Landing}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Login" component={Login} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Instagram"
            component={MainScreen}
            options={({ navigation }) => ({
              headerRight: () => (
                <Button
                  title="Logout"
                  onPress={() => {
                    firebase
                      .auth()
                      .signOut()
                      .then(() => {
                        navigation.navigate("Landing");
                      })
                      .catch((error) => {
                        // An error happened.
                      });
                  }}
                />
              ),
            })}
          />
          <Stack.Screen
            name="Save"
            component={Save}
            options={{ headerShown: false }}
            navigation={props.navigation}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
