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


import PaginationBar from "@/components/pagination-bar";
import PerPagePicker from "@/components/per-page-picker";
import WordCard from "@/components/word-card";

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

  // --- Pagination + filters
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20); // default 20 words per page
  const [total, setTotal] = useState(0);
  const totalPages = Math.max(1, Math.ceil(total / Math.max(1, limit)));

  // --- Data + UI state
  const [items, setItems] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const listRef = useRef<FlatList<Word>>(null);

  // Fetch words for a given page
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
      setItems(res.items);
      setTotal(res.total || 0);
      // trust server limit if it returns it; otherwise keep local
      if (res.limit && res.limit !== limit) {
        setLimit(res.limit);
      }
      setErr(null);
    } catch (e: any) {
      setErr(e?.message || "Failed to load");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // When topic changes → reset everything
  useEffect(() => {
    setItems([]);
    setPage(1);
    setTotal(0);
    setErr(null);
    if (slug) load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // Debounced search → reset to page 1
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      load(1);
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  // If page changes (Prev/Next) → reload and scroll top
  useEffect(() => {
    if (!slug) return;
    load(page);
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // If per-page changes → reset to first page and reload
  useEffect(() => {
    setPage(1);
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit]);

  const onRefresh = () => {
    setRefreshing(true);
    load(page);
  };

  const showingFrom = total === 0 ? 0 : (page - 1) * limit + 1;
  const showingTo = Math.min(page * limit, total);

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

        {/* Per-page picker (default 20) */}
        <PerPagePicker
          value={limit}
          onChange={(n) => setLimit(n)}
          // options default to [10,20,30,50]; pass a custom array if you want
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
          renderItem={({ item }) => <WordCard item={item} />}
          ListFooterComponent={
            <PaginationBar
              page={page}
              totalPages={totalPages}
              onPrev={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
              showingFrom={showingFrom}
              showingTo={showingTo}
              total={total}
            />
          }
        />
      )}
    </View>
  );
}
