import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, Image } from "react-native";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";

export default function Add({ navigation: { navigate } }) {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");

      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
      setImage(data.uri);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  if (hasCameraPermission === null || hasGalleryPermission === false) {
    return <View />;
  }
  if (hasCameraPermission === false || hasGalleryPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: "row", flex: 1 }}>
        <Camera
          ref={(ref) => setCamera(ref)} // ref를 통해 해당 컴포넌트에 대한 정보를 담아줌
          type={type}
          style={{ aspectRatio: 1 }}
          ratio={"1:1"}
        />
      </View>

      <Button
        style={{ flex: 1 }}
        title="Flip Image"
        onPress={() => {
          setType(
            type === Camera.Constants.Type.back
              ? Camera.Constants.Type.front
              : Camera.Constants.Type.back
          );
        }}
      ></Button>
      <Button
        style={{ flex: 1 }}
        title="Take Picture"
        onPress={() => {
          takePicture();
        }}
      />
      <Button
        style={{ flex: 1 }}
        title="Pick Image From Gallery"
        onPress={() => {
          pickImage();
        }}
      />
      <Button
        style={{ flex: 1 }}
        title="save"
        onPress={() => {
          navigate("Save", { image }); // navigate()를 통해 화면 전환과 동시에 props를 전달할 수도 있다.
        }}
      />
      {image && <Image source={{ uri: image }} style={{ flex: 1 }} />}
    </View>
  );
}
