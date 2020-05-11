import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';

export default function History({navigation}) {
  return (
    <View style={styles.container}>
      <Text>History</Text>
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
