//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet, Image } from "react-native";

// create a component
const Feed = () => {
  return (
    <View style={styles.container}>
      <Text>Feed</Text>
      <Image
        style={{ flex: 1 }}
        source={{
          uri:
            "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMTAzMTRfMTAx%2FMDAxNjE1Njc5Mzk1OTcz.iBvH1vfI6y1H1hsNtDeT3VhyUNjioLisrqsw_3IAihgg.5aEfmqbFW1j3YwlLfbz9HW890MHHiiu3X42bdI0ZoeMg.JPEG.yhjhdh0828%2FKakaoTalk_20210314_082231928_04.jpg&type=a340",
        }}
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
export default Feed;
