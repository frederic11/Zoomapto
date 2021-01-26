import React, { useContext } from "react";
import { StyleSheet, Platform, Linking } from "react-native";
import { Card, List, TouchableRipple, Text } from "react-native-paper";
import { Context as RestaurantContext } from "../contexts/RestaurantContext";

const RestaurantNavigationCard = () => {
  const { state } = useContext(RestaurantContext);

  const navigateToGoogleMaps = (lat, lng, name) => {
    const scheme = Platform.select({
      ios: "maps:0,0?q=",
      android: "google.navigation:q=",
    });
    const latLng = `${lat},${lng}`;
    const label = name;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}`,
    });

    Linking.openURL(url);
  };

  return (
    <Card style={styles.contentCard} elevation={4}>
      <Card.Title title="Get There" titleNumberOfLines={3} />
      <Card.Content>
        <TouchableRipple
          onPress={() =>
            navigateToGoogleMaps(
              Number(state.selectedRestaurant.restaurant.location.latitude),
              Number(state.selectedRestaurant.restaurant.location.longitude),
              state.selectedRestaurant.restaurant.name
            )
          }
        >
          <List.Item
            title="Start Navigation"
            titleNumberOfLines={3}
            left={(props) => <List.Icon {...props} icon="navigation" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
        </TouchableRipple>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  contentCard: { marginHorizontal: 8, marginBottom: 8 },
});

export default RestaurantNavigationCard;
