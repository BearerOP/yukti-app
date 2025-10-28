// App.tsx
import { NavigationContainer } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { PaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux';
import AppNavigator from './src/navigation/AppNavigator';
import socketService from './src/services/socket';
import { store } from './src/store/store';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const App = () => {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Try to connect socket when app starts
        // Will gracefully fail if backend is not available
        socketService.connect();
      } catch (e) {
        console.warn('Error preparing app:', e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <Provider store={store}>
      <PaperProvider>
        <NavigationContainer onReady={onLayoutRootView}>
          <StatusBar barStyle="light-content" />
          <AppNavigator />
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
};

export default App;