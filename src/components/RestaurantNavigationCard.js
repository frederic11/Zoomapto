import React, { useContext } from "react";
import { StyleSheet, Platform, Linking } from "react-native";
import { Card, List, TouchableRipple, Text } from "react-native-paper";
import { Context as RestaurantContext } from "../contexts/RestaurantContext";
import AppLink from "react-native-app-link";

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

  const hailUber = () => {
    AppLink.maybeOpenURL(
      "uber://?action=setPickup&client_id=f1utNZZB274yo3q_ZLvtfB23yeHvaJJt&pickup[formatted_address]=Furn%20El%20Chebbak%20Municipality%2C%20Beirut%2C%20Lebanon&pickup[latitude]=33.870731&pickup[longitude]=35.526057&dropoff[formatted_address]=Dekwaneh%20Municipality%2C%20Lebanon&dropoff[latitude]=33.879388&dropoff[longitude]=35.543721",
      {
        appName: "Uber - Request a ride",
        playStoreId: "com.ubercab",
        appStoreId: "368677368",
      }
    )
      .then(() => {
        // do stuff
      })
      .catch((err) => {
        // handle error
      });
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
        <TouchableRipple onPress={() => hailUber()}>
          <List.Item
            title="Uber me there!"
            titleNumberOfLines={3}
            left={(props) => <List.Icon {...props} icon="hail" />}
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
