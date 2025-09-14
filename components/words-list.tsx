import PaginationBar from "@/components/pagination-bar";
import WordCard from "@/components/word-card";
import type { Word } from "@/lib/api";
import type { RefObject } from "react";
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from "react-native";

type Props = {
  items: Word[];
  loading: boolean;
  refreshing: boolean;
  err?: string | null;
  onRefresh: () => void;

  // pagination
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  showingFrom: number;
  showingTo: number;
  total: number;

  // list ref for scroll-to-top
  listRef: RefObject<FlatList<Word> | null>; //  allow null
};

export default function WordsList({
  items,
  loading,
  refreshing,
  err,
  onRefresh,
  page,
  setPage,
  totalPages,
  showingFrom,
  showingTo,
  total,
  listRef,
}: Props) {
  if (loading && items.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
        <Text className="mt-2 text-gray-500">Loading words…</Text>
        {err ? <Text className="mt-1 text-red-600">{err}</Text> : null}
      </View>
    );
  }

  return (
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
          onPrev={() => setPage(Math.max(1, page - 1))}
          onNext={() => setPage(Math.min(totalPages, page + 1))}
          showingFrom={showingFrom}
          showingTo={showingTo}
          total={total}
        />
      }
    />
  );
}
