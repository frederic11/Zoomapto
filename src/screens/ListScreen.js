import React, { useContext, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Button,
  Card,
  Title,
  Paragraph,
  TouchableRipple,
} from "react-native-paper";
import SearchBarTop from "../components/SearchBarTop";
import { Context as SearchBarContext } from "../contexts/SearchBarContext";
import zomato from "../api/zomato";
import * as Location from "expo-location";
import { Context as RestaurantContext } from "../contexts/RestaurantContext";
import { useNavigation } from "@react-navigation/native";

const ListScreen = () => {
  const navigation = useNavigation();

  const {
    state: { searchTerm },
  } = useContext(SearchBarContext);

  const {
    state: { restaurants },
    setRestaurants,
    selectRestaurant,
  } = useContext(RestaurantContext);

  const [searchCoords, setSearchCoords] = useState(null);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      if (!searchTerm || searchTerm.length === 0) {
        return;
      }
      let {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync({});

      setSearchCoords({ latitude, longitude });
      setStartIndex(0);
      try {
        const response = await zomato.get("/search", {
          params: {
            q: searchTerm,
            lat: latitude,
            lon: longitude,
            sort: "real_distance",
            start: 0,
            count: 20,
          },
        });
        setRestaurants(response.data.restaurants);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [searchTerm]);

  const loadMoreSearchResults = async () => {
    try {
      const newStartIndex = startIndex + 20;
      const response = await zomato.get("/search", {
        params: {
          q: searchTerm,
          lat: searchCoords.latitude,
          lon: searchCoords.longitude,
          start: newStartIndex,
          count: 20,
          sort: "real_distance",
        },
      });
      setRestaurants(restaurants.concat(response.data.restaurants));
      setStartIndex(newStartIndex);
    } catch (e) {
      console.log(e);
    }
  };

  const showRestaurantDetails = (restaurant) => {
    selectRestaurant(restaurant);
    navigation.navigate("Map", {
      isOpenRestaurantDetails: true,
    });
  };

  const renderListFooter = () => {
    return (
      <Button
        mode="outlined"
        style={styles.buttonLoadMore}
        onPress={loadMoreSearchResults}
      >
        Load More Search Results
      </Button>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <SearchBarTop />
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.restaurant.id}
        renderItem={({ item }) => {
          return (
            <Card elevation={4} style={styles.restaurantCard}>
              <TouchableRipple
                style={{ paddingBottom: 16 }}
                onPress={() => showRestaurantDetails(item)}
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
        ListFooterComponent={renderListFooter}
        style={styles.flatList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    flex: 1,
  },
  buttonLoadMore: {
    marginHorizontal: 8,
    marginVertical: 16,
  },
  flatList: {
    marginTop: 8,
  },
  restaurantCard: {
    marginHorizontal: 8,
    marginVertical: 8,
  },
});

export default ListScreen;
