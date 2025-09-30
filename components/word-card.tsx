import type { Word } from "@/lib/api";
import { Text, View } from "react-native";

type Props = { item: Word };

export default function WordCard({ item }: Props) {
  return (
    <View className="mx-4 mt-4 rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">

      <Text className="text-2xl font-semibold tracking-tight">
        {item.word}
      </Text>

      <Text className="mt-3 text-xl text-gray-800 leading-relaxed">
        {item.definition}
      </Text>

      {!!item.urduMeaning && (
        <Text className="mt-3 text-xl text-emerald-700 leading-relaxed font-semibold">
          {item.urduMeaning}
        </Text>
      )}

      {!!item.example && (
        <View className="mt-4 pl-3 border-l-4 border-indigo-200">
          <Text className="italic text-xl text-indigo-800 leading-relaxed">
            {`“${item.example}”`}
          </Text>
        </View>
      )}
    </View>
  );
}
