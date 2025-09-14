import { useEffect, useState } from "react";
import { Keyboard, Pressable, Text, TextInput, View } from "react-native";

type Props = {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  onJump: (page: number) => void; //  NEW
  showingFrom?: number;
  showingTo?: number;
  total?: number;
};

export default function PaginationBar({
  page,
  totalPages,
  onPrev,
  onNext,
  onJump,
  showingFrom,
  showingTo,
  total,
}: Props) {
  const canPrev = page > 1;
  const canNext = page < totalPages;

  // local input state for the jump field
  const [input, setInput] = useState(String(page));

  // keep input synced when page changes externally
  useEffect(() => {
    setInput(String(page));
  }, [page]);

  const commitJump = () => {
    const n = Number(input);
    if (Number.isFinite(n)) {
      const clamped = Math.min(Math.max(1, Math.floor(n)), Math.max(1, totalPages));
      onJump(clamped);
      setInput(String(clamped));
      Keyboard.dismiss();
    } else {
      // reset to current page if non-numeric
      setInput(String(page));
    }
  };

  return (
    <View className="px-4 py-5">
      <View className="rounded-2xl border border-gray-200 bg-gray-50 px-3 py-3">
        {/* Row 1: Prev / Page X of Y / Next */}
        <View className="flex-row items-center justify-between">
          <Pressable
            disabled={!canPrev}
            onPress={onPrev}
            className={`px-4 py-2 rounded-xl ${canPrev ? "bg-white border border-gray-300" : "bg-gray-100 opacity-60"}`}
          >
            <Text className="font-medium">Prev</Text>
          </Pressable>

          <Text className="text-gray-700">
            Page <Text className="font-semibold">{page}</Text> of{" "}
            <Text className="font-semibold">{totalPages}</Text>
          </Text>

          <Pressable
            disabled={!canNext}
            onPress={onNext}
            className={`px-4 py-2 rounded-xl ${canNext ? "bg-white border border-gray-300" : "bg-gray-100 opacity-60"}`}
          >
            <Text className="font-medium">Next</Text>
          </Pressable>
        </View>

        {/* Row 2: Jump to page */}
        <View className="flex-row items-center justify-center gap-2 mt-3">
          <Text className="text-gray-700">Jump to</Text>
          <TextInput
            value={input}
            onChangeText={(t) => setInput(t.replace(/[^0-9]/g, ""))}
            keyboardType="number-pad"
            returnKeyType="done"
            onSubmitEditing={commitJump}
            className="px-3 py-2 rounded-xl bg-white border border-gray-300 min-w-[72px] text-center"
            placeholder="1"
            maxLength={5}
          />
          <Pressable
            onPress={commitJump}
            className="px-4 py-2 rounded-xl bg-white border border-gray-300"
          >
            <Text className="font-medium">Go</Text>
          </Pressable>
        </View>
      </View>

      {!!total && (
        <Text className="text-center text-gray-500 mt-2">
          Showing {showingFrom ?? 0}–{showingTo ?? 0} of {total}
        </Text>
      )}
    </View>
  );
}
