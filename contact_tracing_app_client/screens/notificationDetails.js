import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  Platform,
  TouchableOpacity,
} from 'react-native';

var platform = Platform.OS === 'ios' ? 40 : 3;

import Modal from 'react-native-modal';
import Entypo from 'react-native-vector-icons/Entypo';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Card from '../shared/card';

export default function NotificationModal({
  notification,
  isNotificationModalOpen,
  setNotificationModalOpen,
}) {
  return (
    <Modal
      style={styles.modal}
      isVisible={isNotificationModalOpen}
      onModalHide={() => {
        setNotificationModalOpen(false);
      }}
      backdropOpacity={0.1}
      backdropColor="white"
      onSwipeComplete={() => {
        setNotificationModalOpen(false);
      }}
      swipeThreshold={200}
      swipeDirection="down">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.modalContent}>
          <MaterialIcons
            name="close"
            size={24}
            style={styles.modalClose}
            onPress={() => setNotificationModalOpen(false)}
          />
          <ScrollView
            style={styles.modalScroll}
            contentContainerStyle={{alignItems: 'center'}}
            keyboardShouldPersistTaps="handled">
            <View style={{width: '100%', marginBottom: 10}}>
              <Card>
                <View>
                  <Text style={{textAlign: 'justify'}}>
                    <Text>
                      <Entypo name="warning" size={18} color="#ffcc00" />
                    </Text>
                    <Text> You have expose to a corona infected person.</Text>
                  </Text>
                </View>
                <View style={styles.notificationCard}>
                  <View style={styles.notificationCardView}>
                    <Text style={styles.notificationCardDate}>
                      2020/10/10 | 11:10:40
                    </Text>
                  </View>
                </View>
              </Card>
            </View>
            <View style={{width: '100%', marginBottom: 10}}>
              <View style={styles.listItem}>
                <Text style={styles.listTitle}>Date</Text>
                <Text style={styles.numberBox}>05/05/2020</Text>
              </View>
              <View style={styles.listItem}>
                <Text style={styles.listTitle}>Time</Text>
                <Text style={styles.numberBox}>10:32 AM</Text>
              </View>
            </View>
            <View style={{width: '100%', marginBottom: 5}}>
              <View style={styles.listItem}>
                <Text style={styles.bodyText}>
                  Please be safe and stay at home until responsible person
                  contact you.
                </Text>
              </View>
              <View style={{...styles.listItem, marginTop: 50}}>
                <Text style={styles.bodyText}>
                  ** Please send us your current location.
                </Text>
              </View>
            </View>

            <View style={{marginBottom: 50}}>
              <View>
                <TouchableOpacity style={styles.uploadbtn}>
                  <Text
                    style={{
                      paddingHorizontal: 20,
                      fontSize: 18,
                      color: 'white',
                    }}>
                    Send My Location
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
