import React from "react";
import { StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const SkeletonLoadingCard = () => {
  return (
    <>
      <Card style={styles.reviewCard} elevation={4}>
        <Card.Content>
          <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
              <SkeletonPlaceholder.Item marginLeft={20}>
                <SkeletonPlaceholder.Item
                  width={200}
                  height={20}
                  borderRadius={4}
                />
                <SkeletonPlaceholder.Item
                  marginTop={6}
                  width={80}
                  height={10}
                  borderRadius={4}
                />
                <SkeletonPlaceholder.Item
                  marginTop={10}
                  width={100}
                  height={10}
                  borderRadius={4}
                />
                <SkeletonPlaceholder.Item
                  marginTop={10}
                  width={300}
                  height={10}
                  borderRadius={4}
                />
                <SkeletonPlaceholder.Item
                  marginTop={10}
                  width={300}
                  height={10}
                  borderRadius={4}
                />
                <SkeletonPlaceholder.Item
                  marginTop={10}
                  width={300}
                  height={10}
                  borderRadius={4}
                />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder>
        </Card.Content>
      </Card>
    </>
  );
};

const styles = StyleSheet.create({
  reviewCard: { margin: 4 },
});

export default SkeletonLoadingCard;
