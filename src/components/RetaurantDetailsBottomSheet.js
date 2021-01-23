import React, { useContext, useRef, useEffect } from "react";
import { StyleSheet, View, Platform, Linking } from "react-native";
import { Button, Text } from "react-native-paper";
import Animated from "react-native-reanimated";
import BottomSheet from "reanimated-bottom-sheet";
import { Context as RestaurantContext } from "../contexts/RestaurantContext";
import { Avatar, Card, List, TouchableRipple } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AppLink from "react-native-app-link";

const RetaurantDetailsBottomSheet = ({ navigation }) => {
  const { state, setBottomSheefRef } = useContext(RestaurantContext);
  const LeftContent = (props) => (
    <Avatar.Image
      size={50}
      source={{
        uri: state && state.selectedRestaurant.restaurant.thumb,
      }}
    />
  );

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
      "https://m.uber.com/ul/?action=setPickup&client_id=f1utNZZB274yo3q_ZLvtfB23yeHvaJJt&pickup=my_location&dropoff[formatted_address]=Furn%20ElChebbak%20Municipality%2C%20Lebanon&dropoff[latitude]=33.873294&dropoff[longitude]=35.524976",
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

  const renderHeader = () => {
    if (!state) {
      return null;
    }

    return (
      <Card style={styles.headerCard} elevation={4}>
        <Card.Title
          title={state && state.selectedRestaurant.restaurant.name}
          subtitle={state && state.selectedRestaurant.restaurant.cuisines}
          left={LeftContent}
        />
      </Card>
    );
  };

  const renderContent = () => {
    if (!state) {
      return null;
    }

    return (
      <>
        <Card style={styles.contentCard} elevation={4}>
          <Card.Title title="Details" />
          <Card.Content>
            <List.Item
              title={state && state.selectedRestaurant.restaurant.timings}
              left={(props) => <List.Icon {...props} icon="calendar-clock" />}
            />
            <List.Item
              title={`${
                state && state.selectedRestaurant.restaurant.currency
              } ${
                state &&
                state.selectedRestaurant.restaurant.average_cost_for_two
              } for Two (approx.)`}
              left={(props) => <List.Icon {...props} icon="cash" />}
            />
            <List.Item
              title={
                state && state.selectedRestaurant.restaurant.location.address
              }
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
        <Card style={styles.contentCard} elevation={4}>
          <Card.Title title="Food" />
          <Card.Content>
            <TouchableRipple onPress={() => console.log("Pressed")}>
              <List.Item
                title="Menu - Powered by Zomato"
                titleNumberOfLines={3}
                left={(props) => <List.Icon {...props} icon="food" />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
              />
            </TouchableRipple>
            {state &&
              Boolean(
                state.selectedRestaurant.restaurant.has_online_delivery
              ) && (
                <TouchableRipple
                  onPress={() => {
                    AppLink.maybeOpenURL(
                      state.selectedRestaurant.restaurant.deeplink,
                      {
                        appName:
                          "zomato - online food delivery & restaurant reviews",
                        playStoreId: "com.application.zomato",
                        appStoreId: "434613896",
                      }
                    )
                      .then(() => {
                        // do stuff
                      })
                      .catch((err) => {
                        // handle error
                        console.log(err);
                        console.log(
                          state.selectedRestaurant.restaurant.deeplink
                        );
                      });
                  }}
                >
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
                    right={(props) => (
                      <List.Icon {...props} icon="chevron-right" />
                    )}
                  />
                </TouchableRipple>
              )}
          </Card.Content>
        </Card>
        <Card style={styles.contentCard} elevation={4}>
          <Card.Title title="Get There" titleNumberOfLines={3} />
          <Card.Content>
            <TouchableRipple
              onPress={() =>
                navigateToGoogleMaps(
                  Number(state.selectedRestaurant.restaurant.location.latitude),
                  Number(
                    state.selectedRestaurant.restaurant.location.longitude
                  ),
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
        <Card style={styles.contentCard} elevation={4}>
          <Card.Title
            title="Reviews"
            subtitle={`${state.selectedRestaurant.restaurant.user_rating.aggregate_rating} rating bases on ${state.selectedRestaurant.restaurant.all_reviews_count} reviews`}
            subtitleNumberOfLines={3}
            right={(props) => (
              <Button
                mode="text"
                style={{ marginRight: 4 }}
                onPress={() => {
                  navigation.navigate("Reviews");
                }}
              >
                All
              </Button>
            )}
          />
          <Card.Content>
            <Button mode="outlined" onPress={() => console.log("Pressed")}>
              Show Top 5 Most Recent Reviews
            </Button>
          </Card.Content>
        </Card>
      </>
    );
  };

  const sheetRef = useRef(null);

  useEffect(() => {
    if (state) {
      sheetRef.current.snapTo(2);
    }
  }, [state]);

  return (
    <BottomSheet
      ref={sheetRef}
      snapPoints={[450, 300, 90, 0]}
      initialSnap={3}
      borderRadius={10}
      renderHeader={renderHeader}
      renderContent={renderContent}
      enabledContentTapInteraction={false}
    />
  );
};

const styles = StyleSheet.create({
  surface: {
    marginHorizontal: 8,
  },
  headerCard: { margin: 8 },
  iconButtonGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  contentCard: { marginHorizontal: 8, marginBottom: 8 },
});

export default RetaurantDetailsBottomSheet;
