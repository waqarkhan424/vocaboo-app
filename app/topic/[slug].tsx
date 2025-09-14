import { fetchWords, Paged, Word } from "@/lib/api";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    RefreshControl,
    Text,
    TextInput,
    View,
} from "react-native";

// (Keep the same labels used on Home)
const TOPIC_LABELS: Record<string, string> = {
  all: "Total Words",
  "all-words": "All Words",
  "css-dawn-vocabulary": "Css Dawn Vocabulary",
  "essential-words": "Essential Words",
};

function prettyTopic(slug: string) {
  if (TOPIC_LABELS[slug]) return TOPIC_LABELS[slug];
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function TopicScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const title = useMemo(() => prettyTopic(String(slug || "")), [slug]);

  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<Word[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = async (nextPage: number, append = true) => {
    if (!slug) return;
    try {
      if (!append) setLoading(true);
      const res: Paged<Word> = await fetchWords({
        topic: String(slug),
        q,
        page: nextPage,
        limit: 20,
      });
      setHasMore(res.hasMore);
      setPage(res.page);
      setItems((prev) => (append ? [...prev, ...res.items] : res.items));
      setErr(null);
    } catch (e: any) {
      setErr(e?.message || "Failed to load");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    // first load for this slug
    setItems([]);
    setHasMore(true);
    setPage(1);
    load(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // When search changes, re-query from page 1 (simple approach)
  useEffect(() => {
    const t = setTimeout(() => {
      setItems([]);
      setHasMore(true);
      load(1, false);
    }, 300); // small debounce
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const onEndReached = () => {
    if (!loading && hasMore) load(page + 1, true);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setItems([]);
    setHasMore(true);
    load(1, false);
  };

  return (
    <View className="flex-1 bg-white">
      {/* Simple custom header */}
      <View className="px-4 pt-10 pb-3 border-b border-gray-200 bg-white">
        <View className="flex-row items-center">
          <Pressable onPress={() => router.back()} className="mr-3 rounded-full p-2 bg-gray-100">
            <Text className="text-base">‹</Text>
          </Pressable>
          <Text className="text-2xl font-bold flex-1">{title}</Text>
        </View>

        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search words…"
          className="mt-3 rounded-xl border border-gray-300 px-4 py-3 text-base"
          autoCorrect={false}
        />
      </View>

      {loading && items.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
          <Text className="mt-2 text-gray-500">Loading words…</Text>
          {err ? <Text className="mt-1 text-red-600">{err}</Text> : null}
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(w) => w.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          onEndReachedThreshold={0.6}
          onEndReached={onEndReached}
          ListEmptyComponent={
            <View className="px-6 py-10">
              <Text className="text-center text-gray-500">No words found.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View className="mx-4 mt-3 rounded-2xl bg-gray-50 border border-gray-200 p-4">
              <Text className="text-xl font-semibold">{item.word}</Text>
              <Text className="mt-1 text-gray-700">{item.definition}</Text>
              {!!item.urduMeaning && <Text className="mt-1 text-green-700">{item.urduMeaning}</Text>}
              {!!item.example && <Text className="mt-2 italic text-blue-700">{item.example}</Text>}
            </View>
          )}
          ListFooterComponent={
            hasMore ? (
              <View className="py-4 items-center">
                <ActivityIndicator />
              </View>
            ) : (
              <View className="py-6" />
            )
          }
        />
      )}
    </View>
  );
}
