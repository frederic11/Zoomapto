import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import { Searchbar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { Context as SearchBarContext } from "../contexts/SearchBarContext";

const SearchBarTop = () => {
  const { state, setQuery, setSearchTerm } = useContext(SearchBarContext);
  const onChangeSearch = (query) => setQuery(query);
  const navigation = useNavigation();

  return (
    <Searchbar
      placeholder="Search"
      onChangeText={onChangeSearch}
      value={state.q}
      style={styles.searchBar}
      onSubmitEditing={() => {
        setSearchTerm(state.q);
        navigation.navigate("List");
      }}
    />
  );
};

const styles = StyleSheet.create({
  searchBar: {
    marginHorizontal: 16,
  },
});

export default SearchBarTop;
