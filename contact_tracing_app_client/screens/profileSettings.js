import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import Card from '../shared/card';
import database from '@react-native-firebase/database';

import {Context} from '../backend/context';

export default function ProfileSettings({navigation, route}) {
  const [value, onChangeText] = React.useState(null);
  const {
    isLoggedIn,

    uid,
    phone,
    name,
    address,
  } = React.useContext(Context);

  const updateName = () => {};

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{marginVertical: 20, marginHorizontal: 10, flex: 1}}>
          <Text style={styles.titleText}>ID</Text>
          <TextInput
            style={styles.input}
            placeholder={uid}
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
              placeholderTextColor="gray"
              onChangeText={(text) => onChangeText(text)}
            />
            <TouchableOpacity
              style={styles.updateButton}
              onPress={(Keyboard.dismiss, updateName)}>
              <Card
                styleContent={{marginHorizontal: 5, marginVertical: 5}}
                style={styles.updatebtnCard}>
                <Text style={styles.updateBtnText}>Edit</Text>
              </Card>
            </TouchableOpacity>
          </View>
          <Text style={styles.titleText}>Address</Text>
          <View style={{flexDirection: 'row'}}>
            <TextInput
              style={{...styles.input, ...{flex: 2}}}
              placeholder={address}
              placeholderTextColor="gray"
              multiline={true}
              height={100}
              maxLength={250}
              onChangeText={(text) => onChangeText(text)}
            />
            <TouchableOpacity
              style={styles.updateButton}
              onPress={(Keyboard.dismiss, updateName)}>
              <Card
                styleContent={{marginHorizontal: 5, marginVertical: 5}}
                style={styles.updatebtnCard}>
                <Text style={styles.updateBtnText}>Edit</Text>
              </Card>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
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
    backgroundColor: 'gray',
    alignItems: 'center',
    width: '80%',
  },
  updateBtnText: {
    fontSize: 18,
    textAlignVertical: 'center',
    fontFamily: 'nunito-bold',
  },
});
