import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';

export default function Notifications() {
  return (
    <View style={styles.container}>
      <Text>Notifications</Text>
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
