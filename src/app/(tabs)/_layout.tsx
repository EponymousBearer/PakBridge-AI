import { Tabs } from 'expo-router';
import { COLORS } from '@/constants/theme';
import { Shield, MessageSquare, LayoutDashboard, Map as MapIcon } from 'lucide-react-native';
import { useEffect } from 'react';
import { useCrisisStore } from '@/store/crisisStore';

export default function TabLayout() {
  const initializeStore = useCrisisStore(state => state.initializeStore);

  useEffect(() => {
    const unsubscribe = initializeStore();
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0f131f', // Match Deep Navy base
          borderTopColor: '#262a37',   // Surface container high border
          elevation: 8,
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
        },
        tabBarActiveTintColor: '#00f1fe', // Neon Cyan for selected
        tabBarInactiveTintColor: '#8e90a2', // Outline for unselected
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        }
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Shield color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'AI Chat',
          tabBarIcon: ({ color }) => <MessageSquare color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <LayoutDashboard color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Live Map',
          tabBarIcon: ({ color }) => <MapIcon color={color} size={22} />,
        }}
      />
    </Tabs>
  );
}
