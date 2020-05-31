import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Navigator from './routes/bottomTab';
import {ContextProvider} from './backend/context';
import Auth from './screens/auth';
import Splash from './screens/splash';

export default function App() {
  return (
    <ContextProvider>
      <Splash />
      <Auth />
      <NavigationContainer>
        <Navigator />
      </NavigationContainer>
    </ContextProvider>
  );
}
