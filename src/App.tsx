import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function App() {
  return (
    <View style={styles.container}>
      <Text>App Ready</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
