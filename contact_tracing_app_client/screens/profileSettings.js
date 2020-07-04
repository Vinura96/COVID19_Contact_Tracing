import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';

import Card from '../shared/card';
import database from '@react-native-firebase/database';

import {Context} from '../backend/context';

export default function ProfileSettings({navigation, route}) {
  const {
    setAppLoading,
    uid,
    phone,
    name,
    address,
    setAddress,
    setName,
    formatedBlutoothID,
  } = React.useContext(Context);

  const [nameEdit, setNameEdit] = React.useState(name);
  const [addressEdit, setAddressEdit] = React.useState(address);
  const [isnameEdit, setISNameEdit] = React.useState(false);
  const [isaddressEdit, setISAddressEdit] = React.useState(false);

  const updateAddress = () => {
    if (isaddressEdit) {
      setAppLoading(true);
      database()
        .ref('/users/' + uid)
        .update({
          address: addressEdit,
        })
        .then(function (val) {
          setAppLoading(false);
          setAddress(addressEdit);
          setISAddressEdit(false);
        })
        .catch((err) => {
          setAppLoading(false);
          console.log(err);
        });
    } else {
      setISAddressEdit(true);
    }
  };
  const updateName = () => {
    if (isnameEdit) {
      setAppLoading(true);
      database()
        .ref('/users/' + uid)
        .update({
          name: nameEdit,
        })
        .then(function (val) {
          setAppLoading(false);
          setName(nameEdit);
          setISNameEdit(false);
        })
        .catch((err) => {
          setAppLoading(false);
          console.log(err);
        });
    } else {
      setISNameEdit(true);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{marginVertical: 20, marginHorizontal: 10, flex: 1}}>
          <Text style={styles.titleText}>ID</Text>
          <TextInput
            style={styles.input}
            placeholder={formatedBlutoothID}
            placeholderTextColor="gray"
            editable={false}
          />
          <Text style={styles.titleText}>Phone</Text>
          <View style={{flexDirection: 'row'}}>
            <TextInput
              editable={false}
              style={{...styles.input, ...{flex: 2}}}
              placeholder={phone}
              placeholderTextColor="gray"
            />
          </View>
          <Text style={styles.titleText}>Name</Text>
          <View style={{flexDirection: 'row'}}>
            <TextInput
              style={{...styles.input, ...{flex: 2}}}
              placeholder={name}
              value={isnameEdit ? nameEdit : ''}
              editable={isnameEdit}
              placeholderTextColor="gray"
              onChangeText={(text) => setNameEdit(text)}
            />
            <TouchableOpacity
              disabled={isnameEdit && nameEdit.length < 3}
              style={styles.updateButton}
              onPress={(Keyboard.dismiss, updateName)}>
              <Card
                styleContent={{marginHorizontal: 5, marginVertical: 5}}
                style={styles.updatebtnCard}>
                <Text style={styles.updateBtnText}>
                  {isnameEdit ? 'Update' : 'Edit'}
                </Text>
              </Card>
            </TouchableOpacity>
          </View>
          <Text style={styles.titleText}>Address</Text>
          <View style={{flexDirection: 'row'}}>
            <TextInput
              style={{...styles.input, ...{flex: 2}}}
              placeholder={address}
              placeholderTextColor="gray"
              value={isaddressEdit ? addressEdit : ''}
              multiline={true}
              height={100}
              editable={isaddressEdit}
              maxLength={250}
              onChangeText={(text) => setAddressEdit(text)}
            />
            <TouchableOpacity
              disabled={isaddressEdit && addressEdit.length < 3}
              style={styles.updateButton}
              onPress={(Keyboard.dismiss, updateAddress)}>
              <Card
                styleContent={{marginHorizontal: 5, marginVertical: 5}}
                style={styles.updatebtnCard}>
                <Text style={styles.updateBtnText}>
                  {isaddressEdit ? 'Update' : 'Edit'}
                </Text>
              </Card>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 5,
    paddingTop: 10,
    marginBottom: 10,
  },
  titleText: {
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
  updateButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  updatebtnCard: {
    backgroundColor: '#3D6DCC',
    alignItems: 'center',
    width: '80%',
  },
  updateBtnText: {
    fontSize: 18,
    textAlignVertical: 'center',
    fontFamily: 'nunito-bold',
    color: 'white',
  },
});
