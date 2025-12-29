
import React from 'react';
import { useAuthStore } from '@/store/auth.store';
import { AuthNavigator } from './AuthNavigator';
import { AppNavigator } from './AppNavigator';
import { enableScreens } from 'react-native-screens';

enableScreens();

export function RootNavigator() {
  const { session } = useAuthStore();
  
  return session ? <AppNavigator /> : <AuthNavigator />;
}
