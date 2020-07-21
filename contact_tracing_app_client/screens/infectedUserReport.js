import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  CheckBox,
  Platform,
  TextInput,
  TouchableOpacity,
} from 'react-native';

var platform = Platform.OS === 'ios' ? 40 : 3;

import Modal from 'react-native-modal';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {Context} from '../backend/context';
import Card from '../shared/card';

export default function InfectedUserReportModal({
  isInfectedUserModalOpen,
  setInfectedUserModalOpen,
}) {
  const [checkBoxselected, setCheckbox] = useState(false);
  const {
    phone,
    name,
    address,
    uploadContactedPersonHistory,
    reportAsInfected,
  } = React.useContext(Context);
  return (
    <Modal
      style={styles.modal}
      isVisible={isInfectedUserModalOpen}
      onModalHide={() => {
        setInfectedUserModalOpen(false);
      }}
      backdropOpacity={0.1}
      backdropColor="white"
      onSwipeComplete={() => {
        setInfectedUserModalOpen(false);
      }}
      swipeThreshold={200}
      swipeDirection="down">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.modalContent}>
          <MaterialIcons
            name="close"
            size={24}
            style={styles.modalClose}
            onPress={() => setInfectedUserModalOpen(false)}
          />
          <Text style={{...styles.titleText, marginBottom: 20, marginTop: 20}}>
            Report As Infected Person
          </Text>
          <ScrollView
            style={styles.modalScroll}
            contentContainerStyle={{alignItems: 'center'}}
            keyboardShouldPersistTaps="handled">
            <View style={{width: '100%', marginBottom: 10}}>
              <Text style={styles.inputtitleText}> Personal Details</Text>
              <Card>
                <View>
                  <Text>{name}</Text>
                  <Text>{address}</Text>
                  <Text>{phone}</Text>
                </View>
              </Card>
            </View>
            {false && (
              <View style={{width: '100%', marginBottom: 10}}>
                <Text style={styles.inputtitleText}>National ID number</Text>
                <TextInput
                  style={styles.input}
                  placeholder={'961234567v'}
                  placeholderTextColor="gray"
                />
              </View>
            )}
            <View style={{width: '100%', marginBottom: 5}}>
              <View style={{marginVertical: 10, flexDirection: 'row'}}>
                <CheckBox
                  value={checkBoxselected}
                  onValueChange={setCheckbox}
                />
                <Text style={{fontSize: 16, paddingHorizontal: 20}}>
                  I confirmed that all above details are correct.
                </Text>
              </View>
            </View>
            {checkBoxselected && (
              <View style={{width: '100%', marginBottom: 5}}>
                <View style={{marginVertical: 10}}>
                  <Text style={{...styles.bodyText, color: 'gray'}}>
                    ** Your last 14 days contact history will be uploaded.
                  </Text>
                </View>
              </View>
            )}

            <View style={{marginBottom: 50, marginTop: 20}}>
              <View>
                <TouchableOpacity
                  disabled={!checkBoxselected}
                  onPress={() => {
                    uploadContactedPersonHistory();
                    reportAsInfected();
                    setInfectedUserModalOpen(false);
                  }}
                  style={
                    checkBoxselected
                      ? styles.uploadbtn
                      : styles.uploadbtnDisabled
                  }>
                  <Text
                    style={{
                      paddingHorizontal: 20,
                      fontSize: 18,
                      color: 'white',
                    }}>
                    Confirm
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  titleText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#333',
  },
  inputtitleText: {
    fontFamily: 'nunito-bold',
    fontSize: 18,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    fontSize: 18,
    borderRadius: 6,
    width: '100%',
    color: 'black',
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  notificationCard: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationCardView: {
    flex: 1,
    alignItems: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationCardDate: {
    textAlignVertical: 'center',
    fontFamily: 'nunito-regular',
    fontSize: 10,
    color: '#333',
    marginTop: 10,
  },
  modalClose: {
    margin: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 6,
    borderRadius: 10,
    alignSelf: 'center',
    alignItems: 'center',
    paddingLeft: 8,
    paddingBottom: 4,
  },
  modalContent: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: platform,
    alignItems: 'center',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    width: '100%',
    paddingTop: 20,
  },
  modal: {margin: 0, padding: 0},
  modalScroll: {
    width: '100%',
    paddingHorizontal: 30,
    paddingBottom: 50,
  },
  uploadbtn: {
    backgroundColor: '#3D6DCC',
    borderRadius: 5,
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignContent: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  uploadbtnDisabled: {
    backgroundColor: '#aec2ea',
    borderRadius: 5,
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignContent: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  numberBox: {
    width: '40%',
    textAlign: 'center',
    padding: 10,
    backgroundColor: '#e6e6e6',
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
    alignItems: 'center',
  },

  listTitle: {width: '30%', textAlignVertical: 'center'},
  bodyText: {width: '90%', fontSize: 16},
});
