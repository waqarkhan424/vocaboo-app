import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  Text,
  View,
  type LayoutRectangle,
} from "react-native";

type Props = {
  value: number;
  onChange: (n: number) => void;
  options?: number[];
  /** Extra vertical space between trigger and menu (pixels). */
  menuOffsetY?: number;
};

const DEFAULTS = [10, 20, 30, 50];

const MENU_WIDTH = 160;
const SCREEN_PADDING = 8;

// row height estimate for the menu (used to compute fit)
const ROW_H = 40;

// base gap so the menu never covers the trigger (reduced a bit)
const BASE_GUTTER = 24;

export default function PerPagePicker({
  value,
  onChange,
  options = DEFAULTS,
  // small extra nudge that you can tweak per screen
  menuOffsetY = 12,
}: Props) {
  const [open, setOpen] = useState(false);

  // screen-anchored rect of the trigger
  const [anchor, setAnchor] = useState<LayoutRectangle | null>(null);
  const triggerRef = useRef<View>(null);

  // close dropdown when value changes
  useEffect(() => {
    if (open) setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const openMenu = () => {
    // Measure the trigger button position in the window
    triggerRef.current?.measureInWindow?.((x, y, width, height) => {
      setAnchor({ x, y, width, height });
      setOpen(true);
    });
  };

  // compute menu x/y within the screen
  const menuPos = (() => {
    if (!anchor) return { top: 0, left: 0 };

    const { width: sw, height: sh } = Dimensions.get("window");

    // Estimated menu height (rows + small padding)
    const menuH = options.length * ROW_H + 8;

    // Try to show BELOW the trigger with a visible gap (+ extra offset)
    const belowY = anchor.y + anchor.height + BASE_GUTTER + menuOffsetY;

    // If below would overflow the screen, FLIP ABOVE (also with a gap)
    const aboveY = Math.max(
      SCREEN_PADDING,
      anchor.y - menuH - BASE_GUTTER - menuOffsetY
    );

    const top = belowY + menuH > sh - SCREEN_PADDING ? aboveY : belowY;

    // Right-align to trigger, clamp within screen paddings
    const rightX = anchor.x + anchor.width;
    let left = Math.min(rightX - MENU_WIDTH, sw - SCREEN_PADDING - MENU_WIDTH);
    left = Math.max(SCREEN_PADDING, left);

    return { top, left };
  })();

  return (
    <View className="relative">
      {/* Trigger */}
      <Pressable
        ref={triggerRef}
        hitSlop={8}
        onPress={openMenu}
        className="flex-row items-center gap-2 px-3 py-2 rounded-xl border bg-white border-gray-300"
        accessibilityRole="button"
        accessibilityLabel="Change items per page"
      >
        <Text className="text-gray-700">{value} / page</Text>
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={16}
          color="#374151"
        />
      </Pressable>

      {/* Render dropdown in a Modal so it can receive touches anywhere */}
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        {/* Backdrop */}
        <Pressable
          onPress={() => setOpen(false)}
          style={{ position: "absolute", inset: 0 }}
          accessibilityLabel="Close menu"
          accessibilityRole="button"
        />

        {/* Menu */}
        <View
          style={{
            position: "absolute",
            top: menuPos.top,
            left: menuPos.left,
            width: MENU_WIDTH,
            // subtle elevation across platforms
            shadowColor: "#000",
            shadowOpacity: 0.12,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
            elevation: 8,
          }}
          className="rounded-xl border border-gray-200 bg-white"
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
                accessibilityRole="button"
                accessibilityLabel={`${n} per page`}
                accessibilityState={{ selected: active }}
              >
                <Text
                  className={
                    active ? "text-blue-700 font-semibold" : "text-gray-700"
                  }
                >
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
      </Modal>
    </View>
  );
}
