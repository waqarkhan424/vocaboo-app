import SearchBar from "@/components/search-bar";
import TopicHeader from "@/components/topic-header";
import TopicSwitcher from "@/components/topic-switcher";
import WordsList from "@/components/words-list";
import useTopicWords from "@/hooks/useTopicWords";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
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
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Light status bar for the indigo hero header */}
      <StatusBar style="light" />

      {/* Hero header */}
      <View className="bg-indigo-600 rounded-b-3xl pb-6">
        <TopicHeader
          title={title}
          total={total}
          page={page}
          totalPages={totalPages}
          showMeta={true}
          onDark={true}
        />
      </View>

      {/* Floating search card */}
      <View className="px-4 -mt-5">
        <View
          className="rounded-2xl bg-white overflow-hidden"
          style={{
            // soft shadow cross-platform
            shadowColor: "#000",
            shadowOpacity: 0.12,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 6 },
            elevation: 8,
          }}
        >
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

      {/* Topic chips */}
      <View className="px-4 pt-3 pb-1">
        <TopicSwitcher
          topics={topics}
          active={activeTopic}
          onChange={(key) => setActiveTopic(key)}
        />
      </View>

      {/* Divider */}
      <View className="h-[1px] bg-gray-200 mx-4" />

      {/* Words list */}
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
