import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

type Props = {
  title: string;
  total: number;
  page: number;
  totalPages: number;
  showMeta?: boolean;
};

export default function TopicHeader({
  title,
  total,
  page,
  totalPages,
  showMeta = true,
}: Props) {
  return (
    <View
      className="px-4 pt-10 pb-3 bg-white border-b border-gray-200"
      // light drop shadow under the header (Android & iOS)
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 2,
      }}
    >
      <View className="flex-row items-center">
        {/* Bigger back button */}
        <Pressable
          onPress={() => router.back()}
          accessibilityLabel="Go back"
          className="mr-3 rounded-full bg-gray-100 w-10 h-10 items-center justify-center"
        >
          <Ionicons name="chevron-back" size={22} color="#374151" />
        </Pressable>

        <View className="flex-1">
          <Text className="text-[22px] font-bold text-gray-900">{title}</Text>

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
