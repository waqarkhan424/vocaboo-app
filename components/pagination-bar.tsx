import { Pressable, Text, View } from "react-native";

type Props = {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  showingFrom?: number;
  showingTo?: number;
  total?: number;
};

export default function PaginationBar({
  page,
  totalPages,
  onPrev,
  onNext,
  showingFrom,
  showingTo,
  total,
}: Props) {
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <View className="px-4 py-5">
      <View className="flex-row items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 px-3 py-3">
        <Pressable
          disabled={!canPrev}
          onPress={onPrev}
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
          onPress={onNext}
          className={`px-4 py-2 rounded-xl ${canNext ? "bg-white border border-gray-300" : "bg-gray-100 opacity-60"}`}
        >
          <Text className="font-medium">Next</Text>
        </Pressable>
      </View>

      {!!total && (
        <Text className="text-center text-gray-500 mt-2">
          Showing {showingFrom ?? 0}–{showingTo ?? 0} of {total}
        </Text>
      )}
    </View>
  );
}
