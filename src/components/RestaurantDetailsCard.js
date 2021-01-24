import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import { Card, List } from "react-native-paper";
import { Context as RestaurantContext } from "../contexts/RestaurantContext";

const RestaurantDetailsCard = () => {
  const { state } = useContext(RestaurantContext);

  return (
    <Card style={styles.contentCard} elevation={4}>
      <Card.Title title="Details" />
      <Card.Content>
        <List.Item
          title={state && state.selectedRestaurant.restaurant.timings}
          left={(props) => <List.Icon {...props} icon="calendar-clock" />}
        />
        <List.Item
          title={`${state && state.selectedRestaurant.restaurant.currency} ${
            state && state.selectedRestaurant.restaurant.average_cost_for_two
          } for Two (approx.)`}
          left={(props) => <List.Icon {...props} icon="cash" />}
        />
        <List.Item
          title={state && state.selectedRestaurant.restaurant.location.address}
          titleNumberOfLines={3}
          left={(props) => <List.Icon {...props} icon="map-marker" />}
        />
        <List.Item
          title={state && state.selectedRestaurant.restaurant.phone_numbers}
          titleNumberOfLines={3}
          left={(props) => <List.Icon {...props} icon="phone" />}
        />
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  contentCard: { marginHorizontal: 8, marginBottom: 8 },
});

export default RestaurantDetailsCard;
