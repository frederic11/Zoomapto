import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image, ScrollView } from "react-native";
import { Button, ActivityIndicator, Card, Paragraph } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import * as IntentLauncher from "expo-intent-launcher";
import { useNavigation } from "@react-navigation/native";

const ExploreScreen = () => {
  const navigation = useNavigation();

  const [
    isLocationPermissionGranted,
    setIsLocationPermissionGranted,
  ] = useState(false);
  const [showPermissionScreen, setShowPermissionScreen] = useState(false);
  const [canAskAgain, setCanAskAgain] = useState(true);
  const [permissionStatus, setPermissionStatus] = useState(null);

  useEffect(() => {
    (async () => {
      const {
        granted,
        canAskAgain,
        status,
      } = await Location.getPermissionsAsync();
      if (granted) {
        navigation.navigate("Home");
      } else {
        setShowPermissionScreen(true);
        setCanAskAgain(canAskAgain);
        setPermissionStatus(status);
      }
    })();
  }, [isLocationPermissionGranted]);

  const askForLocationPremission = async () => {
    const {
      granted,
      canAskAgain,
      status,
    } = await Location.requestPermissionsAsync();
    setIsLocationPermissionGranted(granted);
    setCanAskAgain(canAskAgain);
    setPermissionStatus(status);
  };

  const canAskPermissionAgain =
    (permissionStatus === "denied" && canAskAgain) ||
    permissionStatus != "denied";

  if (showPermissionScreen) {
    return (
      <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
        <ScrollView>
          <Image
            style={{
              marginVertical: 8,
              width: 350,
              height: 350,
              alignSelf: "center",
            }}
            source={require("../../assets/loc-loading.gif")}
          />
          <Card elevation={4} style={{ margin: 8 }}>
            <Card.Title title="Welcome to Zoomapto!" />
            <Card.Content>
              <Paragraph>
                Zoomapto helps you find restaurants near you. In order to do
                that, we would like to ask you to give us access to your
                location. We care about your privacy, hence we don't store any
                location information. Location access is the only permission
                that we require.
              </Paragraph>
              {!canAskPermissionAgain && (
                <>
                  <Paragraph>
                    You are no longer able to grant Location access from this
                    screen. Please grant location access by visiting the
                    settings.
                  </Paragraph>
                </>
              )}
            </Card.Content>
            <Card.Actions>
              {canAskPermissionAgain && (
                <Button
                  onPress={askForLocationPremission}
                  disabled={!canAskPermissionAgain}
                >
                  Grant Location Access
                </Button>
              )}
              {!canAskPermissionAgain && (
                <Button
                  onPress={() =>
                    IntentLauncher.startActivityAsync(
                      IntentLauncher.ACTION_LOCATION_SOURCE_SETTINGS
                    )
                  }
                >
                  Settings
                </Button>
              )}
            </Card.Actions>
          </Card>
        </ScrollView>
      </SafeAreaView>
    );
  } else {
    return (
      <View style={{ flex: 1 }}>
        <ActivityIndicator animating style={{ flexGrow: 1 }} size={50} />
      </View>
    );
  }
};

const styles = StyleSheet.create({});

export default ExploreScreen;
