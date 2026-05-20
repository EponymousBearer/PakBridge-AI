import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore, UserRole } from '@/store/authStore';
import { registerForPushNotificationsAsync } from '@/services/notificationService';
import { User, ShieldCheck, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp, Layout } from 'react-native-reanimated';

export default function OnboardingScreen() {
  const [name, setName] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [role, setRole] = useState<UserRole>('Citizen');
  const registerUser = useAuthStore((state) => state.registerUser);

  const handleRegister = async () => {
    if (!name || !neighborhood) return;
    
    // 1. Register User in Auth & Firestore
    await registerUser(name, role, neighborhood);
    
    // 2. Attempt to get Push Token
    const token = await registerForPushNotificationsAsync();
    if (token) {
      const user = useAuthStore.getState().user;
      if (user?.uid) {
        const { doc, updateDoc, arrayUnion } = await import('firebase/firestore');
        const { db } = await import('@/services/firebaseConfig');
        await updateDoc(doc(db, 'users', user.uid), {
          pushTokens: arrayUnion(token)
        });
      }
    }

    router.replace('/(tabs)/home');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-surface-container-lowest"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 px-6 pt-20 pb-10">
          
          <Animated.View entering={FadeInDown.duration(800)}>
            <Text className="text-4xl font-extrabold text-on-surface tracking-tighter">
              Welcome to{'\n'}
              <Text className="text-primary-container">PakBridge AI</Text>
            </Text>
            <Text className="text-on-surface-variant mt-3 text-base leading-relaxed">
              Help us personalize your emergency response matrix. Register your role and primary location.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).duration(800)} className="mt-10">
            <Text className="text-xs font-bold text-secondary-container uppercase tracking-widest mb-4">
              Select Your Profile Role
            </Text>
            
            <View className="flex-row space-x-4">
              <TouchableOpacity 
                onPress={() => setRole('Citizen')}
                activeOpacity={0.7}
                className={`flex-1 p-5 rounded-3xl border-2 items-center ${
                  role === 'Citizen' ? 'bg-primary-container/10 border-primary-container' : 'bg-surface-container border-transparent'
                }`}
              >
                <View className={`w-12 h-12 rounded-2xl items-center justify-center mb-3 ${
                  role === 'Citizen' ? 'bg-primary-container' : 'bg-surface-container-high'
                }`}>
                  <User color={role === 'Citizen' ? '#000' : '#8e918f'} size={24} />
                </View>
                <Text className={`font-bold ${role === 'Citizen' ? 'text-primary-container' : 'text-on-surface-variant'}`}>
                  Citizen
                </Text>
                {role === 'Citizen' && (
                  <View className="absolute top-3 right-3">
                    <CheckCircle2 size={16} color="#00f1fe" />
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => setRole('Authority')}
                activeOpacity={0.7}
                className={`flex-1 p-5 rounded-3xl border-2 items-center ${
                  role === 'Authority' ? 'bg-secondary-container/10 border-secondary-container' : 'bg-surface-container border-transparent'
                }`}
              >
                <View className={`w-12 h-12 rounded-2xl items-center justify-center mb-3 ${
                  role === 'Authority' ? 'bg-secondary-container' : 'bg-surface-container-high'
                }`}>
                  <ShieldCheck color={role === 'Authority' ? '#000' : '#8e918f'} size={24} />
                </View>
                <Text className={`font-bold ${role === 'Authority' ? 'text-secondary-container' : 'text-on-surface-variant'}`}>
                  Authority
                </Text>
                {role === 'Authority' && (
                  <View className="absolute top-3 right-3">
                    <CheckCircle2 size={16} color="#92f7bc" />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400).duration(800)} className="mt-10 space-y-6">
            <View>
              <Text className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 ml-1">
                {role === 'Citizen' ? 'Full Name' : 'Officer Name / Badge ID'}
              </Text>
              <View className="bg-surface-container rounded-2xl flex-row items-center px-4 py-4 border border-white/5">
                <User size={20} color="#8e918f" />
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name..."
                  placeholderTextColor="#8e918f"
                  className="flex-1 ml-3 text-on-surface text-base font-medium"
                />
              </View>
            </View>

            <View>
              <Text className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 ml-1">
                {role === 'Citizen' ? 'Home Neighborhood' : 'Base/Station Office'}
              </Text>
              <View className="bg-surface-container rounded-2xl flex-row items-center px-4 py-4 border border-white/5">
                <MapPin size={20} color="#8e918f" />
                <TextInput
                  value={neighborhood}
                  onChangeText={setNeighborhood}
                  placeholder="e.g. Korangi, Gulberg, Blue Area"
                  placeholderTextColor="#8e918f"
                  className="flex-1 ml-3 text-on-surface text-base font-medium"
                />
              </View>
              <Text className="text-[10px] text-on-surface-variant mt-2 ml-1 italic">
                PakBridge uses neural geofencing to alert you of incidents near this zone.
              </Text>
            </View>
          </Animated.View>

          <View className="mt-auto pt-10">
            <Animated.View entering={FadeInUp.delay(600)}>
              <TouchableOpacity
                onPress={handleRegister}
                disabled={!name || !neighborhood}
                className={`h-16 rounded-2xl flex-row items-center justify-center space-x-3 shadow-2xl ${
                  !name || !neighborhood ? 'bg-surface-container-high opacity-50' : 'bg-primary-container'
                }`}
              >
                <Text className="text-surface-container-lowest font-black text-lg uppercase tracking-tight">
                  Initialize Neural Link
                </Text>
                <ArrowRight size={20} color="#000" />
              </TouchableOpacity>
            </Animated.View>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
