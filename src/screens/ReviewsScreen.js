import React, { useEffect, useState } from "react";
import { StyleSheet, FlatList } from "react-native";
import { Text, Button, Card, Paragraph } from "react-native-paper";
import { useRoute } from "@react-navigation/native";
import zomatoV1 from "../api/zomatoV1";

const ReviewsScreen = () => {
  const route = useRoute();
  const { restaurantId } = route.params;
  const [reviews, setReviews] = useState(null);

  const getRestaurantReviews = async () => {
    const response = await zomatoV1.get(`/reviews/${restaurantId}/user`, {
      params: {
        start: 0,
        count: 50,
      },
    });
    setReviews(response.data);
    console.log(response.data.userReviews);
  };

  const getMoreRestaurantReviews = async () => {
    const start = Number(reviews.reviewsShown) + Number(reviews.reviewsStart);
    const response = await zomatoV1.get(`/reviews/${restaurantId}/user`, {
      params: {
        start: start,
        count: 50,
      },
    });
    const newState = {
      ...reviews,
      reviewsShown: reviews.reviewsShown + response.data.reviewsShown,
      reviewsStart: response.data.reviewsStart,
      userReviews: reviews.userReviews.concat(response.data.userReviews),
    };
    setReviews(newState);
  };

  useEffect(() => {
    getRestaurantReviews(restaurantId);
  }, []);

  if (!reviews) {
    return <Text>Loading...</Text>;
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
                title={`${item.review.userName} | ${item.review.rating} ★`}
                subtitle={`${item.review.reviewTimeFriendly}`}
              />
              {item.review.reviewText.length > 1 ? (
                <Card.Content>
                  <Paragraph>{item.review.reviewText}</Paragraph>
                </Card.Content>
              ) : null}
            </Card>
          );
        }}
        keyExtractor={(item) => item.review.id.toString()}
      />
      <Button onPress={getMoreRestaurantReviews}>Load More</Button>
    </>
  );
};

const styles = StyleSheet.create({
  reviewCard: { margin: 4 },
});

export default ReviewsScreen;
