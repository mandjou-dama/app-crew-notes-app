import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const COLORS = {
  primary: "#007AFF",
  secondary: "#0056B3",
  background: "#F5F5F5",
  surface: "#FFFFFF",
  error: "#FF4D4F",
};

export const SPACES = {
  x: width * 0.04,
  xs: width * 0.08,
  s: width * 0.12,
  m: width * 0.16,
  l: width * 0.24,
  xl: width * 0.32,
  xxl: width * 0.48,
  xxxl: width * 0.64,

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
