import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Navigator from './routes/bottomTab';
import {ContextProvider} from './backend/context';
import {Header} from 'react-native-elements';

export default function App() {
  return (
    <ContextProvider>
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

      <NavigationContainer>
        <Navigator />
      </NavigationContainer>
    </ContextProvider>
  );
}
