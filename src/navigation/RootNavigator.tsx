import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuthStore } from '@/store/auth.store';
import { AuthNavigator } from './AuthNavigator';
import { AppNavigator } from './AppNavigator';
import { enableScreens } from 'react-native-screens';

enableScreens();

export function RootNavigator() {
  const { session } = useAuthStore();
  const isAuthenticated = !!session;

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
