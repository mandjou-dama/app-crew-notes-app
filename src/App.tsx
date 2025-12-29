import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from '@/navigation/RootNavigator';
import { useAuth } from '@/hooks/use-auth';
import { View } from 'react-native';

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

  if (!isHydrated) {
      return (
          <View style={{ flex: 1, backgroundColor: '#fff' }} />
      );
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
