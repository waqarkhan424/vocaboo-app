import PerPagePicker from "@/components/per-page-picker";
import { Text, TextInput, View } from "react-native";

type Props = {
  q: string;
  setQ: (v: string) => void;
  limit: number;
  setLimit: (n: number) => void;

  // NEW: to render "X words • Page P of T" on the same row as the dropdown
  total: number;
  page: number;
  totalPages: number;
};

export default function SearchBar({ q, setQ, limit, setLimit, total, page, totalPages }: Props) {
  return (
    <View className="px-4 pt-2 pb-3 border-b border-gray-100 bg-white">
      {/* Search input */}
      <TextInput
        value={q}
        onChangeText={setQ}
        placeholder="Search words…"
        className="mt-1 rounded-xl border border-gray-300 px-4 py-3 text-base"
        autoCorrect={false}
        returnKeyType="search"
      />

      {/* One row: summary (left) + dropdown (right) */}
      <View className="mt-3 flex-row items-center justify-between">
        <Text className="text-gray-700">
          {total ? `${total.toLocaleString()} words • Page ${page} of ${totalPages}` : ""}
        </Text>
        <PerPagePicker value={limit} onChange={setLimit} />
      </View>
    </View>
  );
}
