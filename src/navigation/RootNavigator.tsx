import React from "react";
import { useAuthStore } from "@/store/auth.store";
import { AuthNavigator } from "./AuthNavigator";
import { AppNavigator } from "./AppNavigator";
import { enableScreens } from "react-native-screens";
import { StatusBar } from "react-native";

enableScreens();

export function RootNavigator() {
  const { session } = useAuthStore();

  StatusBar.setBarStyle("dark-content");

  return session ? <AppNavigator /> : <AuthNavigator />;
}
