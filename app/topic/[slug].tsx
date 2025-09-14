import { fetchWords, Paged, Word } from "@/lib/api";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
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

  // --- Pagination state
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20); // change this if you want a different page size
  const [total, setTotal] = useState(0);
  const totalPages = Math.max(1, Math.ceil(total / Math.max(1, limit)));

  // --- Data + UI state
  const [items, setItems] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const listRef = useRef<FlatList<Word>>(null);

  // Core loader for the current page
  const load = async (targetPage: number) => {
    if (!slug) return;
    try {
      setLoading(true);
      const res: Paged<Word> = await fetchWords({
        topic: String(slug),
        q,
        page: targetPage,
        limit,
      });
      setItems(res.items);            // page-based: replace, don't append
      setTotal(res.total || 0);
      setLimit(res.limit || limit);   // trust API if it returns final limit
      setErr(null);
    } catch (e: any) {
      setErr(e?.message || "Failed to load");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 1) When topic changes → reset to page 1 and load
  useEffect(() => {
    setItems([]);
    setPage(1);
    setTotal(0);
    setErr(null);
    if (slug) load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // 2) When search text changes → debounce & reset to page 1
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      load(1);
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  // 3) When page changes (Prev/Next) → load that page and scroll to top
  useEffect(() => {
    if (!slug) return;
    load(page);
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const onRefresh = () => {
    setRefreshing(true);
    load(page);
  };

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 pt-10 pb-3 border-b border-gray-200 bg-white">
        <View className="flex-row items-center">
          <Pressable onPress={() => router.back()} className="mr-3 rounded-full p-2 bg-gray-100">
            <Text className="text-base">‹</Text>
          </Pressable>
          <View className="flex-1">
            <Text className="text-2xl font-bold">{title}</Text>
            {!!total && (
              <Text className="text-gray-500 mt-0.5">
                {total.toLocaleString()} words • Page {page} of {totalPages}
              </Text>
            )}
          </View>
        </View>

        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search words…"
          className="mt-3 rounded-xl border border-gray-300 px-4 py-3 text-base"
          autoCorrect={false}
          returnKeyType="search"
        />
      </View>

      {/* Body */}
      {loading && items.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
          <Text className="mt-2 text-gray-500">Loading words…</Text>
          {err ? <Text className="mt-1 text-red-600">{err}</Text> : null}
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={items}
          keyExtractor={(w) => w.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
          // Pagination footer
          ListFooterComponent={
            <View className="px-4 py-5">
              <View className="flex-row items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 px-3 py-3">
                <Pressable
                  disabled={!canPrev}
                  onPress={() => setPage((p) => Math.max(1, p - 1))}
                  className={`px-4 py-2 rounded-xl ${canPrev ? "bg-white border border-gray-300" : "bg-gray-100 opacity-60"}`}
                >
                  <Text className="font-medium">Prev</Text>
                </Pressable>

                <Text className="text-gray-700">
                  Page <Text className="font-semibold">{page}</Text> of{" "}
                  <Text className="font-semibold">{totalPages}</Text>
                </Text>

                <Pressable
                  disabled={!canNext}
                  onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className={`px-4 py-2 rounded-xl ${canNext ? "bg-white border border-gray-300" : "bg-gray-100 opacity-60"}`}
                >
                  <Text className="font-medium">Next</Text>
                </Pressable>
              </View>

              {/* Optional: quick page info like "showing X–Y" */}
              {!!total && (
                <Text className="text-center text-gray-500 mt-2">
                  Showing {(page - 1) * limit + 1}–
                  {Math.min(page * limit, total)} of {total}
                </Text>
              )}
            </View>
          }
        />
      )}
    </View>
  );
}
