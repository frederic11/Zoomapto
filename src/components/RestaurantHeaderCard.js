import React, { useContext, useState } from "react";
import { StyleSheet } from "react-native";
import { Card, Avatar, TouchableRipple } from "react-native-paper";
import { Context as RestaurantContext } from "../contexts/RestaurantContext";

const RestaurantHeaderCard = ({ snapBottomBarToIndex }) => {
  const { state } = useContext(RestaurantContext);

  if (!state || !state.selectedRestaurant) {
    return null;
  }

  const LeftContent = (props) => {
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
      <TouchableRipple onPress={() => snapBottomBarToIndex(0)}>
        <Card.Title
          title={state.selectedRestaurant.restaurant.name}
          subtitle={state.selectedRestaurant.restaurant.cuisines}
          left={state.selectedRestaurant.restaurant.thumb ? LeftContent : null}
        />
      </TouchableRipple>
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
