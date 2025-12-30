import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const COLORS = {
  primary: "#007AFF",
  secondary: "#0056B3",

  white: "#FFFFFF",
  black: "#1E1E1E",

  background: "#F7EDC9",
  surface: "#FFFFFF",
  error: "#FF4D4F",
};

export const SPACES = {
  x: 4,
  xs: 8,
  s: 12,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,

  SCREEN_WIDTH: width,
  SCREEN_HEIGHT: height,
};

export const FONTS = {
  Satoshi: {
    Light: "Satoshi-Light",
    Regular: "Satoshi-Regular",
    Medium: "Satoshi-Medium",
    Bold: "Satoshi-Bold",
    Black: "Satoshi-Black",
  },
};
