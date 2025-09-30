import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "./global.css";

// The root layout wraps the stack in a fragment so we can render the
// StatusBar alongside the navigator. Without explicitly setting the
// StatusBar style, Android defaults to dark icons which are invisible on
// our indigo header. Setting the style to "light" ensures the icons
// remain visible when the header has a dark background.
export default function RootLayout() {
  return (
    <>
      {/* Light status bar text for dark headers */}
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}