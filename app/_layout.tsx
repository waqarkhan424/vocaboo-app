import { Stack } from "expo-router";
import { useEffect } from "react";
import { Text, TextInput } from "react-native";
import "./global.css";

import {
  Poppins_400Regular,
  Poppins_400Regular_Italic,
  Poppins_600SemiBold,
  useFonts,
} from "@expo-google-fonts/poppins";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,        // optional, for bold-ish text
    Poppins_400Regular_Italic,  // optional, for italic
  });

  useEffect(() => {
    if (loaded || error) {
      const RNText: any = Text;
      const RNTextInput: any = TextInput;

      // Make Poppins Regular the DEFAULT everywhere
      const prevText = RNText.defaultProps?.style;
      RNText.defaultProps = RNText.defaultProps || {};
      RNText.defaultProps.style = Array.isArray(prevText)
        ? [...prevText, { fontFamily: "Poppins_400Regular" }]
        : [prevText || {}, { fontFamily: "Poppins_400Regular" }];

      const prevInput = RNTextInput.defaultProps?.style;
      RNTextInput.defaultProps = RNTextInput.defaultProps || {};
      RNTextInput.defaultProps.style = Array.isArray(prevInput)
        ? [...prevInput, { fontFamily: "Poppins_400Regular" }]
        : [prevInput || {}, { fontFamily: "Poppins_400Regular" }];

      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
