
import { initializeApp, getApp, getApps } from 'firebase/app';
import {
  initializeAuth,
  getAuth,
} from 'firebase/auth';

// @ts-expect-error Firebase v12 React Native export typing issue
import { getReactNativePersistence } from 'firebase/auth';

import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCT6EEO9PbmRX4e7kc93AsU2XwBI1S25Yk',
  authDomain: 'dhunn-a95be.firebaseapp.com',
  projectId: 'dhunn-a95be',
  storageBucket: 'dhunn-a9S5be.firebasestorage.app',
  messagingSenderId: '44400814165',
  appId: '1:44400814165:web:260249dd53e0d0d35a8cdc',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = (() => {
  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    return getAuth(app);
  }
})();

export default app;
