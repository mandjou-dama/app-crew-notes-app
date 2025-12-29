import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';

import { Home } from '../screens/Home';

const Stack = createNativeStackNavigator();


export function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
}
