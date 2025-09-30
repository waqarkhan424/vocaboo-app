import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

type Props = {
  title: string;
  total: number;
  page: number;
  totalPages: number;
  showMeta?: boolean;
  /** When true, render for a dark/colored header (white text, softer button) */
  onDark?: boolean;
};

export default function TopicHeader({
  title,
  total,
  page,
  totalPages,
  showMeta = true,
  onDark = false,
}: Props) {
  const titleColor = onDark ? "text-white" : "text-gray-900";
  const metaColor = onDark ? "text-indigo-100" : "text-gray-500";
  const iconColor = onDark ? "#FFFFFF" : "#374151";
  const backBg = onDark ? "bg-white/20" : "bg-gray-100";

  return (
    <View className="px-4 pt-4 pb-3">
      <View className="flex-row items-center">
        {/* Bigger back button */}
        <Pressable
          onPress={() => router.back()}
          accessibilityLabel="Go back"
          className={`mr-3 rounded-full ${backBg} w-10 h-10 items-center justify-center`}
        >
          <Ionicons name="chevron-back" size={22} color={iconColor} />
        </Pressable>

        <View className="flex-1">
          <Text className={`text-[22px] font-bold ${titleColor}`}>{title}</Text>

          {showMeta && !!total && (
            <Text className={`${metaColor} mt-0.5`}>
              {total.toLocaleString()} words • Page {page} of {totalPages}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}
