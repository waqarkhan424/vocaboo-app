import { Stack } from "expo-router";
import { useEffect } from "react";
import { Text, TextInput } from "react-native";
import "./global.css";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  //  Load static Nunito Sans (non-variable) files
  const [loaded, error] = useFonts({
    "NunitoSans-Regular": require("../assets/fonts/NunitoSans-Regular.ttf"),
    "NunitoSans-Bold": require("../assets/fonts/NunitoSans-Bold.ttf"),
    "NunitoSans-Italic": require("../assets/fonts/NunitoSans-Italic.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      // Make Nunito Sans Regular the DEFAULT everywhere
      const RNText: any = Text;
      const RNTextInput: any = TextInput;

      RNText.defaultProps = RNText.defaultProps || {};
      RNTextInput.defaultProps = RNTextInput.defaultProps || {};

      const prevText = RNText.defaultProps.style;
      RNText.defaultProps.style = Array.isArray(prevText)
        ? [...prevText, { fontFamily: "NunitoSans-Regular" }]
        : [prevText || {}, { fontFamily: "NunitoSans-Regular" }];

      const prevInput = RNTextInput.defaultProps.style;
      RNTextInput.defaultProps.style = Array.isArray(prevInput)
        ? [...prevInput, { fontFamily: "NunitoSans-Regular" }]
        : [prevInput || {}, { fontFamily: "NunitoSans-Regular" }];

      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  // Keep splash visible until fonts are ready
  if (!loaded && !error) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
