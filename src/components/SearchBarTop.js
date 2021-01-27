import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import { Searchbar, ActivityIndicator } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { Context as SearchBarContext } from "../contexts/SearchBarContext";
import { Context as RestaurantContext } from "../contexts/RestaurantContext";

const SearchBarTop = () => {
  const { state, setQuery, setSearchTerm } = useContext(SearchBarContext);
  const { state: restaurantState } = useContext(RestaurantContext);
  const onChangeSearch = (query) => setQuery(query);

  return (
    <>
      <Searchbar
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={state.q}
        style={styles.searchBar}
        onSubmitEditing={() => {
          setSearchTerm(state.q);
        }}
        icon={
          restaurantState && restaurantState.isLoading
            ? () => {
                return <ActivityIndicator animating={true} />;
              }
            : null
        }
      />
    </>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    marginHorizontal: 16,
  },
});

export default SearchBarTop;
