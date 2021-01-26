import React from "react";
import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import SearchBarTop from "./SearchBarTop";

const MapActionArea = ({ mapRef, searchArea }) => {
  return (
    <>
      <SearchBarTop />
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
    </>
  );
};

const styles = StyleSheet.create({});

export default MapActionArea;
