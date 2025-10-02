import SearchBar from "@/components/search-bar";
import TopicHeader from "@/components/topic-header";
import TopicSwitcher from "@/components/topic-switcher";
import WordsList from "@/components/words-list";
import useTopicWords from "@/hooks/useTopicWords";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
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

    // data + ui
    items,
    loading,
    refreshing,
    err,
    onRefresh,
    listRef,
  } = useTopicWords(slug);

  return (
    // Include top safe area; no manual status inset painting
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom", "left", "right"]}>
      {/* Indigo hero header */}
      <View className="bg-indigo-600 rounded-b-3xl pb-6">
        <TopicHeader
          title={title}
          total={0}
          page={page}
          totalPages={totalPages}
          showMeta={false}
          onDark
        />

        {/* Horizontal topic chips */}
        <TopicSwitcher
          topics={topics}
          active={activeTopic}
          onChange={(key) => setActiveTopic(key)}
        />
      </View>

      {/* Overlapping search card */}
      <View
        className="px-4 -mt-6"
        style={{
          // shadow/elevation
          shadowColor: "#000",
          shadowOpacity: 0.12,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 6 },
          elevation: 6,
        }}
      >
        <View className="rounded-2xl bg-white overflow-hidden">
          <SearchBar
            q={q}
            setQ={setQ}
            limit={limit}
            setLimit={setLimit}
            total={total}
            page={page}
            totalPages={totalPages}
          />
        </View>
      </View>

      {/* Error banner (subtle, non-blocking) */}
      {err ? (
        <View className="mx-4 mt-3 rounded-xl bg-red-50 border border-red-200 px-3 py-2">
          <Text className="text-red-700">{err}</Text>
        </View>
      ) : null}

      {/* List */}
      <View className="flex-1">
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
    </SafeAreaView>
  );
}
