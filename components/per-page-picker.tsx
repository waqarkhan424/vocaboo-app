import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
  value: number;
  onChange: (n: number) => void;
  options?: number[];
};

const DEFAULTS = [10, 20, 30, 50];

export default function PerPagePicker({ value, onChange, options = DEFAULTS }: Props) {
  const [open, setOpen] = useState(false);

  // close dropdown when value changes
  useEffect(() => {
    if (open) setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <View className="relative">
      {/* Trigger */}
      <Pressable
        hitSlop={8}
        onPress={() => setOpen((o) => !o)}
        className="flex-row items-center gap-2 px-3 py-2 rounded-xl border bg-white border-gray-300"
      >
        <Text className="text-gray-700">{value} / page</Text>
        <Ionicons name={open ? "chevron-up" : "chevron-down"} size={16} color="#374151" />
      </Pressable>

      {/* Backdrop (tap anywhere outside to close) */}
      {open && (
        <Pressable
          onPress={() => setOpen(false)}
          className="absolute"
          // cover the full screen area relative to the parent
          style={{ top: 0, left: -1000, right: -1000, bottom: -1000 }}
        />
      )}

      {/* Menu — positioned BELOW the trigger so the trigger stays tappable */}
      {open && (
        <View
          className="absolute z-50 w-40 rounded-xl border border-gray-200 bg-white right-0"
          style={{
            top: 44, // ≈ trigger height + small gap; keeps trigger visible/clickable
            // subtle elevation across platforms
            shadowColor: "#000",
            shadowOpacity: 0.12,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
            elevation: 6,
          }}
        >
          {options.map((n, i) => {
            const active = value === n;
            return (
              <Pressable
                key={n}
                onPress={() => onChange(n)}
                className={`px-3 py-2 flex-row items-center justify-between ${
                  i !== options.length - 1 ? "border-b border-gray-100" : ""
                } ${active ? "bg-blue-50" : ""}`}
              >
                <Text className={active ? "text-blue-700 font-semibold" : "text-gray-700"}>
                  {n} / page
                </Text>
                {active ? (
                  <Ionicons name="checkmark" size={16} color="#1D4ED8" />
                ) : (
                  <Ionicons name="chevron-forward" size={14} color="#9CA3AF" />
                )}
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}
