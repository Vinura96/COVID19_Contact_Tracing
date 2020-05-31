import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Modal,
  ActivityIndicator,
} from 'react-native';

import {Context} from '../backend/context';

export default function Splash() {
  const {isLoadingApp, startingApp, isLoggedIn} = React.useContext(Context);
  return (
    <Modal
      visible={isLoadingApp || startingApp}
      animationType="fade"
      transparent={true}>
      <SafeAreaView style={styles.modalContent}>
        <View style={styles.box}>
          <ActivityIndicator size="large" color="black" />
        </View>
      </SafeAreaView>
    </Modal>
  );
}
const styles = StyleSheet.create({
  modalClose: {
    marginTop: 20,
    marginBottom: 0,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  box: {
    // backgroundColor: "white",
    margin: 50,
    opacity: 1,
    paddingHorizontal: 50,
    paddingVertical: 40,
  },
  titleText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#333',
    fontFamily: 'nunito-bold',
    marginBottom: 20,
  },
});
