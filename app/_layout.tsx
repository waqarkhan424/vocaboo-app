import { Stack } from "expo-router";
import { useEffect } from "react";
import { Text, TextInput } from "react-native";
import "./global.css";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

// Keep the native splash visible while fonts load
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Load Merriweather (variable) — rename the files if your names differ
 
const [loaded, error] = useFonts({
  Merriweather: require("../assets/fonts/Merriweather-VariableFont_opsz,wdth,wght.ttf"),
  "Merriweather-Italic": require("../assets/fonts/Merriweather-Italic-VariableFont_opsz,wdth,wght.ttf"),
});


  useEffect(() => {
    if (loaded || error) {
      // TS types don't expose defaultProps — cast to any
      const RNText: any = Text;
      const RNTextInput: any = TextInput;

      // Apply Merriweather globally to all <Text />
      const prevText = RNText.defaultProps?.style;
      RNText.defaultProps = RNText.defaultProps || {};
      RNText.defaultProps.style = Array.isArray(prevText)
        ? [...prevText, { fontFamily: "Merriweather" }]
        : [prevText || {}, { fontFamily: "Merriweather" }];

      // Apply Merriweather to all <TextInput />
      const prevInput = RNTextInput.defaultProps?.style;
      RNTextInput.defaultProps = RNTextInput.defaultProps || {};
      RNTextInput.defaultProps.style = Array.isArray(prevInput)
        ? [...prevInput, { fontFamily: "Merriweather" }]
        : [prevInput || {}, { fontFamily: "Merriweather" }];

      // Hide splash when fonts are ready (or if there was an error)
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  // Keep splash visible until fonts finish to avoid FOUT
  if (!loaded && !error) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
