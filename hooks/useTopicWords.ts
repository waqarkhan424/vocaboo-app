import { fetchWords, Paged, Word } from "@/lib/api";
import { useEffect, useMemo, useRef, useState } from "react";
import type { FlatList } from "react-native";

// Map slugs to display labels (same mapping used elsewhere)
const TOPIC_LABELS: Record<string, string> = {
  all: "Total Words",
  "all-words": "All Words",
  "css-dawn-vocabulary": "Css Dawn Vocabulary",
  "essential-words": "Essential Words",
};

export function prettyTopic(slug: string) {
  if (TOPIC_LABELS[slug]) return TOPIC_LABELS[slug];
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function useTopicWords(slug?: string) {
  const title = useMemo(() => prettyTopic(String(slug || "")), [slug]);

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
      if (res.limit && res.limit !== limit) setLimit(res.limit);
      setErr(null);
    } catch (e: any) {
      setErr(e?.message || "Failed to load");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Topic change → reset
  useEffect(() => {
    setItems([]);
    setPage(1);
    setTotal(0);
    setErr(null);
    if (slug) load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // Debounce search
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
    if (!slug) return;
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

  return {
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
