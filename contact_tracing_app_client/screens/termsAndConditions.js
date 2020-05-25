import React, {useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';

export default function TermsAndConditions({navigation, route}) {
  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 18,
          textAlign: 'justify',
          paddingHorizontal: 20,
          paddingTop: 20,
          fontWeight: 'bold',
        }}>
        Terms And Conditions.
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 5,
    paddingTop: 10,
    marginBottom: 50,
  },
});
