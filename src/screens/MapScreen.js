import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView from "react-native-maps";
import { mapStyle } from "../styles/MapStyles";
import { Text, ActivityIndicator } from "react-native-paper";
import { Marker } from "react-native-maps";
import MapMarker from "../components/MapMarker";
import zomato from "../api/zomato";
import * as Location from "expo-location";

const MapScreen = ({ isDarkTheme }) => {
  const initialRegion = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const [errorMsg, setErrorMsg] = useState(null);
  const [region, setRegion] = useState(initialRegion);
  const [isLoading, setIsLoading] = useState(true);
  const [restaurants, setRestaurants] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      try {
        setIsLoading(true);
        let location = await Location.getCurrentPositionAsync({});
        setRegion(updateRegion(location));
        setIsLoading(false);
        setErrorMsg(null);
      } catch (e) {
        setErrorMsg("Something Went Wrong While Fetching the Location");
      }

      try {
        const response = await zomato.get("/search", {
          params: {
            lat: 33.88070823566298,
            lon: 35.5318377,
            radius: 1000,
          },
        });
        setRestaurants(response.data.restaurants);
      } catch (e) {}
    })();
  }, []);

  const updateRegion = ({ coords }) => {
    return {
      latitude: coords.latitude,
      longitude: coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
  };

  const renderCustomMarkers = () => {
    if (restaurants) {
      return restaurants.map((restaurant) => {
        return (
          <Marker
            coordinate={{
              latitude: Number(restaurant.restaurant.location.latitude),
              longitude: Number(restaurant.restaurant.location.longitude),
            }}
            key={restaurant.restaurant.id}
          >
            <MapMarker restaurant={restaurant} />
          </Marker>
        );
      });
    } else {
      return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        customMapStyle={isDarkTheme ? mapStyle : []}
      >
        {renderCustomMarkers()}
      </MapView>
      {isLoading && (
        <View style={styles.loading}>
          <ActivityIndicator animating={true} />
          <Text style={styles.text}>Fetching your Location...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loading: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom: 10,
  },
  text: {
    marginStart: 10,
  },
});

export default MapScreen;
