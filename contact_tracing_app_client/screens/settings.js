import React, {useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Switch} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

import Card from '../shared/card';
import {Context} from '../backend/context';
import FlatButton from '../shared/button';

import Ionicons from 'react-native-vector-icons/Ionicons';
import InfectedUserReportModal from './infectedUserReport';

export default function Settings(props) {
  const {isLoggedIn, setLogout} = React.useContext(Context);
  const [isInfectedUserModalOpen, setInfectedUserModalOpen] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <InfectedUserReportModal
        isInfectedUserModalOpen={isInfectedUserModalOpen}
        setInfectedUserModalOpen={setInfectedUserModalOpen}
      />
      <View style={{marginBottom: 20}}>
        {isLoggedIn ? (
          <View style={{alignItems: 'center'}}>
            <Text>Logged in as</Text>
            <Text
              style={{
                fontSize: 18,
                color: '#333',
              }}>
              Kasun Sampath
            </Text>

            <Text style={{color: 'gray', fontSize: 12}}>+94761234567</Text>
          </View>
        ) : (
          <View style={{alignItems: 'center', marginTop: 20}}>
            <FlatButton text="Sign In" onPress={() => console.log('object')} />
          </View>
        )}
      </View>
      {isLoggedIn && (
        <View>
          <TouchableOpacity onPress={() => setInfectedUserModalOpen(true)}>
            <Card style={{...styles.logOutbtn, backgroundColor: 'orange'}}>
              <Text style={styles.logoutButtonText}>Iam Infected</Text>
            </Card>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              props.navigation.push('ProfileSettings', {
                name: 'ProfileSettings',
              })
            }>
            <Card styleContent={styles.cardStyleContent}>
              <Text style={styles.cardText}>Profile</Text>
              <View style={{marginRight: 15}}>
                <Ionicons name="ios-arrow-forward" size={25} color="black" />
              </View>
            </Card>
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity
        onPress={() =>
          props.navigation.push('TermsAndConditions', {
            name: 'TermsAndConditions',
          })
        }>
        <Card styleContent={styles.cardStyleContent}>
          <Text style={styles.cardText}>Terms and Conditions</Text>
          <View style={{marginRight: 15}}>
            <Ionicons name="ios-arrow-forward" size={25} color="black" />
          </View>
        </Card>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() =>
          props.navigation.push('PrivacyPolicy', {
            name: 'PrivacyPolicy',
          })
        }>
        <Card styleContent={styles.cardStyleContent}>
          <Text style={styles.cardText}>Privacy Policy</Text>
          <View style={{marginRight: 15}}>
            <Ionicons name="ios-arrow-forward" size={25} color="black" />
          </View>
        </Card>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() =>
          props.navigation.push('FAQ', {
            name: 'FAQ',
          })
        }>
        <Card styleContent={styles.cardStyleContent}>
          <Text style={styles.cardText}>FAQ</Text>
          <View style={{marginRight: 15}}>
            <Ionicons name="ios-arrow-forward" size={25} color="black" />
          </View>
        </Card>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() =>
          props.navigation.push('About', {
            name: 'About',
          })
        }>
        <Card styleContent={styles.cardStyleContent}>
          <Text style={styles.cardText}>About</Text>
          <View style={{marginRight: 15}}>
            <Ionicons name="ios-arrow-forward" size={25} color="black" />
          </View>
        </Card>
      </TouchableOpacity>
      {isLoggedIn && (
        <TouchableOpacity onPress={setLogout}>
          <Card style={{...styles.logOutbtn, marginBottom: 20}}>
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </Card>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 5,
    paddingTop: 10,
    // marginBottom: 10,
  },
  cardStyleContent: {
    paddingVertical: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
