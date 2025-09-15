import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

type Props = {
  title: string;
  total: number;
  page: number;
  totalPages: number;
  /** New: allow hiding the meta row from the header */
  showMeta?: boolean;
};

export default function TopicHeader({ title, total, page, totalPages, showMeta = true }: Props) {
  return (
    <View className="px-4 pt-10 pb-3 border-b border-gray-200 bg-white">
      <View className="flex-row items-center">
        <Pressable onPress={() => router.back()} className="mr-3 rounded-full p-2 bg-gray-100">
          <Text className="text-base">‹</Text>
        </Pressable>
        <View className="flex-1">
          <Text className="text-2xl font-bold">{title}</Text>
          {showMeta && !!total && (
            <Text className="text-gray-500 mt-0.5">
              {total.toLocaleString()} words • Page {page} of {totalPages}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}
