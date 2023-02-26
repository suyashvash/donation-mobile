import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './screens/appIndex';
import { Provider } from 'react-redux';
import store from './src/app/store';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';

const Firebase = require('./firebase/config')

export default function App() {

  let persistor = persistStore(store);


  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor} >
        <NavigationContainer>
          <AppNavigator/>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
