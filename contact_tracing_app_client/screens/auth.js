import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

import {Context} from '../backend/context';

export default function Auth() {
  const {isLoggedIn, setLoggedIn} = React.useContext(Context);

  return (
    <Modal visible={!isLoggedIn} animationType="none" transparent={true}>
      <SafeAreaView style={styles.modalContent}>
        <View style={styles.box}>
          <View>
            <Text style={styles.titleText}>Sign In</Text>
            {
              //   authError.length > 0 && (
              //   <Text
              //     style={{
              //       color: 'red',
              //       textAlign: 'center',
              //       marginHorizontal: 20,
              //     }}>
              //     {authError}
              //   </Text>
              // )
            }
            <TouchableOpacity style={styles.Btn} onPress={setLoggedIn}>
              <Text style={styles.btnText}>SIGN IN</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    backgroundColor: 'rgba(212,226,255,0.9)',
  },
  box: {
    borderRadius: 15,
    backgroundColor: '#7294da',
    marginHorizontal: 20,
    padding: 20,
  },
  Btn: {
    borderRadius: 30,
    backgroundColor: '#203e79',
    marginHorizontal: 30,
    marginVertical: 20,
    paddingVertical: 20,
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  btnText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'nunito-bold',
    fontSize: 14,
    color: 'white',
    marginLeft: 10,
  },
  titleText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'nunito-bold',
    fontSize: 24,
    color: 'black',
    marginBottom: 10,
  },
});
