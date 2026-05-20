import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Send, Mic, Languages, Bot, Shield, Cpu, MessageSquare } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import { useCrisisStore } from '@/store/crisisStore';
import { useAppStore } from '@/store/appStore';
import Animated, { FadeInUp, FadeInRight, useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';

import { parseAreaAndCity } from '@/services/areaKnowledge';

export default function ChatScreen() {
  const [inputText, setInputText] = useState('');
  const { addReport } = useCrisisStore();
  const { language, setLanguage } = useAppStore();
  const pulseAnim = useSharedValue(1);

  useEffect(() => {
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 1200 }),
        withTiming(1.0, { duration: 1200 })
      ),
      -1,
      true
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  const handleSend = async () => {
    if (!inputText.trim()) return;
    
    // Create a mock crisis report and get its actual Firestore Document ID
    const cityData = parseAreaAndCity(inputText);
    
    const docId = await addReport({
      description: inputText,
      category: 'Analyzing...',
      severity: 'Analyzing...',
      status: 'Reported',
      location: { lat: cityData.lat, lng: cityData.lng, address: cityData.address },
      timestamp: Date.now()
    });

    setInputText('');
    router.push(`/workflow/${docId}`);
  };

  const toggleLanguage = () => {
    const langs: ('English' | 'Urdu' | 'Roman Urdu')[] = ['English', 'Urdu', 'Roman Urdu'];
    const nextLang = langs[(langs.indexOf(language) + 1) % langs.length];
    setLanguage(nextLang);
  };

  const getPlaceholder = () => {
    switch(language) {
      case 'Urdu': return 'ہنگامی صورتحال بیان کریں...';
      case 'Roman Urdu': return 'Emergency describe karein...';
      default: return 'Describe your emergency...';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-container-lowest">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Custom Header */}
        <View className="px-6 py-4 border-b border-white/10 flex-row justify-between items-center bg-surface/80">
          <View>
            <View className="flex-row items-center gap-2">
              <Text className="text-title-md font-bold text-on-surface">AI Crisis Assistant</Text>
              <Animated.View style={pulseStyle} className="w-2.5 h-2.5 rounded-full bg-secondary-container" />
            </View>
            <Text className="text-label-sm text-secondary-container uppercase tracking-wider font-semibold">Neural Link Active</Text>
          </View>
          <TouchableOpacity 
            onPress={toggleLanguage}
            className="flex-row items-center bg-white/5 border border-white/10 px-3 py-1.5 rounded-full gap-2"
          >
            <Languages size={14} color="#00f1fe" />
            <Text className="text-xs text-on-surface font-semibold">{language}</Text>
          </TouchableOpacity>
        </View>

        {/* Chat Area */}
        <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingVertical: 24 }} showsVerticalScrollIndicator={false}>
          {/* Welcome Banner */}
          <Animated.View entering={FadeInUp.delay(100)} className="bg-surface-container border border-white/10 rounded-xl p-5 mb-6">
            <View className="flex-row items-center gap-3 mb-3">
              <View className="w-10 h-10 rounded-lg bg-primary-container/10 border border-primary-container/20 items-center justify-center">
                <Cpu color="#2d5bff" size={22} />
              </View>
              <Text className="text-title-sm font-bold text-on-surface uppercase tracking-wider">Neural Coordinator</Text>
            </View>
            <Text className="text-body-md text-on-surface-variant leading-relaxed">
              Describe any high-stakes crisis situation (floods, accidents, gas leaks). Our sub-agents will run live simulations, detect severity, plan response grids, and issue hotlines.
            </Text>
          </Animated.View>

          {/* Quick Starter Cards */}
          <Text className="text-label-sm text-on-surface-variant font-bold uppercase tracking-wider mb-3">Quick Incident Reports</Text>
          <View className="flex-row flex-wrap gap-3 mb-6">
            {[
              { text: 'Flash Floods in SWAT', icon: '🌊' },
              { text: 'Gas Pipeline Leak', icon: '⚠️' },
              { text: 'Major Road Accident', icon: '🚑' },
              { text: 'Building Fire Distress', icon: '🔥' }
            ].map((chip, idx) => (
              <Animated.View entering={FadeInUp.delay(150 + idx * 50)} key={chip.text}>
                <TouchableOpacity 
                  className="bg-surface-container border border-white/10 hover:border-secondary-container px-4 py-3 rounded-xl flex-row items-center gap-2"
                  onPress={() => setInputText(chip.text)}
                >
                  <Text className="text-sm">{chip.icon}</Text>
                  <Text className="text-sm font-semibold text-on-surface">{chip.text}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>

          {/* Agent Simulation Walkthrough */}
          <Animated.View entering={FadeInUp.delay(350)} className="border border-white/5 bg-surface-container/30 rounded-xl p-4 mb-6">
            <Text className="text-xs font-semibold text-secondary-container uppercase tracking-wider mb-2">Simulated Live Response Workflow</Text>
            <View className="gap-3">
              <View className="flex-row gap-3 items-center">
                <View className="w-6 h-6 rounded-full bg-primary-container items-center justify-center"><Text className="text-[10px] text-white">1</Text></View>
                <Text className="text-xs text-on-surface-variant">Retrieval Agent scrapes sensor, drone, & social feeds</Text>
              </View>
              <View className="flex-row gap-3 items-center">
                <View className="w-6 h-6 rounded-full bg-secondary-container items-center justify-center"><Text className="text-[10px] text-black">2</Text></View>
                <Text className="text-xs text-on-surface-variant">Detection Agent tags severity, locations, & casualties</Text>
              </View>
              <View className="flex-row gap-3 items-center">
                <View className="w-6 h-6 rounded-full bg-tertiary-container items-center justify-center"><Text className="text-[10px] text-white">3</Text></View>
                <Text className="text-xs text-on-surface-variant">Reasoning Agent structures survival checklists & dispatch</Text>
              </View>
            </View>
          </Animated.View>
        </ScrollView>

        {/* Input Area */}
        <View className="p-4 bg-surface border-t border-white/10 shadow-lg">
          <View className="flex-row items-end gap-3">
            <View className="flex-1 bg-surface-container border border-white/10 rounded-2xl p-2 px-4 flex-row items-center min-h-[56px]">
              <TextInput
                className="flex-1 text-on-surface max-h-32 min-h-[30px] text-sm"
                placeholder={getPlaceholder()}
                placeholderTextColor="#c4c5d9"
                multiline
                value={inputText}
                onChangeText={setInputText}
              />
              <TouchableOpacity className="ml-2 p-2 bg-white/5 rounded-lg border border-white/5">
                <Mic size={18} color="#00f1fe" />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              className={`w-14 h-14 rounded-2xl items-center justify-center border ${
                inputText.trim() 
                  ? 'bg-secondary-container border-secondary-container' 
                  : 'bg-white/5 border-white/10'
              }`}
              onPress={handleSend}
              disabled={!inputText.trim()}
            >
              <Send size={20} color={inputText.trim() ? '#00363a' : '#c4c5d9'} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
