import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import '../global.css';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useAppStore } from '@/store/appStore';

import NotificationBanner from '@/components/NotificationBanner';

export default function RootLayout() {
  const scheme = useColorScheme();
  
  return (
    <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <NotificationBanner />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="workflow/[id]" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}
