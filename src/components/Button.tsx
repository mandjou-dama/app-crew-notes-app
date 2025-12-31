import { LucideIcon } from "lucide-react-native";
import React, { memo } from "react";
import {
  Text,
  StyleSheet,
  Pressable,
  PressableProps,
  GestureResponderEvent,
} from "react-native";
import { Spinner } from "./Spinner";
import { useHaptics } from "@/hooks/use-haptics";
import { COLORS, SPACES } from "@/constant";

interface Props extends PressableProps {
  title: string;
  icon?: LucideIcon;
  isLoading?: boolean;
  isLight?: boolean;
}

const Button = ({
  title,
  icon: Icon,
  onPress,
  disabled = true,
  isLoading,
  isLight = false,
}: Props) => {
  const { impact } = useHaptics();

  const handlePress = (event: GestureResponderEvent) => {
    onPress?.(event);
    impact("light");
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={[
        styles.container,
        disabled && styles.disabled,
        isLight && styles.light,
      ]}
    >
      {isLoading && <Spinner color={COLORS.white} size={18} />}
      <Text style={[styles.text, isLight && styles.lightText]}>
        {isLoading ? "Loading..." : title}
      </Text>
      {Icon && <Icon size={18} color={COLORS.white} strokeWidth={2} />}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    backgroundColor: COLORS.black,
    borderRadius: 13,
    borderCurve: "continuous",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: SPACES.x,
  },
  light: {
    backgroundColor: COLORS.background,
  },
  text: {
    color: COLORS.background,
    fontSize: 16,
  },
  lightText: {
    color: COLORS.black,
  },
  disabled: {
    opacity: 0.6,
  },
});

export default memo(Button);
