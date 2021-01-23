import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "react-native-paper";

const ListScreen = () => {
  return (
    <SafeAreaView>
      <Text>List Screen</Text>
      <Button
        icon="camera"
        mode="contained"
        onPress={() => console.log("Pressed")}
      >
        Press me
      </Button>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default ListScreen;
