import React, {useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Switch} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

import Card from '../shared/card';

export default function Settings(props) {
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => console.log('send as infected')}>
        <Card styleContent={styles.cardStyleContent}>
          <Text style={styles.cardText}>Iam Infected</Text>
        </Card>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => console.log('Log Out')}>
        <Card style={styles.logOutbtn}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </Card>
      </TouchableOpacity>
    </ScrollView>
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
  cardStyleContent: {
    paddingVertical: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cardText: {
    textAlignVertical: 'center',
    fontFamily: 'nunito-bold',
    fontSize: 20,
    color: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    textAlignVertical: 'center',
    fontFamily: 'nunito-bold',
    fontSize: 20,
    color: 'white',
  },
  logOutbtn: {
    paddingVertical: 5,
    backgroundColor: '#b30000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
