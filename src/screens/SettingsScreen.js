import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme, Text, Switch } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const SettingsScreen = ({ isDarkTheme, toggleTheme }) => {
  const theme = useTheme();

  return (
    <SafeAreaView>
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

const styles = StyleSheet.create({});

export default SettingsScreen;
