import React from "react";
import { StyleSheet, View } from "react-native";
import {
  Avatar,
  Card,
  Title,
  Paragraph,
  Text,
  Surface,
} from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

const MapMarker = ({ restaurant }) => {
  const backgroundColorRating = `#${restaurant.restaurant.user_rating.rating_color}`;

  return (
    <Surface
      style={[styles.surface, { backgroundColor: backgroundColorRating }]}
    >
      <Text style={styles.text}>
        {restaurant.restaurant.user_rating.aggregate_rating}
      </Text>
    </Surface>
  );
};

const styles = StyleSheet.create({
  text: {
    textAlign: "center",
  },
  surface: {
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
});

export default MapMarker;
