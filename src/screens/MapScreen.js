import React, { useState, useEffect, useContext, useRef } from "react";
import { StyleSheet, View } from "react-native";
import {
  SafeAreaView,
  withSafeAreaInsets,
} from "react-native-safe-area-context";
import MapView from "react-native-maps";
import { mapStyle } from "../styles/MapStyles";
import { Text, ActivityIndicator, Button, Searchbar } from "react-native-paper";
import { Marker } from "react-native-maps";
import MapMarker from "../components/MapMarker";
import zomato from "../api/zomato";
import { Context as RestaurantContext } from "../contexts/RestaurantContext";
import { Context as BottomSheetContext } from "../contexts/BottomSheetContext";
import { getDistance } from "geolib";
import * as Location from "expo-location";

const MapScreen = ({ isDarkTheme, insets }) => {
  const { selectRestaurant } = useContext(RestaurantContext);
  const { toggleBottomSheet } = useContext(BottomSheetContext);

  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});

      try {
        setIsLoading(true);
        await mapRef.current.animateToRegion(
          {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          },
          1000
        );
        setIsLoading(false);
        setErrorMsg(null);
      } catch (e) {
        setErrorMsg("Something Went Wrong While Fetching the Location");
      }

      searchArea(location.coords.latitude, location.coords.longitude);
    })();
  }, []);

  const searchArea = async (latitude, longitude) => {
    let radius = getRadius();
    if (radius > 6000) {
      radius = 6000;
    }

    try {
      const response = await zomato.get("/search", {
        params: {
          lat: latitude,
          lon: longitude,
          radius: radius,
          sort: "real_distance",
        },
      });
      setRestaurants(response.data.restaurants);
    } catch (e) {
      console.log(e);
    }
  };

  const getRadius = async () => {
    const mapBoundaries = await mapRef.current.getMapBoundaries();
    const radius =
      getDistance(mapBoundaries.northEast, mapBoundaries.southWest) / 2;
    return radius;
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
              await mapRef.current.animateCamera(
                {
                  center: {
                    latitude: Number(restaurant.restaurant.location.latitude),
                    longitude: Number(restaurant.restaurant.location.longitude),
                  },
                },
                1000
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
        showsPointsOfInterest={false}
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
      <View style={[styles.reload, { top: insets.top }]}>
        <Searchbar
          placeholder="Search"
          onChangeText={(query) => setSearchQuery(query)}
          value={searchQuery}
          style={{ marginHorizontal: 16 }}
        />
        <Button
          icon="reload"
          mode="contained"
          style={{
            borderRadius: 50,
            width: 200,
            alignSelf: "center",
            marginTop: 8,
          }}
          onPress={async () => {
            const { center } = await mapRef.current.getCamera();
            searchArea(center.latitude, center.longitude);
          }}
        >
          Search this Area
        </Button>
      </View>
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
  reload: {
    position: "absolute",
    right: 0,
    left: 0,
    flexDirection: "column",
    justifyContent: "center",
    paddingTop: 10,
  },
  text: {
    marginStart: 10,
  },
});

export default withSafeAreaInsets(MapScreen);
