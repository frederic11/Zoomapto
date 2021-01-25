import React, { useContext } from "react";
import { StyleSheet, Linking } from "react-native";
import { Card, List, TouchableRipple, Text } from "react-native-paper";
import { Context as RestaurantContext } from "../contexts/RestaurantContext";
import AppLink from "react-native-app-link";
import { useNavigation } from "@react-navigation/native";

const RestaurantFoodCard = () => {
  const { state } = useContext(RestaurantContext);
  const navigation = useNavigation();

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
      });
  };

  return (
    <Card style={styles.contentCard} elevation={4}>
      <Card.Title title="Food" />
      <Card.Content>
        <TouchableRipple
          onPress={() =>
            Linking.canOpenURL(
              state.selectedRestaurant.restaurant.menu_url
            ).then((supported) => {
              if (supported) {
                Linking.openURL(state.selectedRestaurant.restaurant.menu_url);
              } else {
                console.log("Don't know how to open URL");
              }
            })
          }
        >
          <List.Item
            title="Menu | Powered by Zomato"
            titleNumberOfLines={3}
            left={(props) => <List.Icon {...props} icon="food" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
        </TouchableRipple>
        {state &&
          Boolean(state.selectedRestaurant.restaurant.has_online_delivery) && (
            <TouchableRipple onPress={openZomatoAppUsingDeepLink}>
              <List.Item
                title="Order Online | Powered by Zomato"
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
