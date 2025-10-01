import PerPagePicker from "@/components/per-page-picker";
import { Ionicons } from "@expo/vector-icons";
import { Text, TextInput, View } from "react-native";

type Props = {
  q: string;
  setQ: (v: string) => void;
  limit: number;
  setLimit: (n: number) => void;

  total: number;
  page: number;
  totalPages: number;
};

export default function SearchBar({
  q,
  setQ,
  limit,
  setLimit,
  total,
  page,
  totalPages,
}: Props) {
  return (
    <View className="px-4 pt-2 pb-3 bg-white">
      {/* Input with icon */}
      <View className="flex-row items-center rounded-2xl border border-gray-300 px-3 py-2 bg-white">
        <Ionicons name="search" size={18} color="#6B7280" />
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search words…"
          className="ml-2 flex-1 text-base py-1"
          autoCorrect={false}
          returnKeyType="search"
        />
      </View>

      {/* Summary + per-page dropdown */}
      <View className="mt-3 flex-row items-center justify-between">
        <Text className="text-gray-700">
          {total ? `${total.toLocaleString()} words • Page ${page} of ${totalPages}` : ""}
        </Text>

        {/* Slightly closer to the trigger after gutter reduction */}
        <PerPagePicker value={limit} onChange={setLimit} menuOffsetY={12} />
      </View>
    </View>
  );
}
