import React, { useEffect, useState, useContext } from "react";
import { Image, Text, StyleSheet, View, FlatList } from "react-native";
import { useRoute } from "@react-navigation/native";
import {
  Caption,
  Surface,
  Card,
  TouchableRipple,
  Title,
  Paragraph,
} from "react-native-paper";
import zoomapto from "../api/zoomapto";
import { Context as RestaurantContext } from "../contexts/RestaurantContext";
import { useNavigation } from "@react-navigation/native";
import SkeletonLoadingCard from "../components/SkeletonLoadingCard";

const CollectionsScreen = () => {
  const navigation = useNavigation();

  const {
    params: {
      collection: { collection },
      cityId,
    },
  } = useRoute();

  const { selectRestaurant } = useContext(RestaurantContext);

  const [restaurants, setRestaurants] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await zoomapto.get("/api/Zomato/Search", {
          params: {
            entity_id: cityId,
            entity_type: "city",
            collection_id: collection.collection_id,
          },
        });
        console.log(cityId);
        console.log(collection.collection_id);
        setRestaurants(response.data.restaurants);
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  const showRestaurantDetails = (restaurant) => {
    selectRestaurant(restaurant);
    navigation.navigate("Restaurant", {
      restaurant,
    });
  };

  const renderList = (item) => {
    return (
      <Card elevation={4} style={styles.restaurantCard}>
        <TouchableRipple
          style={{ paddingBottom: 16 }}
          onPress={() => showRestaurantDetails(item)}
          borderless={true}
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
    <>
      <Surface>
        <Image source={{ uri: collection.image_url }} style={{ height: 200 }} />
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
            {collection.title}
          </Text>
          <Caption numberOfLines={2} style={{ fontSize: 16, color: "dimgray" }}>
            {collection.description}
          </Caption>
        </View>
      </Surface>

      {restaurants ? (
        <View style={styles.container}>
          <FlatList
            data={restaurants}
            keyExtractor={(item) => item.restaurant.id.toString()}
            renderItem={({ item }) => {
              return renderList(item);
            }}
            style={styles.flatList}
            ListHeaderComponent={
              <Surface style={styles.surface}>
                {restaurants.length === 0 ? (
                  <Caption>No Restaurants Found</Caption>
                ) : (
                  <Caption>Top {restaurants.length} Restaurants shown</Caption>
                )}
              </Surface>
            }
          />
        </View>
      ) : (
        <>
          <SkeletonLoadingCard />
          <SkeletonLoadingCard />
          <SkeletonLoadingCard />
          <SkeletonLoadingCard />
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
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

export default CollectionsScreen;
