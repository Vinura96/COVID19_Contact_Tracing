import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Navigator from './routes/bottomTab';
import {ContextProvider} from './backend/context';

export default function App() {
  return (
    <ContextProvider>
      <NavigationContainer>
        <Navigator />
      </NavigationContainer>
    </ContextProvider>
  );
}
