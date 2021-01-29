import React, { useContext } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { Context as RestaurantContext } from "../contexts/RestaurantContext";

import RestaurantDetailsCard from "../components/RestaurantDetailsCard";
import RestaurantFoodCard from "../components/RestaurantFoodCard";
import RestaurantNavigationCard from "../components/RestaurantNavigationCard";
import RestaurantReviewsCard from "../components/RestaurantReviewsCard";
import RestaurantHeaderCard from "../components/RestaurantHeaderCard";
import RestaurantImageCard from "../components/RestaurantImageCard";

const RestaurantDetailsScreen = () => {
  const { state } = useContext(RestaurantContext);

  if (!state || !state.selectedRestaurant) {
    return null;
  }
  return (
    <ScrollView>
      <RestaurantHeaderCard isPressEnabled={false} />
      <RestaurantDetailsCard />
      <RestaurantImageCard />
      <RestaurantFoodCard />
      <RestaurantNavigationCard />
      <RestaurantReviewsCard />
    </ScrollView>
  );
};

const styles = StyleSheet.create({});

export default RestaurantDetailsScreen;
