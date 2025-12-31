import React, { useEffect } from "react";
import { AppStateStatus, Platform, View } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import {
  focusManager,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useAuth } from "@/hooks/use-auth";
import { RootNavigator } from "@/navigation/RootNavigator";

import { COLORS } from "@/constant";
import { useOnlineManager } from "@/hooks/use-online-manager";
import { useAppState } from "./hooks/use-app-state";

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const { isHydrated } = useAuth();
  useOnlineManager();
  useAppState(onAppStateChange);

  if (!isHydrated) {
    return <View style={{ flex: 1, backgroundColor: COLORS.background }} />;
  }

  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}

export function App() {
  return (
    <SafeAreaProvider>
      <KeyboardProvider>
        <QueryClientProvider client={queryClient}>
          <AppContent />
        </QueryClientProvider>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}
