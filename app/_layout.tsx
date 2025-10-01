import { Stack } from "expo-router";
import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context";
import "./global.css";

export default function RootLayout() {

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
}
