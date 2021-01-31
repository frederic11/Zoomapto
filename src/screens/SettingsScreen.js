import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { useTheme, Text, Switch, Title } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const SettingsScreen = ({ isDarkTheme, toggleTheme }) => {
  const theme = useTheme();

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 8,
  },
});

export default SettingsScreen;
