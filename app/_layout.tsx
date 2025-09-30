import { Stack } from "expo-router";
import "./global.css";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform, Text, TextInput } from "react-native";

// Keep the splash visible while we load fonts
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  // Register the Nunito Sans VARIABLE fonts
  const [loaded, error] = useFonts({
    // One family for normal/weight axis, one for italic
    NunitoSans: require("../assets/fonts/NunitoSansVariable.ttf"),
    "NunitoSans-Italic": require("../assets/fonts/NunitoSansVariable-Italic.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      // Make Nunito Sans the DEFAULT for <Text> and <TextInput>
      const RNText: any = Text;
      const RNTextInput: any = TextInput;

      // Ensure objects exist
      RNText.defaultProps = RNText.defaultProps || {};
      RNTextInput.defaultProps = RNTextInput.defaultProps || {};

      // Preserve any existing default styles and append fontFamily
      const prevText = RNText.defaultProps.style;
      RNText.defaultProps.style = Array.isArray(prevText)
        ? [...prevText, { fontFamily: "NunitoSans" }]
        : [{ fontFamily: "NunitoSans" }, prevText].filter(Boolean);

      const prevInput = RNTextInput.defaultProps.style;
      RNTextInput.defaultProps.style = Array.isArray(prevInput)
        ? [...prevInput, { fontFamily: "NunitoSans" }]
        : [{ fontFamily: "NunitoSans" }, prevInput].filter(Boolean);

      // On Android, better text shaping with variable fonts
      if (Platform.OS === "android") {
        RNText.defaultProps.allowFontScaling = RNText.defaultProps.allowFontScaling ?? true;
        RNTextInput.defaultProps.allowFontScaling =
          RNTextInput.defaultProps.allowFontScaling ?? true;
      }

      // Hide the splash after fonts are ready
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    // Keep showing the native splash screen
    return null;
    // (No separate loading UI needed)
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
