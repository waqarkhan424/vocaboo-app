import { fetchWords, Paged, Word } from "@/lib/api";
import { useEffect, useMemo, useRef, useState } from "react";
import type { FlatList } from "react-native";

// Canonical topic labels + order for the chips
const TOPIC_LABELS: Record<string, string> = {
  all: "Total Words",
  "all-words": "All Words",
  "css-dawn-vocabulary": "Css Dawn Vocabulary",
  "essential-words": "Essential Words",
};

// The order they appear in the switcher
export const TOPIC_KEYS = ["all", "all-words", "css-dawn-vocabulary", "essential-words"] as const;

export function prettyTopic(slug: string) {
  if (TOPIC_LABELS[slug]) return TOPIC_LABELS[slug];
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function useTopicWords(initialSlug?: string) {
  // Determine the initial topic (from URL if valid, else first)
  const initial = (initialSlug && TOPIC_LABELS[initialSlug]) ? initialSlug : TOPIC_KEYS[0];

  const [activeTopic, setActiveTopic] = useState<string>(initial);
  const title = useMemo(() => prettyTopic(activeTopic), [activeTopic]);

  // Filters + pagination state
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20); // default 20 / page
  const [total, setTotal] = useState(0);

  // Data + UI
  const [items, setItems] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const listRef = useRef<FlatList<Word> | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / Math.max(1, limit)));
  const showingFrom = total === 0 ? 0 : (page - 1) * limit + 1;
  const showingTo = Math.min(page * limit, total);

  // Core loader
  const load = async (targetPage: number) => {
    try {
      setLoading(true);
      const res: Paged<Word> = await fetchWords({
        topic: activeTopic, // 🔑 load for current topic
        q,
        page: targetPage,
        limit,
      });
      setItems(res.items);
      setTotal(res.total || 0);
      if (res.limit && res.limit !== limit) setLimit(res.limit);
      setErr(null);
    } catch (e: any) {
      setErr(e?.message || "Failed to load");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // If URL slug changes during navigation, adopt it as the active topic (if valid)
  useEffect(() => {
    if (initialSlug && TOPIC_LABELS[initialSlug]) {
      setActiveTopic(initialSlug);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSlug]);

  // When active topic changes → reset and load first page
  useEffect(() => {
    setItems([]);
    setPage(1);
    setTotal(0);
    setErr(null);
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTopic]);

  // Debounce search → reset to page 1
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      load(1);
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  // Change page
  useEffect(() => {
    load(page);
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Change per-page
  useEffect(() => {
    setPage(1);
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit]);

  const onRefresh = () => {
    setRefreshing(true);
    load(page);
  };

  // Build topics array for the switcher
  const topics = useMemo(
    () => TOPIC_KEYS.map((key) => ({ key, label: prettyTopic(key) })),
    []
  );

  return {
    // topic switching
    topics,
    activeTopic,
    setActiveTopic,

    // display
    title,

    // filters
    q,
    setQ,
    limit,
    setLimit,

    // pagination
    page,
    setPage,
    total,
    totalPages,
    showingFrom,
    showingTo,

    // data
    items,
    loading,
    refreshing,
    err,
    onRefresh,

    // list ref for scrolling
    listRef,
  };
}
