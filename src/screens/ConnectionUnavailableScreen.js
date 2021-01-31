import React from "react";
import { StyleSheet, Image, ScrollView } from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const ConnectionUnavailableScreen = () => {
  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
      <ScrollView>
        <Image
          style={{
            marginVertical: 8,
            width: 350,
            height: 350,
            alignSelf: "center",
          }}
          source={require("../../assets/no-connection.gif")}
        />
        <Text style={{ alignSelf: "center", fontSize: 20, margin: 8 }}>
          We couldn't connect to the internet!
        </Text>
        <Text style={{ fontSize: 14, margin: 8 }}>
          We'll take you right back to Zoomapto once we detect an internet
          connection again.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default ConnectionUnavailableScreen;
