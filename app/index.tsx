import { fetchTopics, Topic } from "@/lib/api";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";

// Map slugs to display labels
const TOPIC_LABELS: Record<string, string> = {
  all: "Total Words",            //  virtual total
  "all-words": "All Words",      //  actual topic
  "css-dawn-vocabulary": "Css Dawn Vocabulary",
  "essential-words": "Essential Words",
};

// Fallback pretty label for unknown slugs
function prettyTopic(slug: string) {
  if (TOPIC_LABELS[slug]) return TOPIC_LABELS[slug];
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase()); // Title Case
}

export default function Home() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetchTopics()
      .then(setTopics)
      .catch((e) => setErr(String(e?.message || e)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator />
        <Text className="mt-2 text-gray-500">Loading topics…</Text>
      </View>
    );
  }

  if (err) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-red-600 font-semibold mb-2">Failed to load</Text>
        <Text className="text-center text-gray-600">{err}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-4">Vocabulary Topics</Text>
      <FlatList
        data={topics}
        keyExtractor={(i) => i.topic}
        renderItem={({ item }) => (
          <Pressable className="rounded-2xl p-4 mb-3 bg-gray-50 border border-gray-200">
            <Text className="text-lg font-semibold">{prettyTopic(item.topic)}</Text>
            <Text className="text-gray-500">{item.count} words</Text>
          </Pressable>
        )}
      />
    </View>
  );
}
