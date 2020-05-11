import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

export default function Home({navigation}) {
  return (
    <View style={styles.container}>
      <Text>Home screen</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 5,
    paddingTop: 10,
  },
});
