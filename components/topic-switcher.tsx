import { Pressable, ScrollView, Text, View } from "react-native";

type TopicItem = { key: string; label: string };

type Props = {
  topics: TopicItem[];
  active: string;
  onChange: (key: string) => void;
};

export default function TopicSwitcher({ topics, active, onChange }: Props) {
  return (
    <View className="bg-white">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
      >
        <View className="flex-row items-center gap-2">
          {topics.map((t) => {
            const isActive = t.key === active;
            return (
              <Pressable
                key={t.key}
                onPress={() => onChange(t.key)}
                className={`px-3 py-2 rounded-xl border ${
                  isActive
                    ? "bg-blue-50 border-blue-400"
                    : "bg-white border-gray-300"
                }`}
              >
                <Text
                  className={
                    isActive ? "text-blue-700 font-semibold" : "text-gray-700"
                  }
                >
                  {t.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
