import { Stack } from "expo-router";
import { useEffect } from "react";
import { Text, TextInput } from "react-native";
import "./global.css";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

// Keep native splash visible while fonts load
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Load Bangers (very different from system font)
  const [loaded, error] = useFonts({
    Bangers: require("../assets/fonts/Bangers-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      // Cast to any so TS lets us set defaultProps
      const RNText: any = Text;
      const RNTextInput: any = TextInput;

      // Make Bangers the global default (for clear visual test)
      const prevText = RNText.defaultProps?.style;
      RNText.defaultProps = RNText.defaultProps || {};
      RNText.defaultProps.style = Array.isArray(prevText)
        ? [...prevText, { fontFamily: "Bangers" }]
        : [prevText || {}, { fontFamily: "Bangers" }];

      const prevInput = RNTextInput.defaultProps?.style;
      RNTextInput.defaultProps = RNTextInput.defaultProps || {};
      RNTextInput.defaultProps.style = Array.isArray(prevInput)
        ? [...prevInput, { fontFamily: "Bangers" }]
        : [prevInput || {}, { fontFamily: "Bangers" }];

      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  // Keep splash until fonts finish (avoid flash of system font)
  if (!loaded && !error) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
