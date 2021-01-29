import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import SearchBarTop from "./SearchBarTop";
import { Context as SearchBarContext } from "../contexts/SearchBarContext";
import { Context as BottomSheetContext } from "../contexts/BottomSheetContext";

const MapActionArea = ({ mapRef, searchArea }) => {
  const { setQuery, setSearchTerm } = useContext(SearchBarContext);
  const { toggleBottomSheet } = useContext(BottomSheetContext);

  return (
    <>
      <SearchBarTop />
      <Button
        icon="reload"
        mode="contained"
        style={{
          borderRadius: 50,
          alignSelf: "center",
          marginTop: 8,
        }}
        onPress={async () => {
          toggleBottomSheet(false);
          setQuery("");
          setSearchTerm(null);
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
