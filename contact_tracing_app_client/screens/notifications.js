import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
import Card from '../shared/card';
import NotificationModal from './notificationDetails';

import {Header} from 'react-native-elements';
import Entypo from 'react-native-vector-icons/Entypo';

import {Context} from '../backend/context';
import database from '@react-native-firebase/database';

export default function Notifications() {
  const {isLoggedIn, uid, notifications} = React.useContext(Context);
  const [isNotificationModalOpen, setNotificationModalOpen] = useState(false);
  const [notificationsOrdered, setNotificationOrderd] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  function compare(a, b) {
    if (a.createdAt < b.createdAt) {
      return 1;
    }
    if (a.createdAt > b.createdAt) {
      return -1;
    }
    return 0;
  }
  useEffect(() => {
    var data = notifications.sort(compare);
    setNotificationOrderd(data);
  }, [notifications]);

  const handleRead = (item) => {
    if (isLoggedIn && !item.isRead) {
      database()
        .ref('users/' + uid + '/notifications/' + item.key)
        .update({
          ...item,
          isRead: true,
        });
    }
  };

  return (
    <React.Fragment>
      <Header
        centerComponent={{
          text: 'Notifications',
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
        {selectedNotification && (
          <NotificationModal
            notification={selectedNotification}
            isNotificationModalOpen={isNotificationModalOpen}
            setNotificationModalOpen={setNotificationModalOpen}
          />
        )}

        <View>
          <FlatList
            data={notificationsOrdered}
            renderItem={({item}) => {
              var d = new Date(item.createdAt);
              var date =
                d.toLocaleDateString() + ' | ' + d.toLocaleTimeString();
              return (
                <Card>
                  <TouchableOpacity
                    onPress={() => {
                      handleRead(item);
                      setSelectedNotification(item);
                      setNotificationModalOpen(true);
                    }}>
                    <View>
                      <Text style={{textAlign: 'justify'}}>
                        {!item.isRead && (
                          <Text>
                            <Entypo name="warning" size={18} color="#ffcc00" />
                          </Text>
                        )}
                        <Text> {item.title}</Text>
                      </Text>
                    </View>
                    <View style={styles.notificationCard}>
                      <View style={styles.notificationCardView}>
                        <Text style={styles.notificationCardDate}>{date}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Card>
              );
            }}
          />
        </View>
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
    marginBottom: 10,
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
