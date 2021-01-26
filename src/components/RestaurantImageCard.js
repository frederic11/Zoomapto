import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import { Context as RestaurantContext } from "../contexts/RestaurantContext";

const RestaurantImageCard = () => {
  const { state } = useContext(RestaurantContext);

  if (
    !state ||
    !state.selectedRestaurant ||
    !state.selectedRestaurant.restaurant ||
    !state.selectedRestaurant.restaurant.featured_image
  ) {
    return null;
  }

  return (
    <Card style={styles.contentCard} elevation={4}>
      <Card.Cover
        source={{ uri: state.selectedRestaurant.restaurant.featured_image }}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  contentCard: { marginHorizontal: 8, marginBottom: 8 },
});

export default RestaurantImageCard;
