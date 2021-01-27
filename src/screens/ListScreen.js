import React, { useContext, useEffect, useState } from "react";
import { FlatList, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Caption,
  Surface,
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
    setIsRestaurantLoading,
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
        setIsRestaurantLoading();
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

  const showRestaurantDetails = (restaurant) => {
    selectRestaurant(restaurant);
    navigation.navigate("Map", {
      isOpenRestaurantDetails: true,
    });
  };

  const renderList = (item) => {
    return (
      <Card elevation={4} style={styles.restaurantCard}>
        <TouchableRipple
          style={{ paddingBottom: 16 }}
          onPress={() => showRestaurantDetails(item)}
        >
          <>
            {item.restaurant.featured_image ? (
              <Card.Cover source={{ uri: item.restaurant.featured_image }} />
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
  };

  return (
    <SafeAreaView style={styles.container}>
      <SearchBarTop />
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.restaurant.id}
        renderItem={({ item }) => {
          return renderList(item);
        }}
        style={styles.flatList}
        ListHeaderComponent={
          <Surface style={styles.surface}>
            <Caption>Top {restaurants.length} Restaurants shown</Caption>
          </Surface>
        }
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
  surface: {
    padding: 8,
  },
});

export default ListScreen;
