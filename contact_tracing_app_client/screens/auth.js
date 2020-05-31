import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  Button,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';

import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

import {Context} from '../backend/context';

export default function Auth() {
  const {
    isLoggedIn,
    isNewUser,
    uid,
    signOut,
    startingApp,
    updateUserData,
    user,
    authLoading,
    setAuthLoading,
  } = React.useContext(Context);

  const [confirm, setConfirm] = useState(null);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [authError, setAuthError] = useState('');

  async function signInWithPhoneNumber() {
    setAuthLoading(true);
    try {
      const confirmation = await auth().signInWithPhoneNumber(
        '+94' + phoneNumber,
      );
      setConfirm(confirmation);
      setAuthLoading(false);
    } catch (error) {
      console.log('Invalid phoneNumber.');
      setAuthError('Invalid Phone Number');
      setAuthLoading(false);
    }
  }

  const handlesubmit = () => {
    if (phoneNumber.length == 9) {
      signInWithPhoneNumber();
      setAuthError('');
    } else {
      setAuthError('Invalid Phone Number');
    }
  };

  const handleConfirmCode = () => {
    if (code.length == 6) {
      confirmCode();
      setAuthError('');
    } else {
      setAuthError('Invalid Code');
    }
  };

  const handleUploadPersonalData = () => {
    if (name.length > 2 && address.length > 2) {
      setAuthLoading(true);
      database()
        .ref('/users/' + uid)
        .set({
          address: address,
          name: name,
          created_at: Date.now(),
        })
        .then(function (snapshot) {
          updateUserData(user);
        });
      setAuthError('');
    } else {
      setAuthError('Invalid Name or address');
    }
  };

  async function confirmCode() {
    setAuthLoading(true);
    try {
      await confirm.confirm(code);
      setConfirm(null);
      setPhoneNumber('');
      setCode('');
      setAuthError('');
    } catch (error) {
      console.log('Invalid code.');
      setAuthLoading(false);
      setAuthError('Invalid Code');
    }
  }

  return (
    <Modal
      visible={!isLoggedIn && !startingApp}
      animationType="none"
      transparent={true}>
      <SafeAreaView style={styles.modalContent}>
        <View style={styles.box}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
              <Text style={styles.titleText}>Sign In</Text>
              {authError.length > 0 && (
                <Text
                  style={{
                    color: 'red',
                    textAlign: 'center',
                    marginHorizontal: 20,
                  }}>
                  {authError}
                </Text>
              )}
              {authLoading ? (
                <ActivityIndicator
                  animating={authLoading}
                  size="large"
                  style={{
                    margin: 60,
                    marginTop: 30,
                  }}
                />
              ) : uid && isNewUser ? (
                <React.Fragment>
                  <Text
                    style={{
                      fontSize: 16,
                      marginTop: 10,
                      fontWeight: 'bold',
                      textAlign: 'center',
                    }}>
                    New User SignIn
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      marginBottom: 10,
                      fontWeight: 'bold',
                      textAlign: 'center',
                    }}>
                    Additional details required.
                  </Text>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={{fontSize: 16, marginTop: 10, flex: 1}}>
                      Name
                    </Text>
                    {name.length < 3 && (
                      <Text
                        style={{
                          color: '#cc0000',
                          textAlign: 'right',
                          fontSize: 16,
                          marginTop: 10,
                          flex: 1,
                        }}>
                        Required
                      </Text>
                    )}
                  </View>

                  <TextInput
                    value={name}
                    placeholder="Name Surname"
                    onChangeText={(text) => setName(text)}
                    style={{
                      backgroundColor: '#c3d1ef',
                      paddingVertical: 5,
                      fontSize: 16,
                      borderRadius: 10,
                      paddingLeft: 10,
                    }}
                  />
                  <View style={{flexDirection: 'row'}}>
                    <Text style={{fontSize: 16, marginTop: 10}}>Address</Text>
                    {address.length < 3 && (
                      <Text
                        style={{
                          color: '#cc0000',
                          textAlign: 'right',
                          fontSize: 16,
                          marginTop: 10,
                          flex: 1,
                        }}>
                        Required
                      </Text>
                    )}
                  </View>
                  <TextInput
                    value={address}
                    multiline={true}
                    height={100}
                    onChangeText={(text) => setAddress(text)}
                    style={{
                      backgroundColor: '#c3d1ef',
                      paddingVertical: 5,
                      fontSize: 16,
                      borderRadius: 10,
                      textAlignVertical: 'top',
                      paddingLeft: 10,
                    }}
                  />
                  <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity
                      style={{...styles.Btn, backgroundColor: '#0b1528'}}
                      onPress={signOut}>
                      <Text style={styles.btnText}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.Btn}
                      onPress={handleUploadPersonalData}>
                      <Text style={styles.btnText}>Submit</Text>
                    </TouchableOpacity>
                  </View>
                </React.Fragment>
              ) : !confirm ? (
                <React.Fragment>
                  <Text style={{fontSize: 16, marginTop: 10}}>
                    Phone Number
                  </Text>
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={{
                        backgroundColor: '#c3d1ef',
                        paddingVertical: 5,
                        fontSize: 18,
                        paddingLeft: 10,
                        borderTopLeftRadius: 10,
                        borderBottomLeftRadius: 10,
                        textAlignVertical: 'center',
                      }}>
                      +94
                    </Text>
                    <TextInput
                      value={phoneNumber}
                      autoCompleteType="tel"
                      keyboardType="number-pad"
                      maxLength={9}
                      onChangeText={(text) => {
                        setPhoneNumber(text);
                        setAuthError('');
                      }}
                      placeholder="761234567"
                      style={{
                        backgroundColor: '#c3d1ef',
                        paddingVertical: 5,
                        fontSize: 18,
                        flex: 1,
                        borderBottomRightRadius: 10,
                        borderTopRightRadius: 10,
                      }}
                    />
                  </View>

                  <TouchableOpacity style={styles.Btn} onPress={handlesubmit}>
                    <Text style={styles.btnText}>SIGN IN</Text>
                  </TouchableOpacity>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Text style={{fontSize: 16, marginTop: 10}}>Code</Text>
                  <TextInput
                    value={code}
                    keyboardType="number-pad"
                    maxLength={6}
                    placeholder="000000"
                    onChangeText={(text) => setCode(text)}
                    style={{
                      backgroundColor: '#c3d1ef',
                      paddingVertical: 5,
                      fontSize: 20,
                      borderRadius: 10,
                      textAlign: 'center',
                    }}
                  />
                  <TouchableOpacity
                    style={styles.Btn}
                    onPress={handleConfirmCode}>
                    <Text style={styles.btnText}>Confirm Code</Text>
                  </TouchableOpacity>
                </React.Fragment>
              )}
            </View>
          </TouchableWithoutFeedback>
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
    paddingTop: 20,
    paddingHorizontal: 30,
    minWidth: 250,
  },
  Btn: {
    borderRadius: 20,
    backgroundColor: '#203e79',
    marginHorizontal: 20,
    marginVertical: 20,
    paddingVertical: 10,
    paddingHorizontal: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  btnText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 16,
    color: 'white',
  },
  titleText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: 'bold',
    fontSize: 24,
    color: 'black',
    marginBottom: 10,
  },
});
