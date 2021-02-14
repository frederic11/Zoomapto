import React, { useEffect, useState } from "react";
import { StyleSheet, FlatList, View } from "react-native";
import { Text, Card, Paragraph, ActivityIndicator } from "react-native-paper";
import { useRoute } from "@react-navigation/native";
import zoomapto from "../api/zoomapto";
import { AirbnbRating } from "react-native-ratings";
import SkeletonLoadingCard from "../components/SkeletonLoadingCard";

const ReviewsScreen = () => {
  const route = useRoute();
  const { restaurantId } = route.params;
  const [reviews, setReviews] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getRestaurantReviews = async () => {
    const response = await zoomapto.get("/api/Zomato/ReviewsV1", {
      params: {
        restaurantId: restaurantId,
        start: 0,
        count: 20,
      },
    });
    setReviews(response.data);
  };

  const getMoreRestaurantReviews = async () => {
    if (reviews.reviewsShown >= reviews.reviewsCount) {
      return;
    }
    setIsLoading(true);
    const start = Number(reviews.reviewsShown) + Number(reviews.reviewsStart);
    const response = await zoomapto.get("/api/Zomato/ReviewsV1", {
      params: {
        restaurantId: restaurantId,
        start: start,
        count: 20,
      },
    });
    const newState = {
      ...reviews,
      reviewsShown: reviews.reviewsShown + response.data.reviewsShown,
      reviewsStart: response.data.reviewsStart,
      userReviews: reviews.userReviews.concat(response.data.userReviews),
    };
    setReviews(newState);
    setIsLoading(false);
  };

  useEffect(() => {
    getRestaurantReviews(restaurantId);
  }, []);

  if (!reviews) {
    return (
      <>
        <SkeletonLoadingCard />
        <SkeletonLoadingCard />
        <SkeletonLoadingCard />
        <SkeletonLoadingCard />
        <SkeletonLoadingCard />
        <SkeletonLoadingCard />
      </>
    );
  }

  if (reviews.userReviews.length === 0) {
    return <Text>No Reviews Found</Text>;
  }

  return (
    <>
      <FlatList
        data={reviews.userReviews}
        renderItem={({ item }) => {
          return (
            <Card style={styles.reviewCard} elevation={4}>
              <Card.Title
                title={item.review.userName}
                subtitle={`${item.review.reviewTimeFriendly}`}
              />
              <Card.Content>
                <Paragraph>
                  <AirbnbRating
                    count={5}
                    defaultRating={item.review.rating}
                    isDisabled={true}
                    showRating={false}
                    size={20}
                  />
                </Paragraph>
                {item.review.reviewText.length > 1 ? (
                  <Paragraph>{item.review.reviewText}</Paragraph>
                ) : null}
              </Card.Content>
            </Card>
          );
        }}
        keyExtractor={(item) => item.review.id.toString()}
        ListFooterComponent={() => {
          return isLoading ? (
            <>
              <SkeletonLoadingCard />
              <SkeletonLoadingCard />
            </>
          ) : null;
        }}
        onEndReachedThreshold={1}
        onEndReached={getMoreRestaurantReviews}
      />
    </>
  );
};

const styles = StyleSheet.create({
  reviewCard: { margin: 4 },
  activityIndicator: { margin: 16 },
  loading: { flexGrow: 1 },
});

export default ReviewsScreen;
