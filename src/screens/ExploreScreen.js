import React, { useEffect, useState, useContext } from "react";
import { StyleSheet, View, FlatList, Image } from "react-native";
import {
  List,
  Surface,
  Text,
  Card,
  Paragraph,
  Title,
  TouchableRipple,
  ActivityIndicator,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import zomato from "../api/zomato";
import * as Location from "expo-location";
import { Context as RestaurantContext } from "../contexts/RestaurantContext";
import { useNavigation } from "@react-navigation/native";

const ExploreScreen = () => {
  const navigation = useNavigation();
  const [geoCodeData, setGeoCodeData] = useState(null);
  const [collectionsData, setCollectionsData] = useState(null);

  const { selectRestaurant } = useContext(RestaurantContext);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync({});

      try {
        const response = await zomato.get("/geocode", {
          params: {
            lat: latitude,
            lon: longitude,
          },
        });
        setGeoCodeData(response.data);
      } catch (e) {
        console.log(e);
      }

      try {
        const response = await zomato.get("/collections", {
          params: {
            lat: latitude,
            lon: longitude,
          },
        });
        setCollectionsData(response.data);
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  const showRestaurantDetails = (restaurant) => {
    selectRestaurant(restaurant);
    navigation.navigate("Restaurant");
  };

  if (!geoCodeData || !collectionsData) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ActivityIndicator animating={true} size={50} style={{ flexGrow: 1 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <Surface>
        <List.Item
          title={`${geoCodeData.location.title}, ${geoCodeData.location.city_name}, ${geoCodeData.location.country_name}`}
          left={(props) => <List.Icon {...props} icon="map-marker" />}
          titleNumberOfLines={1}
          titleStyle={styles.locationTitle}
        />
      </Surface>

      <FlatList
        data={geoCodeData.nearby_restaurants}
        keyExtractor={(item) => {
          return item.restaurant.id;
        }}
        ListHeaderComponent={
          <>
            <Surface>
              <Title style={{ fontSize: 24, margin: 8 }}>Collections</Title>

              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={collectionsData.collections}
                keyExtractor={(item) =>
                  item.collection.collection_id.toString()
                }
                renderItem={({ item }) => {
                  return (
                    <Surface
                      style={{
                        borderRadius: 4,
                        marginLeft: 8,
                        marginBottom: 8,
                      }}
                    >
                      <TouchableRipple
                        onPress={() =>
                          navigation.navigate("Collections", {
                            collection: item,
                            cityId: geoCodeData.location.city_id,
                          })
                        }
                        borderless={true}
                      >
                        <>
                          <Image
                            source={{ uri: item.collection.image_url }}
                            style={{
                              width: 250,
                              height: 400,
                              borderRadius: 20,
                            }}
                          />
                          <View
                            style={{
                              position: "absolute",
                              left: 0,
                              bottom: 0,
                              right: 0,
                              padding: 8,
                              backgroundColor: "rgba(255, 255, 255, 0.5)",
                              justifyContent: "center",
                              alignContent: "center",
                            }}
                          >
                            <Text style={{ fontSize: 20, color: "black" }}>
                              {item.collection.title}
                            </Text>
                          </View>
                        </>
                      </TouchableRipple>
                    </Surface>
                  );
                }}
              />
            </Surface>

            <Title style={{ fontSize: 24, margin: 8, marginTop: 12 }}>
              Restaurants Nearby
            </Title>
          </>
        }
        renderItem={({ item }) => {
          return (
            <Card elevation={4} style={styles.restaurantCard}>
              <TouchableRipple
                onPress={() => showRestaurantDetails(item)}
                borderless={true}
                style={{ paddingBottom: 8 }}
              >
                <>
                  {item.restaurant.featured_image ? (
                    <Card.Cover
                      source={{ uri: item.restaurant.featured_image }}
                    />
                  ) : null}
                  <Card.Content>
                    <Title>{item.restaurant.name}</Title>
                    <Paragraph numberOfLines={1}>
                      {item.restaurant.user_rating.rating_text}
                      {" | "}
                      {item.restaurant.user_rating.aggregate_rating}/5 ★
                    </Paragraph>
                    <Paragraph numberOfLines={1}>
                      {item.restaurant.cuisines}
                    </Paragraph>
                    <Paragraph numberOfLines={1}>
                      {item.restaurant.location.locality_verbose}
                    </Paragraph>
                  </Card.Content>
                </>
              </TouchableRipple>
            </Card>
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  locationTitle: {
    fontSize: 20,
  },
  rating: {
    textAlignVertical: "center",
    justifyContent: "center",
  },
  restaurantCard: {
    marginHorizontal: 8,
    marginVertical: 8,
  },
});

export default ExploreScreen;
