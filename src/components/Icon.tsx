import { LucideIcon } from "lucide-react-native";
import { memo, type FC } from "react";

export interface IconProps {
  icon: LucideIcon;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

const BaseIcon: FC<IconProps> = ({
  icon: Icon,
  size = 24,
  color = "black",
  strokeWidth = 2,
}) => {
  return <Icon size={size} color={color} strokeWidth={strokeWidth} />;
};

export const Icon = memo(BaseIcon);
