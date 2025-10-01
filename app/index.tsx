import { fetchTopics, Topic } from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Linking,
  Platform,
  Pressable,
  Share,
  Text,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

// Map slugs to display labels & icons/colors
const TOPIC_META: Record<
  string,
  { label: string; icon: keyof typeof Ionicons.glyphMap; color: string }
> = {
  all: { label: "Total Words", icon: "book-outline", color: "#4F46E5" },
  "all-words": { label: "All Words", icon: "layers-outline", color: "#0891B2" },
  "css-dawn-vocabulary": {
    label: "Css Dawn Vocabulary",
    icon: "sunny-outline",
    color: "#D97706",
  },
  "essential-words": {
    label: "Essential Words",
    icon: "star-outline",
    color: "#16A34A",
  },
};

// fallback for unknown slugs
function prettyTopic(slug: string) {
  return (
    TOPIC_META[slug]?.label ||
    slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

// Play Store package and share link
const ANDROID_PACKAGE = "com.waqar_424.vocabooapp";
const STORE_LINK =
  Platform.select({
    android: `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`,
    ios: "https://apps.apple.com/", // placeholder if you later publish on iOS
    default: `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`,
  }) || `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`;

export default function Home() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetchTopics()
      .then(setTopics)
      .catch((e) => setErr(String(e?.message || e)))
      .finally(() => setLoading(false));
  }, []);

  const handleRate = async () => {
    // Prefer native market URL on Android, then fall back to web
    const marketUrl = `market://details?id=${ANDROID_PACKAGE}`;
    if (Platform.OS === "android") {
      const canOpenMarket = await Linking.canOpenURL(marketUrl);
      if (canOpenMarket) {
        try {
          await Linking.openURL(marketUrl);
          return;
        } catch {}
      }
    }
    // Fallback (or iOS/web)
    Linking.openURL(STORE_LINK);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message:
          `I'm learning new words with Vocaboo — it’s simple and helpful.\nDownload: ${STORE_LINK}`,
      });
    } catch {
      // no-op
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text className="mt-2 text-gray-500">Loading topics…</Text>
      </SafeAreaView>
    );
  }

  if (err) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-red-600 font-semibold mb-2">Failed to load</Text>
        <Text className="text-center text-gray-600">{err}</Text>
      </SafeAreaView>
    );
  }

  return (
  

  // IMPORTANT: exclude "top" so this SafeAreaView doesn't paint the status area white
    <SafeAreaView className="flex-1 bg-white" edges={["bottom", "left", "right"]}>
      {/* Make status bar text light and draw under it */}
      <StatusBar style="light" translucent backgroundColor="transparent" />

      {/* Paint the transparent status-bar inset */}
      <View style={{ height: insets.top, backgroundColor: "#4F46E5" }} />


      {/* Header */}
      <View className="px-6 pt-6 pb-6 bg-indigo-600 rounded-b-3xl">
        <Text className="text-3xl font-bold text-white">Explore Vocabulary</Text>
        <Text className="text-indigo-100 mt-1">Learn and practice words easily</Text>
      </View>

      {/* List of topics */}
      <FlatList
        contentContainerStyle={{ padding: 16 }}
        data={topics}
        keyExtractor={(i) => i.topic}
        renderItem={({ item }) => {
          const meta = TOPIC_META[item.topic] || {
            label: prettyTopic(item.topic),
            icon: "folder-outline" as keyof typeof Ionicons.glyphMap,
            color: "#6B7280",
          };
          return (
            <Pressable
              className="rounded-2xl p-5 mb-4 bg-white shadow-md flex-row items-center"
              onPress={() =>
                router.push({
                  pathname: "/topic/[slug]",
                  params: { slug: item.topic },
                })
              }
            >
              <View
                className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                style={{ backgroundColor: meta.color + "22" }}
              >
                <Ionicons name={meta.icon} size={26} color={meta.color} />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-900">
                  {meta.label}
                </Text>
                <Text className="text-gray-500">{item.count} words</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </Pressable>
          );
        }}
        ListFooterComponent={
          <View className="mt-2">
            {/* Rate & Share row */}
            <View className="flex-row gap-3 px-1 mt-2">
              <Pressable
                onPress={handleRate}
                className="flex-1 rounded-2xl bg-white border border-gray-200 px-4 py-4 items-center shadow-sm"
              >
                <View className="flex-row items-center gap-2">
                  <Ionicons name="star" size={18} color="#F59E0B" />
                  <Text className="text-gray-900 font-semibold">Rate App</Text>
                </View>
                <Text className="text-gray-500 text-xs mt-1">Play Store</Text>
              </Pressable>

              <Pressable
                onPress={handleShare}
                className="flex-1 rounded-2xl bg-white border border-gray-200 px-4 py-4 items-center shadow-sm"
              >
                <View className="flex-row items-center gap-2">
                  <Ionicons name="share-social-outline" size={18} color="#2563EB" />
                  <Text className="text-gray-900 font-semibold">Share App</Text>
                </View>
                <Text className="text-gray-500 text-xs mt-1">Invite friends</Text>
              </Pressable>
            </View>

            {/* Links */}
            <View className="mt-6 items-center">
              <Text
                className="text-blue-600 underline mb-2"
                onPress={() =>
                  WebBrowser.openBrowserAsync(
                    "https://waqarkhan424.github.io/vocaboo-legal/privacy.html"
                  )
                }
              >
                Privacy Policy
              </Text>
              <Text
                className="text-blue-600 underline"
                onPress={() =>
                  WebBrowser.openBrowserAsync(
                    "https://waqarkhan424.github.io/vocaboo-legal/terms.html"
                  )
                }
              >
                Terms & Conditions
              </Text>
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
}
