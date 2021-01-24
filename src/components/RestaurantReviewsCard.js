import React, { Fragment, useContext } from "react";
import { StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Card, Button, Text, Paragraph } from "react-native-paper";
import { Context as RestaurantContext } from "../contexts/RestaurantContext";
import { useNavigation } from "@react-navigation/native";
import zomato from "../api/zomato";

const RestaurantReviewsCard = () => {
  const {
    state,
    setRestuarantRecentReview,
    setRestuarantRecentReviewLoadingState,
  } = useContext(RestaurantContext);
  const navigation = useNavigation();

  const getRecentsFiveReviews = async () => {
    if (!state.selectedRestaurant) {
      return null;
    }

    const restaurantId = state.selectedRestaurant.restaurant.R.res_id;
    setRestuarantRecentReviewLoadingState(restaurantId);
    const response = await zomato.get("/reviews", {
      params: {
        res_id: restaurantId,
        count: 5,
      },
    });
    setRestuarantRecentReview(response.data, restaurantId);
  };

  const renderShowRecentReviewsButton = () => {
    if (!state || !state.selectedRestaurant) {
      return null;
    }

    const restaurantId = state.selectedRestaurant.restaurant.R.res_id;

    if (
      state &&
      state.RestaurantsRecentReviews &&
      state.RestaurantsRecentReviews[restaurantId] &&
      state.RestaurantsRecentReviews[restaurantId].reviews
    ) {
      return null;
    }

    const isLoading =
      state &&
      state.RestaurantsRecentReviews &&
      state.RestaurantsRecentReviews[restaurantId] &&
      state.RestaurantsRecentReviews[restaurantId].isLoading;

    return (
      <Button
        mode="outlined"
        onPress={() => {
          setRestuarantRecentReviewLoadingState(restaurantId);
          getRecentsFiveReviews();
        }}
        loading={isLoading}
        disabled={isLoading}
      >
        Show Top 5 Most Recent Reviews
      </Button>
    );
  };

  const renderRecentReviewList = () => {
    if (!state || !state.selectedRestaurant) {
      return null;
    }

    const restaurantId = state.selectedRestaurant.restaurant.R.res_id;
    if (
      !state ||
      !state.RestaurantsRecentReviews ||
      !state.RestaurantsRecentReviews[restaurantId] ||
      !state.RestaurantsRecentReviews[restaurantId].reviews
    ) {
      return null;
    }

    if (
      state.RestaurantsRecentReviews[restaurantId].reviews.reviews_count === 0
    ) {
      return <Text>No Reviews Found</Text>;
    }

    const reviewsArray = state.RestaurantsRecentReviews[
      restaurantId
    ].reviews.user_reviews.map((item) => {
      return {
        jsx: item.review,
        id: item.review.id,
      };
    });

    return (
      <Fragment>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={reviewsArray}
          renderItem={({ item }) => {
            return (
              <Card style={styles.reviewCard}>
                <Card.Title
                  title={`${item.jsx.user.name} | ${item.jsx.rating} ★`}
                  subtitle={`${item.jsx.review_time_friendly}`}
                />
                <Card.Content>
                  <Paragraph numberOfLines={4}>
                    {item.jsx.review_text}
                  </Paragraph>
                </Card.Content>
              </Card>
            );
          }}
          keyExtractor={(item) => item.id.toString()}
          pointerEvents={"auto"}
          scrollEnabled={true}
        />
      </Fragment>
    );
  };

  const RightContent = (props) => (
    <Button
      {...props}
      mode="text"
      style={{ marginRight: 4 }}
      onPress={() => {
        navigation.navigate("Reviews", {
          restaurantId: state.selectedRestaurant.restaurant.R.res_id,
        });
      }}
    >
      All
    </Button>
  );

  if (!state.selectedRestaurant) {
    return null;
  }

  return (
    <Card style={styles.contentCard} elevation={4}>
      <Card.Title
        title="Reviews"
        subtitle={`${state.selectedRestaurant.restaurant.user_rating.aggregate_rating} rating bases on ${state.selectedRestaurant.restaurant.all_reviews_count} reviews`}
        subtitleNumberOfLines={3}
        right={RightContent}
      />
      <Card.Content>
        {renderShowRecentReviewsButton()}
        {renderRecentReviewList()}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  contentCard: { marginHorizontal: 8, marginBottom: 8 },
  reviewCard: { margin: 4, width: 280, height: 180 },
});

export default RestaurantReviewsCard;
