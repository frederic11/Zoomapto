import React from "react";
import { View, StyleSheet, Linking } from "react-native";
import { Card, Button } from "react-native-paper";
import { useRoute } from "@react-navigation/native";

const CallScreen = () => {
  const route = useRoute();
  const { phoneNumbers } = route.params;

  const phoneNumberArray = phoneNumbers.split(",");

  return (
    <View style={styles.container}>
      <Card style={styles.callCard} elevation={4}>
        <Card.Content>
          {phoneNumberArray.map((phoneNumber) => {
            return (
              <Button
                key={phoneNumber}
                style={styles.callButton}
                onPress={() => Linking.openURL(`tel:${phoneNumber}`)}
              >
                Call {phoneNumber.trim()}
              </Button>
            );
          })}
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-around",
  },
  callCard: {
    margin: 8,
    marginBottom: 100,
    textAlign: "center",
  },
  callButton: {
    margin: 4,
  },
});

export default CallScreen;
