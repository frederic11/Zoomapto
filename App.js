import "react-native-gesture-handler";
import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import merge from "deepmerge";
import { SafeAreaProvider } from "react-native-safe-area-context";
import MapScreen from "./src/screens/MapScreen";
import ListScreen from "./src/screens/ListScreen";
import ExploreScreen from "./src/screens/ExploreScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import { Provider as RestaurantProvider } from "./src/contexts/RestaurantContext";
import RetaurantDetailsBottomSheet from "./src/components/RetaurantDetailsBottomSheet";

const CombinedDefaultTheme = merge(PaperDefaultTheme, NavigationDefaultTheme);
const CombinedDarkTheme = merge(PaperDarkTheme, NavigationDarkTheme);

const Tab = createMaterialBottomTabNavigator();
export default function App() {
  const [isDarkTheme, setIsDarkTheme] = React.useState(false);

  const theme = isDarkTheme ? CombinedDarkTheme : CombinedDefaultTheme; // Use Light/Dark theme based on a state

  function toggleTheme() {
    setIsDarkTheme(!isDarkTheme);
  }

  return (
    <SafeAreaProvider>
      <RestaurantProvider>
        <PaperProvider theme={theme}>
          <NavigationContainer theme={theme}>
            <Tab.Navigator labeled={true}>
              <Tab.Screen
                name="Map"
                children={() => <MapScreen isDarkTheme={isDarkTheme} />}
                options={{
                  tabBarLabel: "Map",
                  tabBarIcon: ({ color }) => (
                    <MaterialIcons
                      name="location-pin"
                      color={color}
                      size={26}
                    />
                  ),
                }}
              />
              <Tab.Screen
                name="List"
                component={ListScreen}
                options={{
                  tabBarLabel: "List",
                  tabBarIcon: ({ color }) => (
                    <MaterialIcons name="list" color={color} size={26} />
                  ),
                }}
              />
              <Tab.Screen
                name="Explore"
                component={ExploreScreen}
                options={{
                  tabBarLabel: "Explore",
                  tabBarIcon: ({ color }) => (
                    <MaterialIcons name="explore" color={color} size={26} />
                  ),
                }}
              />
              <Tab.Screen
                name="Settings"
                children={() => (
                  <SettingsScreen
                    toggleTheme={toggleTheme}
                    isDarkTheme={isDarkTheme}
                  />
                )}
                options={{
                  tabBarLabel: "Settings",
                  tabBarIcon: ({ color }) => (
                    <MaterialIcons name="settings" color={color} size={26} />
                  ),
                }}
              />
            </Tab.Navigator>
            <RetaurantDetailsBottomSheet />
          </NavigationContainer>
        </PaperProvider>
      </RestaurantProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
