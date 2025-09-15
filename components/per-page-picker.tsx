import { useEffect, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
  value: number;
  onChange: (n: number) => void;
  options?: number[];
};

const DEFAULTS = [10, 20, 30, 50];

export default function PerPagePicker({ value, onChange, options = DEFAULTS }: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<View | null>(null);

  // close dropdown on value change
  useEffect(() => {
    if (open) setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <View ref={containerRef} className="relative">
      {/* Trigger button */}
      <Pressable
        onPress={() => setOpen((o) => !o)}
        className="px-3 py-2 rounded-xl border bg-white border-gray-300"
      >
        <Text className="text-gray-700">
          {value} / page
        </Text>
      </Pressable>

      {/* Backdrop (click outside to close) */}
      {open && (
        <Pressable
          onPress={() => setOpen(false)}
          className="absolute inset-0"
          style={{ top: 40, left: -1000, right: -1000, bottom: -1000 }}
        />
      )}

      {/* Menu */}
      {open && (
        <View className="absolute z-50 mt-2 w-36 rounded-xl border border-gray-200 bg-white shadow-lg">
          {options.map((n, i) => {
            const active = value === n;
            return (
              <Pressable
                key={n}
                onPress={() => onChange(n)}
                className={`px-3 py-2 ${i !== options.length - 1 ? "border-b border-gray-100" : ""} ${
                  active ? "bg-blue-50" : ""
                }`}
              >
                <Text className={active ? "text-blue-700 font-semibold" : "text-gray-700"}>
                  {n} / page
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}
