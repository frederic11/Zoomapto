import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { List, Surface, Text, Paragraph } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import zomato from "../api/zomato";
import * as Location from "expo-location";
import { AirbnbRating, Rating } from "react-native-ratings";

const ExploreScreen = () => {
  const [geoCodeData, setGeoCodeData] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync({});

      try {
        const response = await zomato.get("/geocode", {
          params: {
            lat: latitude,
            lon: longitude,
          },
        });
        setGeoCodeData(response.data);
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  if (!geoCodeData) {
    return (
      <SafeAreaView>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <Surface>
        <List.Item
          title={`${geoCodeData.location.title}, ${geoCodeData.location.city_name}, ${geoCodeData.location.country_name}`}
          left={(props) => <List.Icon {...props} icon="map-marker" />}
          titleNumberOfLines={1}
          titleStyle={styles.locationTitle}
        />
      </Surface>
      <Surface>
        <Paragraph style={styles.rating}>Popularity:</Paragraph>
        <Paragraph style={styles.rating}>Nightlife:</Paragraph>
      </Surface>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  locationTitle: {
    fontSize: 20,
  },
  rating: {
    textAlignVertical: "center",
    justifyContent: "center",
  },
});

export default ExploreScreen;
