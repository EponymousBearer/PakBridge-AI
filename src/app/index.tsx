import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Cpu } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut, SlideInDown } from 'react-native-reanimated';
import { useAuthStore } from '@/store/authStore';

export default function SplashScreen() {
  const [statusText, setStatusText] = useState('Syncing Neural Matrix...');
  const { isRegistered, isLoading, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
    
    const states = [
      'Establishing Secure Satellite Link...',
      'Spinning up Retrieval Sub-Agents...',
      'Checking regional sensor telemetry...',
      'PakBridge AI Command Center Ready.'
    ];
    
    let current = 0;
    const interval = setInterval(() => {
      if (current < states.length) {
        setStatusText(states[current]);
        current++;
      }
    }, 600);

    // Wait for at least 2.8s AND auth to finish loading
    const timer = setTimeout(() => {
      if (!isLoading) {
        if (isRegistered) {
          router.replace('/(tabs)/home');
        } else {
          router.replace('/onboarding');
        }
      }
    }, 2800);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [isLoading, isRegistered]);

  return (
    <View className="flex-1 items-center justify-center bg-surface-container-lowest">
      {/* Decorative backdrop glow */}
      <View className="absolute w-72 h-72 bg-primary-container/10 rounded-full blur-3xl" />
      
      <Animated.View 
        entering={FadeIn.duration(1000)} 
        exiting={FadeOut.duration(500)}
        className="items-center"
      >
        <View className="w-24 h-24 rounded-2xl bg-surface-container border border-white/10 items-center justify-center mb-6 shadow-xl relative">
          <Cpu color="#00f1fe" size={44} />
          {/* Active green radar pulse */}
          <View className="absolute -top-1 -right-1 w-3 h-3 bg-secondary-container rounded-full border-2 border-surface-container-lowest" />
        </View>

        <Animated.Text 
          entering={SlideInDown.delay(300).springify()}
          className="text-3xl font-extrabold text-on-surface tracking-tight"
        >
          PAKBRIDGE AI
        </Animated.Text>
        
        <Animated.Text 
          entering={SlideInDown.delay(500).springify()}
          className="text-secondary-container text-xs font-semibold uppercase tracking-widest mt-1"
        >
          Crisis Intelligence Hub
        </Animated.Text>

        <View className="h-16 justify-center items-center mt-12">
          <ActivityIndicator color="#00f1fe" size="small" />
          <Text className="text-xs text-on-surface-variant font-medium mt-3 tracking-wider">
            {statusText}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}
