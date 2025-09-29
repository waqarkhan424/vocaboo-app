import { Stack } from "expo-router";
import { useEffect } from "react";
import { Text, TextInput } from "react-native";
import "./global.css";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
 
  const [loaded, error] = useFonts({
    NunitoSans: require("../assets/fonts/NunitoSansVariable.ttf"),
    "NunitoSans-Italic": require("../assets/fonts/NunitoSansVariable-Italic.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      // Make Nunito Sans the DEFAULT for ALL Text/TextInput
      const RNText: any = Text;
      const RNTextInput: any = TextInput;

      const prevText = RNText.defaultProps?.style;
      RNText.defaultProps = RNText.defaultProps || {};
      RNText.defaultProps.style = Array.isArray(prevText)
        ? [...prevText, { fontFamily: "NunitoSans" }]
        : [prevText || {}, { fontFamily: "NunitoSans" }];

      const prevInput = RNTextInput.defaultProps?.style;
      RNTextInput.defaultProps = RNTextInput.defaultProps || {};
      RNTextInput.defaultProps.style = Array.isArray(prevInput)
        ? [...prevInput, { fontFamily: "NunitoSans" }]
        : [prevInput || {}, { fontFamily: "NunitoSans" }];

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
