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

const RetaurantDetailsBottomSheet = () => {
  const { state } = useContext(RestaurantContext);
  const { state: bottomSheetState } = useContext(BottomSheetContext);

  const renderHeader = () => {
    if (!state) {
      return null;
    }
    return <RestaurantHeaderCard snapBottomBarToIndex={snapBottomBarToIndex} />;
  };

  const renderContent = () => {
    if (!state) {
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
