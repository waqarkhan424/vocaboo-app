import type { Word } from "@/lib/api";
import { Text, View } from "react-native";

type Props = { item: Word };

export default function WordCard({ item }: Props) {
  return (
    <View className="mx-4 mt-3 rounded-2xl bg-gray-50 border border-gray-200 p-4">
      <Text className="text-xl font-semibold">{item.word}</Text>
      <Text className="mt-1 text-gray-700">{item.definition}</Text>
      {!!item.urduMeaning && <Text className="mt-1 text-green-700">{item.urduMeaning}</Text>}
      {!!item.example && <Text className="mt-2 italic text-blue-700">{item.example}</Text>}
    </View>
  );
}
