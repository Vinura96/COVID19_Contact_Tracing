import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, {useEffect, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {Text, View} from 'react-native';
import Home from '../screens/home';
import History from '../screens/history';
import Notifications from '../screens/notifications';
import SettingsStack from './settingsStack';

const Tab = createBottomTabNavigator();

function IconWithBadge({name, badgeCount, color, size, group}) {
  return (
    <View style={{width: 24, height: 24, margin: 5}}>
      {group === 'Ionicons' ? (
        <Ionicons name={name} size={size * 1.12} color={color} />
      ) : (
        <AntDesign name={name} size={size} color={color} />
      )}

      {badgeCount > 0 && (
        <View
          style={{
            // On React Native < 0.57 overflow outside of parent will not work on Android, see https://git.io/fhLJ8
            position: 'absolute',
            right: -6,
            top: -3,
            backgroundColor: '#b30000',
            borderRadius: 6,
            width: 12,
            height: 12,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: 'white', fontSize: 10, fontWeight: 'bold'}}>
            {badgeCount}
          </Text>
        </View>
      )}
    </View>
  );
}

export default function RootBottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          if (route.name === 'Home') {
            return (
              <IconWithBadge
                group="AntDesign"
                name={'home'}
                size={size}
                color={color}
                badgeCount={0}
              />
            );
          } else if (route.name === 'History') {
            return (
              <IconWithBadge
                group="Ionicons"
                name={'ios-list'}
                size={size}
                color={color}
                badgeCount={0}
              />
            );
          } else if (route.name === 'Notifications') {
            return (
              <IconWithBadge
                group="AntDesign"
                name={'warning'}
                size={size}
                color={color}
                badgeCount={1}
              />
            );
          } else if (route.name === 'Settings') {
            return (
              <IconWithBadge
                group="AntDesign"
                name={'setting'}
                size={size}
                color={color}
                badgeCount={0}
              />
            );
          }
        },
      })}
      tabBarOptions={{
        activeTintColor: '#203e79',
        inactiveTintColor: '#7294da',
      }}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="History" component={History} />
      <Tab.Screen name="Notifications" component={Notifications} />
      <Tab.Screen name="Settings" component={SettingsStack} />
    </Tab.Navigator>
  );
}
