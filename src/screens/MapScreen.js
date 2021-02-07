import React, { useState, useEffect, useContext, useRef } from "react";
import { StyleSheet, View } from "react-native";
import {
  SafeAreaView,
  withSafeAreaInsets,
} from "react-native-safe-area-context";
import MapView from "react-native-maps";
import { mapStyle } from "../styles/MapStyles";
import { Text, ActivityIndicator, Button, Chip } from "react-native-paper";
import { Marker } from "react-native-maps";
import MapMarker from "../components/MapMarker";
import zoompato from "../api/zoomapto";
import { Context as RestaurantContext } from "../contexts/RestaurantContext";
import { Context as BottomSheetContext } from "../contexts/BottomSheetContext";
import { getDistance } from "geolib";
import MapActionArea from "../components/MapActionArea";
import * as Location from "expo-location";
import { Context as SearchBarContext } from "../contexts/SearchBarContext";
import zoomapto from "../api/zoomapto";

const MapScreen = ({ isDarkTheme, insets }) => {
  const {
    state,
    selectRestaurant,
    setRestaurants,
    setIsRestaurantLoading,
  } = useContext(RestaurantContext);

  const { toggleBottomSheet } = useContext(BottomSheetContext);

  const {
    state: { searchTerm },
  } = useContext(SearchBarContext);

  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [searchCoords, setSearchCoords] = useState(null);
  const [startIndex, setStartIndex] = useState(0);

  const mapRef = useRef(null);
  const restaurants = state && state.restaurants ? state.restaurants : null;

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

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      if (!searchTerm || searchTerm.length === 0) {
        return;
      }

      let {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync({});

      setSearchCoords({ latitude, longitude });
      setStartIndex(0);
      try {
        setIsRestaurantLoading();
        const response = await zoompato.get("/api/Zomato/Search", {
          params: {
            q: searchTerm,
            lat: latitude,
            lon: longitude,
            sort: "real_distance",
            start: 0,
            count: 20,
          },
        });
        console.log(response.data);
        setRestaurants(response.data.restaurants);
        fitMaptoCoords(response.data.restaurants);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [searchTerm]);

  const searchArea = async (latitude, longitude) => {
    setIsRestaurantLoading();
    let radius = getRadius();
    if (radius > 6000) {
      radius = 6000;
    }

    try {
      const response = await zoomapto.get("/api/Zomato/Search", {
        params: {
          lat: latitude,
          lon: longitude,
          radius: radius,
          sort: "real_distance",
        },
      });

      setRestaurants(response.data.restaurants);
      fitMaptoCoords(response.data.restaurants);
    } catch (e) {
      console.log(e);
    }
  };

  const fitMaptoCoords = (restaurants) => {
    const coordsArray = restaurants.map((item) => {
      return {
        latitude: Number(item.restaurant.location.latitude),
        longitude: Number(item.restaurant.location.longitude),
      };
    });

    mapRef.current.fitToCoordinates(coordsArray, {
      edgePadding: {
        top: 150,
        right: 50,
        bottom: 50,
        left: 50,
      },
      animated: true,
    });
  };

  const getRadius = async () => {
    const mapBoundaries = await mapRef.current.getMapBoundaries();
    const radius =
      getDistance(mapBoundaries.northEast, mapBoundaries.southWest) / 2;
    return radius;
  };

  const renderCustomMarkers = (mapRef) => {
    if (restaurants && restaurants.length > 0) {
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
        showsMyLocationButton={false}
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
        <MapActionArea mapRef={mapRef} searchArea={searchArea} />
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
