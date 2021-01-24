import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import { Card, Avatar } from "react-native-paper";
import { Context as RestaurantContext } from "../contexts/RestaurantContext";

const RestaurantHeaderCard = () => {
  const { state } = useContext(RestaurantContext);

  if (!state) {
    return null;
  }

  const LeftContent = (props) => {
    if (!state.selectedRestaurant.restaurant.thumb) {
      return null;
    }

    return (
      <Avatar.Image
        {...props}
        size={50}
        source={{
          uri: state.selectedRestaurant.restaurant.thumb,
        }}
      />
    );
  };

  return (
    <Card style={styles.headerCard} elevation={4}>
      <Card.Title
        title={state.selectedRestaurant.restaurant.name}
        subtitle={state.selectedRestaurant.restaurant.cuisines}
        left={LeftContent}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  headerCard: { margin: 8 },
  iconButtonGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});

export default RestaurantHeaderCard;
