import React, { useContext, useRef, useEffect } from "react";
import { StyleSheet } from "react-native";
import BottomSheet from "reanimated-bottom-sheet";
import { Context as RestaurantContext } from "../contexts/RestaurantContext";
import RestaurantDetailsCard from "./RestaurantDetailsCard";
import RestaurantFoodCard from "./RestaurantFoodCard";
import RestaurantNavigationCard from "./RestaurantNavigationCard";
import RestaurantReviewsCard from "./RestaurantReviewsCard";
import RestaurantHeaderCard from "./RestaurantHeaderCard";
import RestaurantImageCard from "./RestaurantImageCard";
import { Context as BottomSheetContext } from "../contexts/BottomSheetContext";
import { useRoute } from "@react-navigation/native";

const RetaurantDetailsBottomSheet = () => {
  const route = useRoute();

  const { state } = useContext(RestaurantContext);
  const { state: bottomSheetState } = useContext(BottomSheetContext);

  const renderHeader = () => {
    if (!state || !state.selectedRestaurant) {
      return null;
    }
    return (
      <RestaurantHeaderCard
        snapBottomBarToIndex={snapBottomBarToIndex}
        isPressEnabled={true}
      />
    );
  };

  const renderContent = () => {
    if (!state || !state.selectedRestaurant) {
      return null;
    }
    return (
      <>
        <RestaurantDetailsCard />
        <RestaurantImageCard />
        <RestaurantFoodCard />
        <RestaurantNavigationCard />
        <RestaurantReviewsCard />
      </>
    );
  };

  const sheetRef = useRef(null);

  const snapBottomBarToIndex = (index) => {
    sheetRef.current.snapTo(index);
  };

  if (route.params && route.params.isOpenRestaurantDetails) {
    snapBottomBarToIndex(0);
    route.params.isOpenRestaurantDetails = false;
  }

  useEffect(() => {
    if (bottomSheetState && bottomSheetState.isBottomSheetOpen) {
      snapBottomBarToIndex(bottomSheetState.snapPosition);
    } else if (bottomSheetState && !bottomSheetState.isBottomSheetOpen) {
      snapBottomBarToIndex(3);
    }
  }, [bottomSheetState]);

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

const styles = StyleSheet.create({});

export default RetaurantDetailsBottomSheet;
