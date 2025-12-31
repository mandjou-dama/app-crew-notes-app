import { type FC } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { LucideIcon } from "lucide-react-native";
import { COLORS } from "@/constant";

interface ToolbarButtonIconProps {
  text?: never;
  icon: LucideIcon;
  isActive: boolean;
  onPress: () => void;
}

interface ToolbarButtonTextProps {
  text: string;
  icon?: never;
  isActive: boolean;
  onPress: () => void;
}

export type ToolbarButtonProps =
  | ToolbarButtonIconProps
  | ToolbarButtonTextProps;

export const ToolbarButton: FC<ToolbarButtonProps> = ({
  icon: Icon,
  text,
  isActive,
  onPress,
}) => {
  return (
    <Pressable
      style={[styles.container, isActive && styles.containerActive]}
      onPress={onPress}
    >
      {Icon ? (
        <Icon
          size={20}
          color={isActive ? COLORS.black : COLORS.white}
          strokeWidth={2}
        />
      ) : (
        <Text style={styles.text}>{text}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: 56,
    height: 56,
    backgroundColor: COLORS.black,
  },
  containerActive: {
    backgroundColor: COLORS.white,
    borderRadius: 13,
    borderCurve: "continuous",
  },
  text: {
    color: "white",
    fontSize: 20,
  },
});
