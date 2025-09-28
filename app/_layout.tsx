import { Stack } from "expo-router";
import { useEffect } from "react";
import { Text, TextInput } from "react-native";
import "./global.css";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

// Keep the native splash on while fonts load
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Load Inter variable fonts (one file = all weights)
  const [loaded, error] = useFonts({
    Inter: require("../assets/fonts/InterVariable.ttf"),
    "Inter-Italic": require("../assets/fonts/InterVariable-Italic.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      // Cast to any so we can set defaultProps without TS complaints
      const RNText = Text as any;
      const RNTextInput = TextInput as any;

      // Apply Inter globally to all <Text/>
      const prevText = RNText.defaultProps?.style;
      RNText.defaultProps = RNText.defaultProps || {};
      RNText.defaultProps.style = Array.isArray(prevText)
        ? [...prevText, { fontFamily: "Inter" }]
        : [prevText || {}, { fontFamily: "Inter" }];

      // Apply Inter to all <TextInput/> (placeholders/inputs)
      const prevInput = RNTextInput.defaultProps?.style;
      RNTextInput.defaultProps = RNTextInput.defaultProps || {};
      RNTextInput.defaultProps.style = Array.isArray(prevInput)
        ? [...prevInput, { fontFamily: "Inter" }]
        : [prevInput || {}, { fontFamily: "Inter" }];

      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  // Keep splash visible until fonts finish
  if (!loaded && !error) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
