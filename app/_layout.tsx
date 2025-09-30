import { Stack } from "expo-router";
import "./global.css";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform, Text, TextInput } from "react-native";

// 1) Patch defaults at module scope so it's in place BEFORE first render.
//    It's okay if the font isn't loaded yet; expo-font will swap once ready.
const RNText: any = Text;
const RNTextInput: any = TextInput;

RNText.defaultProps = RNText.defaultProps || {};
RNTextInput.defaultProps = RNTextInput.defaultProps || {};

const prevText = RNText.defaultProps.style;
RNText.defaultProps.style = Array.isArray(prevText)
  ? [...prevText, { fontFamily: "NunitoSans" }]
  : [{ fontFamily: "NunitoSans" }, prevText].filter(Boolean);

const prevInput = RNTextInput.defaultProps.style;
RNTextInput.defaultProps.style = Array.isArray(prevInput)
  ? [...prevInput, { fontFamily: "NunitoSans" }]
  : [{ fontFamily: "NunitoSans" }, prevInput].filter(Boolean);

// Optional: useful on Android for better shaping/scaling
if (Platform.OS === "android") {
  RNText.defaultProps.allowFontScaling = RNText.defaultProps.allowFontScaling ?? true;
  RNTextInput.defaultProps.allowFontScaling =
    RNTextInput.defaultProps.allowFontScaling ?? true;
}

// Keep the native splash visible while fonts load
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  // 2) Load Nunito Sans (variable) + italic face
  const [loaded, error] = useFonts({
    NunitoSans: require("../assets/fonts/NunitoSansVariable.ttf"),
    "NunitoSans-Italic": require("../assets/fonts/NunitoSansVariable-Italic.ttf"),
  });

  // 3) Hide splash when fonts are ready (or on error)
  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [loaded, error]);

  // 4) While fonts load, keep the native splash on screen
  if (!loaded && !error) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
