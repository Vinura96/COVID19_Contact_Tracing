import React, {useState} from 'react';
import {StyleSheet, Text, View, Switch, TouchableOpacity} from 'react-native';
import Card from '../shared/card';
import {Header} from 'react-native-elements';
import {Context} from '../backend/context';

export default function Home({navigation}) {
  const {contactHistory, setTracking, isTrackingEnable} = React.useContext(
    Context,
  );
  return (
    <React.Fragment>
      <Header
        centerComponent={{
          text: 'Contact Tracker',
          style: {
            color: '#fff',
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 25,
          },
        }}
        containerStyle={{
          backgroundColor: '#3D6DCC',
          justifyContent: 'space-around',
          height: 50,
        }}
      />
      <View style={styles.container}>
        <Card>
          <View
            style={{
              alignContent: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              paddingVertical: 10,
            }}>
            <Switch
              trackColor={{false: '#b3b3b3', true: 'black'}}
              thumbColor={isTrackingEnable ? 'white' : 'white'}
              ios_backgroundColor="#f4f3f4"
              onValueChange={() => setTracking(!isTrackingEnable)}
              value={isTrackingEnable}
            />
            <TouchableOpacity onPress={() => setTracking(!isTrackingEnable)}>
              <Text
                style={
                  isTrackingEnable
                    ? {
                        textAlignVertical: 'center',
                        fontSize: 20,
                        fontWeight: 'bold',
                        paddingHorizontal: 20,
                        color: 'black',
                      }
                    : {
                        textAlignVertical: 'center',
                        fontSize: 20,
                        fontWeight: 'bold',
                        paddingHorizontal: 20,
                        color: 'gray',
                      }
                }>
                Start Tracking
              </Text>
            </TouchableOpacity>
          </View>
        </Card>
        <Card>
          <Text style={{fontWeight: 'bold', fontSize: 16, paddingVertical: 10}}>
            Contact Summary
          </Text>
          <View style={styles.listItem}>
            <Text style={styles.listTitle}>Today</Text>
            <Text style={styles.listCenter}>-</Text>
            <Text style={styles.numberBox}>{contactHistory.today}</Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listTitle}>Yesterday</Text>
            <Text style={styles.listCenter}>-</Text>
            <Text style={styles.numberBox}>{contactHistory.yesterday}</Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listTitle}>Last 3 days</Text>
            <Text style={styles.listCenter}>-</Text>
            <Text style={styles.numberBox}>{contactHistory.last3days}</Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listTitle}>Last 7 days</Text>
            <Text style={styles.listCenter}>-</Text>
            <Text style={styles.numberBox}>{contactHistory.last7days}</Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listTitle}>Last 14 days</Text>
            <Text style={styles.listCenter}>-</Text>
            <Text style={styles.numberBox}>{contactHistory.last14days}</Text>
          </View>
        </Card>
      </View>
    </React.Fragment>
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
  numberBox: {
    width: '40%',
    textAlign: 'center',
    padding: 10,
    backgroundColor: '#e6e6e6',
    borderRadius: 5,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  listCenter: {
    width: '10%',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  listTitle: {width: '50%', textAlignVertical: 'center'},
});
