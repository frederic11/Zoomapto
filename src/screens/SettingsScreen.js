import React, { useEffect } from "react";
import { StyleSheet, View, Image } from "react-native";
import { useTheme, Text, Switch, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import zoomapto from "../api/zoomapto";

const SettingsScreen = ({ isDarkTheme, toggleTheme }) => {
  const theme = useTheme();

  const callZoomaptoApi = async () => {
    try {
      console.log("I'm here!");
      const response = await zoomapto.get("/WeatherForecast");
      console.log(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../../assets/icon.png")}
        style={{
          width: 200,
          height: 200,
          margin: 8,
          alignSelf: "center",
          borderRadius: 20,
        }}
      />
      <View style={{ flexDirection: "row" }}>
        <Text>Dark Mode</Text>
        <Switch
          style={{ flex: 1 }}
          value={isDarkTheme}
          onValueChange={() => {
            toggleTheme();
          }}
        />
      </View>
      <Button onPress={callZoomaptoApi}>Call Zoomapto API</Button>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 8,
  },
});

export default SettingsScreen;
