import PerPagePicker from "@/components/per-page-picker";
import { TextInput, View } from "react-native";

type Props = {
  q: string;
  setQ: (v: string) => void;
  limit: number;
  setLimit: (n: number) => void;
};

export default function SearchBar({ q, setQ, limit, setLimit }: Props) {
  return (
    <View className="px-4 pt-2 pb-3 border-b border-gray-100 bg-white">
      <TextInput
        value={q}
        onChangeText={setQ}
        placeholder="Search words…"
        className="mt-1 rounded-xl border border-gray-300 px-4 py-3 text-base"
        autoCorrect={false}
        returnKeyType="search"
      />
      <PerPagePicker value={limit} onChange={setLimit} />
    </View>
  );
}
