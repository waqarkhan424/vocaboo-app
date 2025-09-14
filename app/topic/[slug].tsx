import SearchBar from "@/components/search-bar";
import TopicHeader from "@/components/topic-header";
import TopicSwitcher from "@/components/topic-switcher";
import WordsList from "@/components/words-list";
import useTopicWords from "@/hooks/useTopicWords";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

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
    <View className="flex-1 bg-white">
      <TopicHeader title={title} total={total} page={page} totalPages={totalPages} />

      {/* NEW: Chips to switch between Total Words / All Words / Css Dawn Vocabulary / Essential Words */}
      <TopicSwitcher topics={topics} active={activeTopic} onChange={(key) => setActiveTopic(key)} />

      <SearchBar q={q} setQ={setQ} limit={limit} setLimit={setLimit} />

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
    </View>
  );
}
