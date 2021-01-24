import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import { Card, List, TouchableRipple, Text } from "react-native-paper";
import { Context as RestaurantContext } from "../contexts/RestaurantContext";
import AppLink from "react-native-app-link";

const RestaurantFoodCard = () => {
  const { state } = useContext(RestaurantContext);

  const openZomatoAppUsingDeepLink = () => {
    AppLink.maybeOpenURL(state.selectedRestaurant.restaurant.deeplink, {
      appName: "zomato - online food delivery & restaurant reviews",
      playStoreId: "com.application.zomato",
      appStoreId: "434613896",
    })
      .then(() => {
        // do stuff
      })
      .catch((err) => {
        // handle error
        console.log(err);
        console.log(state.selectedRestaurant.restaurant.deeplink);
      });
  };

  return (
    <Card style={styles.contentCard} elevation={4}>
      <Card.Title title="Food" />
      <Card.Content>
        <TouchableRipple onPress={() => console.log("Pressed")}>
          <List.Item
            title="Menu"
            titleNumberOfLines={3}
            left={(props) => <List.Icon {...props} icon="food" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
        </TouchableRipple>
        {state &&
          Boolean(state.selectedRestaurant.restaurant.has_online_delivery) && (
            <TouchableRipple onPress={openZomatoAppUsingDeepLink}>
              <List.Item
                title="Order Online - Powered by Zomato"
                titleNumberOfLines={3}
                subtitle={
                  state &&
                  state.selectedRestaurant.restaurant.is_delivering_now ? (
                    <Text>Not Accepting Orders Currently</Text>
                  ) : null
                }
                left={(props) => <List.Icon {...props} icon="bike-fast" />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
              />
            </TouchableRipple>
          )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  contentCard: { marginHorizontal: 8, marginBottom: 8 },
});

export default RestaurantFoodCard;
