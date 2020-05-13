import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
import Card from '../shared/card';

import Entypo from 'react-native-vector-icons/Entypo';

export default function Notifications() {
  const [notifications, setNotifications] = useState([
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
  ]);
  return (
    <View style={styles.container}>
      <Text style={{fontWeight: 'bold', fontSize: 20, padding: 10}}>
        Notifications
      </Text>
      <View>
        <FlatList
          data={notifications}
          renderItem={({item}) => {
            return (
              <Card>
                <TouchableOpacity>
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
                </TouchableOpacity>
              </Card>
            );
          }}
        />
      </View>
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
});
