import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import Settings from '../screens/settings';
import React from 'react';
import ProfileSettings from '../screens/profileSettings';
import FAQ from '../screens/faq';
import About from '../screens/about';
import TermsAndConditions from '../screens/termsAndConditions';
import PrivacyPolicy from '../screens/privacyPolicy';

const Stack = createStackNavigator();

export default function SettingsStack() {
  return (
    <Stack.Navigator
      initialRouteName="Settings"
      screenOptions={{
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: 'bold',
        },
        headerStyle: {
          backgroundColor: '#3D6DCC',
          height: 50,
        },
        headerTitleAlign: 'center',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}>
      <Stack.Screen
        name="ProfileSettings"
        component={ProfileSettings}
        options={{
          title: 'Profile Settings',
        }}
      />

      <Stack.Screen
        name="TermsAndConditions"
        component={TermsAndConditions}
        options={{title: 'Terms And Conditions'}}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicy}
        options={{title: 'Privacy Policy'}}
      />
      <Stack.Screen name="FAQ" component={FAQ} options={{title: 'FAQ'}} />
      <Stack.Screen name="About" component={About} options={{title: 'About'}} />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{title: 'Settings'}}
      />
    </Stack.Navigator>
  );
}
