import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
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
import ReviewsScreen from "./src/screens/ReviewsScreen";
import PermissionScreen from "./src/screens/PermissionScreen";
import CallScreen from "./src/screens/CallScreen";
import RestaurantDetailsScreen from "./src/screens/RestaurantDetailsScreen";
import CollectionsScreen from "./src/screens/CollectionsScreen";
import ConnectionUnavailableScreen from "./src/screens/ConnectionUnavailableScreen";
import { Provider as RestaurantProvider } from "./src/contexts/RestaurantContext";
import { Provider as BottomSheetProvider } from "./src/contexts/BottomSheetContext";
import { Provider as SearchBarProvider } from "./src/contexts/SearchBarContext";
import RestaurantDetailsBottomSheet from "./src/components/RestaurantDetailsBottomSheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { useNavigation } from "@react-navigation/native";
import * as firebase from "firebase";
import "firebase/auth";
import { firebaseConfig } from "./firebaseConfig";

const customTheme = {
  ...PaperDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    primary: "#cc0e00",
  },
};

const navigationCustomTheme = {
  ...NavigationDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    primary: "#cc0e00",
  },
};

const CombinedDefaultTheme = merge(customTheme, navigationCustomTheme);
const CombinedDarkTheme = merge(PaperDarkTheme, NavigationDarkTheme);

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

const HomeFlow = ({ isDarkTheme, toggleTheme }) => {
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(({ isInternetReachable }) => {
      isInternetReachable
        ? navigation.navigate("Home")
        : navigation.navigate("ConnectionUnavailable");
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Tab.Navigator labeled={true}>
      <Tab.Screen
        name="Map"
        children={(props) => (
          <>
            <MapScreen {...props} isDarkTheme={isDarkTheme} />
            <RestaurantDetailsBottomSheet {...props} />
          </>
        )}
        options={{
          tabBarLabel: "Map",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="location-pin" color={color} size={26} />
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
          <SettingsScreen toggleTheme={toggleTheme} isDarkTheme={isDarkTheme} />
        )}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="settings" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  const [isDarkTheme, setIsDarkTheme] = React.useState(false);

  useEffect(() => {
    (async () => {
      const darkThemeEnabled = await AsyncStorage.getItem("dark_theme");
      darkThemeEnabled === "true"
        ? setIsDarkTheme(true)
        : setIsDarkTheme(false);
    })();

    if (firebase.apps.length === 0) {
      firebase.initializeApp(firebaseConfig);
    }

    firebase
      .auth()
      .signInAnonymously()
      .then(() => {})
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
      });

    const authChangeUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user != null) {
        //This is a hack to be able to read the access token from user
        //if you try to read it direcly from the user object
        //it will throw an error
        //i.e.
        //console.log(user.stsTokenManager.accessToken) will throw an error
        const userString = JSON.stringify(user);
        const userJson = JSON.parse(userString);

        AsyncStorage.setItem("jwt", userJson.stsTokenManager.accessToken);
      }

      // Do other things
    });

    return () => {
      authChangeUnsubscribe();
    };
  }, []);

  const theme = isDarkTheme ? CombinedDarkTheme : CombinedDefaultTheme; // Use Light/Dark theme based on a state

  const toggleTheme = async () => {
    await AsyncStorage.setItem("dark_theme", (!isDarkTheme).toString());
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <SafeAreaProvider>
      <SearchBarProvider>
        <RestaurantProvider>
          <BottomSheetProvider>
            <PaperProvider theme={theme}>
              <NavigationContainer theme={theme}>
                <Stack.Navigator>
                  <Stack.Screen
                    name="Permission"
                    component={PermissionScreen}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="Home"
                    children={(props) => (
                      <>
                        <HomeFlow
                          {...props}
                          isDarkTheme={isDarkTheme}
                          toggleTheme={toggleTheme}
                        />
                      </>
                    )}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen name="Reviews" component={ReviewsScreen} />
                  <Stack.Screen name="Call" component={CallScreen} />
                  <Stack.Screen
                    name="Restaurant"
                    component={RestaurantDetailsScreen}
                  />
                  <Stack.Screen
                    name="Collections"
                    component={CollectionsScreen}
                  />
                  <Stack.Screen
                    name="ConnectionUnavailable"
                    component={ConnectionUnavailableScreen}
                    options={{ headerShown: false }}
                  />
                </Stack.Navigator>
              </NavigationContainer>
            </PaperProvider>
          </BottomSheetProvider>
        </RestaurantProvider>
      </SearchBarProvider>
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
