import Constants, { ExecutionEnvironment } from 'expo-constants';
import * as Device from 'expo-device';
import { Platform, Alert } from 'react-native';
import { db } from './firebaseConfig';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';

const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

// Dynamically require expo-notifications only if not in Expo Go.
// This prevents side-effects in DevicePushTokenAutoRegistration from triggering SDK 53+ crashes on Expo Go.
let Notifications: any = null;
if (!isExpoGo) {
  try {
    Notifications = require('expo-notifications');
    
    // Configure how notifications are handled when the app is foregrounded
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  } catch (e) {
    console.error('Failed to load expo-notifications:', e);
  }
}

export async function registerForPushNotificationsAsync() {
  if (isExpoGo) {
    console.log('[NotificationService] Running in Expo Go. Skipping remote push notifications setup.');
    return null;
  }

  if (!Notifications) {
    console.log('[NotificationService] Notifications module not loaded.');
    return null;
  }

  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert('Permission Required', 'Failed to get push token for push notification!');
      return;
    }
    
    try {
      const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      console.log('Expo Push Token:', token);
    } catch (e) {
      console.log('Error getting push token:', e);
    }
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  return token;
}

export async function saveTokenToFirestore(userId: string, token: string) {
  if (!token) return;
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      pushTokens: arrayUnion(token)
    });
  } catch (e) {
    console.error('Error saving token to firestore:', e);
  }
}

export async function sendLocalNotification(title: string, body: string, data: any = {}) {
  if (isExpoGo || !Notifications) {
    console.log(`[Local Notification Mock] ${title}: ${body}`, data);
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
    },
    trigger: null, // show immediately
  });
}
