import React from 'react';
import {StyleSheet, TouchableOpacity, Text, View} from 'react-native';

export default function FlatButton({text, onPress, style}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <Text style={styles.buttonText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingHorizontal: 5,
    backgroundColor: 'gray',
    width: 150,
    height: 45,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'nunito-bold',
  },
});
