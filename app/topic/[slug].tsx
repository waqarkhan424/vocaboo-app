import SearchBar from "@/components/search-bar";
import TopicHeader from "@/components/topic-header";
import TopicSwitcher from "@/components/topic-switcher";
import WordsList from "@/components/words-list";
import useTopicWords from "@/hooks/useTopicWords";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TopicScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const {
    // switching
    topics,
    activeTopic,
    setActiveTopic,

    // header title derived from active topic
    title,

    // filters
    q, setQ,
    limit, setLimit,

    // pagination
    page, setPage,
    total, totalPages,
    showingFrom, showingTo,

    // data + ui
    items, loading, refreshing, err, onRefresh,
    listRef,
  } = useTopicWords(slug);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Hide meta here; it will show under the search input */}
      <TopicHeader title={title} total={0} page={page} totalPages={totalPages} showMeta={false} />

      {/* Topic chips */}
      <TopicSwitcher topics={topics} active={activeTopic} onChange={(key) => setActiveTopic(key)} />

      {/* Search + one-row summary + per-page dropdown */}
      <SearchBar
        q={q}
        setQ={setQ}
        limit={limit}
        setLimit={setLimit}
        total={total}
        page={page}
        totalPages={totalPages}
      />

      <WordsList
        items={items}
        loading={loading}
        refreshing={refreshing}
        err={err}
        onRefresh={onRefresh}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        showingFrom={showingFrom}
        showingTo={showingTo}
        total={total}
        listRef={listRef}
      />
    </SafeAreaView>
  );
}
