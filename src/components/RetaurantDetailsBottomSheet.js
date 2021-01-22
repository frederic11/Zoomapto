import React, { useContext, useRef } from "react";
import { StyleSheet } from "react-native";
import { Surface, Text } from "react-native-paper";
import Animated from "react-native-reanimated";
import BottomSheet from "reanimated-bottom-sheet";
import { Context as RestaurantContext } from "../contexts/RestaurantContext";

const RetaurantDetailsBottomSheet = () => {
  const { state } = useContext(RestaurantContext);

  const renderContent = () => (
    <Surface style={styles.surface}>
      <Text>{state && state.selectedRestaurant.restaurant.name}</Text>
    </Surface>
  );

  const sheetRef = useRef(null);

  if (state) {
    sheetRef.current.snapTo(0);
  }

  return (
    <BottomSheet
      ref={sheetRef}
      snapPoints={[450, 300, 0]}
      borderRadius={10}
      renderContent={renderContent}
    />
  );
};

const styles = StyleSheet.create({
  surface: {
    height: 450,
  },
});

export default RetaurantDetailsBottomSheet;
