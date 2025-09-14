import { Pressable, Text, View } from "react-native";

type Props = {
  value: number;
  onChange: (n: number) => void;
  options?: number[];
};

const DEFAULTS = [10, 20, 30, 50];

export default function PerPagePicker({ value, onChange, options = DEFAULTS }: Props) {
  return (
    <View className="flex-row gap-2 mt-3">
      {options.map((n) => {
        const active = value === n;
        return (
          <Pressable
            key={n}
            onPress={() => onChange(n)}
            className={`px-3 py-2 rounded-xl border ${
              active ? "bg-blue-50 border-blue-400" : "bg-white border-gray-300"
            }`}
          >
            <Text className={active ? "text-blue-700 font-semibold" : "text-gray-700"}>
              {n} / page
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
