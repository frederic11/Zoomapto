import React, { useState, useEffect, useContext, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView from "react-native-maps";
import { mapStyle } from "../styles/MapStyles";
import { Text, ActivityIndicator } from "react-native-paper";
import { Marker } from "react-native-maps";
import MapMarker from "../components/MapMarker";
import zomato from "../api/zomato";
import { Context as RestaurantContext } from "../contexts/RestaurantContext";
import { Context as BottomSheetContext } from "../contexts/BottomSheetContext";
import * as Location from "expo-location";

const MapScreen = ({ isDarkTheme }) => {
  const { selectRestaurant } = useContext(RestaurantContext);
  const { toggleBottomSheet } = useContext(BottomSheetContext);

  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [restaurants, setRestaurants] = useState([]);

  const mapRef = useRef(null);

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
        await mapRef.current.animateToRegion(
          {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          },
          2000
        );
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
      } catch (e) {
        console.log(e);
      }
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

  const renderCustomMarkers = (mapRef) => {
    if (restaurants.length > 0) {
      return restaurants.map((restaurant) => {
        return (
          <Marker
            coordinate={{
              latitude: Number(restaurant.restaurant.location.latitude),
              longitude: Number(restaurant.restaurant.location.longitude),
            }}
            key={restaurant.restaurant.id}
            onPress={async () => {
              selectRestaurant(restaurant);
              toggleBottomSheet(true, 2);
              await mapRef.current.animateToRegion(
                {
                  latitude:
                    Number(restaurant.restaurant.location.latitude) - 0.02,
                  longitude: Number(restaurant.restaurant.location.longitude),
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                },
                2000
              );
            }}
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
        ref={mapRef}
        style={styles.map}
        customMapStyle={isDarkTheme ? mapStyle : []}
        showsUserLocation
        showsMyLocationButton
        showsPointsOfInterest={false}
        loadingEnabled
        moveOnMarkerPress={false}
      >
        {renderCustomMarkers(mapRef)}
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
