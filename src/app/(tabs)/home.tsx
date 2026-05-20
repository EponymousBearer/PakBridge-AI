import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  ShieldAlert, 
  Bell, 
  Activity, 
  AlertTriangle, 
  Megaphone, 
  Flame, 
  Heart, 
  Map, 
  Maximize2, 
  ArrowRight, 
  ChevronRight, 
  MessageSquare,
  Compass,
  Phone,
  Bot,
  LogOut,
  MapPin,
  User
} from 'lucide-react-native';
import Animated, { FadeInUp, FadeInRight, useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';
import { useEffect } from 'react';
import { useCrisisStore } from '@/store/crisisStore';
import { useAuthStore } from '@/store/authStore';

const { width } = Dimensions.get('window');

const getProvinceFromAddress = (address?: string): string => {
  if (!address) return 'Punjab';
  const addr = address.toLowerCase();
  if (addr.includes('sindh')) return 'Sindh';
  if (addr.includes('khyber pakhtunkhwa') || addr.includes('kp')) return 'Khyber Pakhtunkhwa';
  if (addr.includes('punjab')) return 'Punjab';
  if (addr.includes('balochistan')) return 'Balochistan';
  if (addr.includes('gilgit')) return 'Gilgit-Baltistan';
  if (addr.includes('islamabad') || addr.includes('capital territory')) return 'Capital Territory';
  return 'Punjab';
};

const getCategoryImage = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('flood')) {
    return 'https://lh3.googleusercontent.com/aida-public/AB6AXuDP-GpaZC1Wn4X3lOym8G3G92VhKkKJPsL_aEoNgDXZbEDi_AnmyTBHpU4vccgDK5q2yotWl5WY3h3qVd_GH_hIEDVWMImNlWVIjfnmbE2pTzSZFo20989Ip3FYGHYGdqNma17A0Ctft4NVGzUg8fA_9vtqVhHUPI3Ytt9OShTK5gcDXkRs0ubJa3B_lsru-xrknTQ4dmowS98bdhmTpLlFR4BEeYD2FLln237a-zzVYrcGMPQifK_BWAfSN7KyHDynH6vjeBZBT5k';
  }
  if (cat.includes('medical') || cat.includes('accident')) {
    return 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAA_0nHKHPM_X7fTnn12gRh6yREHhK0Ul4Wv3-zn2tnXzttMdWGscexO2x2MykPOFZx2W8MmJAofz1tK6vpIQ3ZjRtShgD5cLHR1Qiiunc5JGLn5vZdumUCJlpPAZwQARhhNjx7AreVQeH4Nqo-RZs8Myutlm9UMzrvTP9DSQvtG4DE-AMbwxEmeoKPN733AgkZUN6plddHXZ0VPo4LDfVPenQTwHC3TWg4E4LDMSsFs_ARpCgAAxDrJ22Jrd5JiabqIELXEJedmI';
  }
  if (cat.includes('fire')) {
    return 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=400&q=80';
  }
  if (cat.includes('security')) {
    return 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=400&q=80';
  }
  return 'https://lh3.googleusercontent.com/aida-public/AB6AXuDezHe8qNZFPEVs_pJKvQHpwY7EdNPaUb9TV8rnayi_iLLRhiQWZQ7W1tFZDn0VmCgLPxebDHWx0c0tg865LE8dAmmjb-Hbn5VS-GNo68C_if3PDMR-PANlR13j5nHq2i3YyhY6Vw-viKKd79RWQWqQERBpaEor_rmSERSpP08kMa1I8uD7DT_RKW1zfzdvT45b7lZVrhKdQJXoHujcsO1VnQJ3jEqMWMczZDKqdkt9HKN5IBtmuFgrpSB-_2V2MkftehtlA5G31F4';
};

const formatTimeAgo = (timestamp: number) => {
  const diffMs = Date.now() - timestamp;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
};

export default function HomeScreen() {
  const pulseAnim = useSharedValue(1);
  const { reports } = useCrisisStore();
  const { user, clearSession } = useAuthStore();

  const handleReset = () => {
    clearSession();
    router.replace('/onboarding');
  };

  useEffect(() => {
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1500 }),
        withTiming(1.0, { duration: 1500 })
      ),
      -1,
      true
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseAnim.value }],
    };
  });

  // Dynamic calculations based on active reports in store
  const activeReportsCount = reports.filter(r => r.status !== 'Resolved').length;
  
  // Calculate unique provinces/regions
  const activeProvinces = new Set(
    reports
      .filter(r => r.status !== 'Resolved')
      .map(r => getProvinceFromAddress(r.location?.address))
  );
  const activeRegionsCount = Math.max(1, activeProvinces.size);

  // Dynamic system metrics
  const activeNodesCount = 1248 + reports.length * 3;
  const livesAssistedCount = 45910 + (reports.length - 3) * 15;

  return (
    <SafeAreaView className="flex-1 bg-surface-container-lowest">
      {/* Custom TopAppBar */}
      <View className="h-16 border-b border-white/10 px-6 flex-row justify-between items-center bg-surface/80">
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-full bg-primary-container items-center justify-center">
            <Text className="text-on-primary-container font-bold text-lg">{user?.name?.charAt(0) || 'P'}</Text>
          </View>
          <Text className="text-title-md font-bold text-secondary-container tracking-tight">PakBridge AI</Text>
          <View className="ml-1 bg-secondary-container/10 px-1.5 py-0.5 rounded flex-row items-center gap-1">
            <View className="w-1.5 h-1.5 rounded-full bg-secondary-container" />
            <Text className="text-[8px] font-black text-secondary-container uppercase">Cloud Live</Text>
          </View>
        </View>
        
        <View className="flex-row items-center gap-2">
          <TouchableOpacity 
            onPress={handleReset}
            className="p-2 rounded-full bg-error-container/10 border border-error-container/20 mr-2"
          >
            <LogOut color="#ffb4aa" size={20} />
          </TouchableOpacity>
          <TouchableOpacity className="p-2 rounded-full bg-white/5 border border-white/10">
            <Bell color="#dfe2f3" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      {/* News Ticker */}
      <View className="bg-surface-container-high h-10 flex-row items-center overflow-hidden border-b border-white/5 px-6">
        <View className="flex-row items-center gap-2">
          <View className="w-2 h-2 rounded-full bg-secondary-container" />
          <Text className="text-label-sm text-secondary-container font-semibold tracking-wider uppercase">
            LIVE: {reports.slice(0, 3).map(r => `${r.category === 'Analyzing...' ? 'NEW SIGNAL' : r.category.toUpperCase()} IN ${r.location?.address?.split(',')[0].toUpperCase() || 'PAKISTAN'}`).join(' • ')}
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* User Profile Card */}
        <Animated.View entering={FadeInUp.delay(50)} className="bg-surface-container/60 border border-white/5 rounded-2xl p-4 mt-6 mb-2 flex-row items-center">
          <View className={`w-12 h-12 rounded-xl items-center justify-center mr-4 ${user?.role === 'Authority' ? 'bg-secondary-container/20' : 'bg-primary-container/20'}`}>
            {user?.role === 'Authority' ? <ShieldAlert size={24} color="#00f1fe" /> : <User size={24} color="#b8c3ff" />}
          </View>
          <View className="flex-1">
            <Text className="text-on-surface font-bold text-base leading-tight">{user?.name || 'Neural Guest'}</Text>
            <View className="flex-row items-center mt-0.5">
              <MapPin size={12} color="#8e918f" />
              <Text className="text-on-surface-variant text-xs ml-1">{user?.neighborhood || 'Global Grid'}</Text>
              <View className="mx-2 w-1 h-1 rounded-full bg-white/20" />
              <Text className="text-secondary-container text-[10px] font-black uppercase tracking-tighter">{user?.role}</Text>
            </View>
          </View>
          <View className="px-2 py-1 rounded-md bg-secondary-container/10 border border-secondary-container/20">
            <Activity size={14} color="#00f1fe" />
          </View>
        </Animated.View>

        {/* Hero Active Protocol Card */}
        <Animated.View entering={FadeInUp.delay(100)} className="bg-surface-container border border-white/10 rounded-xl p-6 mb-6 overflow-hidden relative">
          {/* Neon Glow Blur Decoration */}
          <View className="absolute -right-16 -top-16 w-48 h-48 bg-secondary-container/10 rounded-full blur-3xl" />
          
          <View className="flex-row items-center gap-2 mb-4">
            <View className="flex-row items-center bg-error-container/20 border border-error-container px-3 py-1 rounded-full gap-2">
              <Animated.View style={pulseStyle} className="w-2.5 h-2.5 rounded-full bg-error" />
              <Text className="text-error font-semibold text-xs tracking-wider uppercase">EMERGENCY PROTOCOL ACTIVE</Text>
            </View>
          </View>

          <Text className="text-headline-lg-mobile font-bold text-on-surface mb-2">Facing an Emergency?</Text>
          <Text className="text-body-md text-on-surface-variant mb-6 leading-relaxed">
            Our Crisis Intelligence AI is monitoring real-time data to provide immediate assistance and accurate guidance during volatile situations across Pakistan.
          </Text>

          <TouchableOpacity 
            className="flex-row items-center justify-center bg-primary-container px-6 py-4 rounded-xl shadow-lg self-start gap-2"
            activeOpacity={0.8}
            onPress={() => router.replace('/chat')}
          >
            <ShieldAlert color="#efefff" size={20} />
            <Text className="text-on-primary-container font-semibold text-base">Get Immediate Help</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Live System Status */}
        <Text className="text-title-md font-bold text-on-surface mb-3">Live System Status</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6 -mx-6 px-6">
          <View className="flex-row gap-4 pr-12">
            {/* Status 1 */}
            <View className="bg-surface-container border border-white/10 p-4 rounded-xl flex-row items-center gap-4 w-64">
              <View className="w-12 h-12 rounded-lg bg-secondary-container/10 items-center justify-center border border-secondary-container/20">
                <Bot color="#00f1fe" size={24} />
              </View>
              <View>
                <Text className="text-label-sm text-on-surface-variant uppercase tracking-wider">Active Agents</Text>
                <Text className="text-title-md font-bold text-on-surface">{activeNodesCount.toLocaleString()} Neural Nodes</Text>
              </View>
            </View>

            {/* Status 2 */}
            <View className="bg-surface-container border border-white/10 border-l-4 border-l-tertiary-container p-4 rounded-xl flex-row items-center gap-4 w-64">
              <View className="w-12 h-12 rounded-lg bg-tertiary-container/10 items-center justify-center border border-tertiary-container/20">
                <AlertTriangle color="#ffb4aa" size={24} />
              </View>
              <View>
                <Text className="text-label-sm text-on-surface-variant uppercase tracking-wider">Ongoing Incidents</Text>
                <Text className="text-title-md font-bold text-on-surface">{activeReportsCount} High-Priority</Text>
              </View>
            </View>

            {/* Status 3 */}
            <View className="bg-surface-container border border-white/10 p-4 rounded-xl flex-row items-center gap-4 w-64">
              <View className="w-12 h-12 rounded-lg bg-primary-container/10 items-center justify-center border border-primary-container/20">
                <Megaphone color="#b8c3ff" size={24} />
              </View>
              <View>
                <Text className="text-label-sm text-on-surface-variant uppercase tracking-wider">Emergency Alerts</Text>
                <Text className="text-title-md font-bold text-on-surface">{activeRegionsCount.toString().padStart(2, '0')} Active Regions</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* AI Assistant Preview Card */}
        <Animated.View entering={FadeInUp.delay(200)} className="bg-surface-container border border-white/10 border-t-2 border-t-secondary-container rounded-xl p-5 mb-6">
          <View className="flex-row items-center gap-4 mb-4">
            <View className="relative">
              <View className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary-container to-primary-container items-center justify-center bg-primary-container">
                <Bot color="#dfe2f3" size={26} />
              </View>
              <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-secondary-container rounded-full border-2 border-surface" />
            </View>
            <View>
              <Text className="text-title-md font-bold text-on-surface">Command AI Assistant</Text>
              <Text className="text-label-sm text-secondary-container uppercase tracking-wider font-semibold">Ready to help</Text>
            </View>
          </View>

          <Text className="text-body-md text-on-surface-variant mb-4 leading-relaxed">
            "I'm currently tracking {activeReportsCount} high-intensity incidents across {activeRegionsCount} provinces. Ask me for the safest evacuation route or nearest relief centers."
          </Text>

          <TouchableOpacity 
            className="w-full py-3 rounded-lg bg-surface-container-high border border-white/10 items-center justify-center flex-row gap-2"
            activeOpacity={0.8}
            onPress={() => router.replace('/chat')}
          >
            <Text className="text-on-surface font-semibold text-sm">Chat with Command AI</Text>
            <ArrowRight color="#dfe2f3" size={16} />
          </TouchableOpacity>
        </Animated.View>

        {/* Quick Actions */}
        <Text className="text-title-md font-bold text-on-surface mb-3">Quick Actions</Text>
        <View className="grid grid-cols-2 gap-3 flex-row flex-wrap mb-6">
          <TouchableOpacity 
            className="flex-1 bg-surface-container border border-white/10 border-b-2 border-b-error p-4 rounded-xl items-center gap-2 min-w-[45%]"
            activeOpacity={0.8}
            onPress={() => router.replace('/chat')}
          >
            <ShieldAlert color="#ffb4aa" size={24} />
            <Text className="text-label-sm text-on-surface text-center font-semibold">Report Emergency</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-1 bg-surface-container border border-white/10 border-b-2 border-b-secondary-container p-4 rounded-xl items-center gap-2 min-w-[45%]"
            activeOpacity={0.8}
            onPress={() => router.replace('/map')}
          >
            <Heart color="#00f1fe" size={24} />
            <Text className="text-label-sm text-on-surface text-center font-semibold">Nearby Hospitals</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-1 bg-surface-container border border-white/10 border-b-2 border-b-primary p-4 rounded-xl items-center gap-2 min-w-[45%]"
            activeOpacity={0.8}
            onPress={() => router.replace('/map')}
          >
            <Compass color="#b8c3ff" size={24} />
            <Text className="text-label-sm text-on-surface text-center font-semibold">Safe Shelters</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-1 bg-surface-container border border-white/10 border-b-2 border-b-outline p-4 rounded-xl items-center gap-2 min-w-[45%]"
            activeOpacity={0.8}
            onPress={() => router.replace('/chat')}
          >
            <Phone color="#c4c5d9" size={24} />
            <Text className="text-label-sm text-on-surface text-center font-semibold">Emergency Hotline</Text>
          </TouchableOpacity>
        </View>

        {/* Live Map Preview Card */}
        <Animated.View entering={FadeInUp.delay(300)} className="bg-surface-container border border-white/10 rounded-xl overflow-hidden mb-6 h-48 relative">
          <Image 
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJE9oNIto9Pmv1-bJED4AEFFh_yLWdCfQI57xIr6te8EaRDLlDEgbiko4AxQIYX6FSd2vtstEQSM49Wx8GoQV1-ADydi_T-SZ2mo4XjNA1wHoHzjZhMjfrqNc04CEoIiPV-76TCKu-6JRCkjslBLVLwssrrHs8nWXCUGJGNw9SjvV3haexy-r1lsqKeFODJug89en2wiEj7jejeAHADQHqZWq-q4XNIRhOpXdnovWzMJ610qes_XPGcuKUSNUKVF3oArXttCkS4vQ' }}
            className="w-full h-full opacity-40 grayscale"
          />
          <View className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          <View className="absolute bottom-4 left-4 right-4 flex-row justify-between items-end">
            <View>
              <Text className="text-label-sm text-secondary-container font-semibold uppercase tracking-wider">Regional Scan</Text>
              <Text className="text-title-md font-bold text-on-surface">Interactive Radar Map</Text>
            </View>
            <TouchableOpacity 
              className="p-3 rounded-full bg-secondary-container shadow-lg"
              onPress={() => router.replace('/map')}
            >
              <Maximize2 color="#00363a" size={18} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Recent AI Detections */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-title-md font-bold text-on-surface">Recent AI Detections</Text>
          <TouchableOpacity onPress={() => router.replace('/dashboard')}>
            <Text className="text-primary font-semibold text-sm">View All</Text>
          </TouchableOpacity>
        </View>

        {reports.map((detection, index) => {
          const isCritical = detection.severity === 'Critical';
          const isWarning = detection.severity === 'High';
          
          // Construct nice titles for user inputs
          const locationName = detection.location?.address?.split(',')[0] || 'Pakistan';
          let displayTitle = '';
          if (detection.category === 'Analyzing...') {
            displayTitle = `Crisis Report — ${locationName}`;
          } else {
            displayTitle = `${detection.category} Distress — ${locationName}`;
          }

          return (
            <Animated.View 
              entering={FadeInRight.delay(100 * index)} 
              key={detection.id} 
              className="bg-surface-container border border-white/10 rounded-xl p-4 mb-4 flex-row gap-4"
            >
              <Image 
                source={{ uri: getCategoryImage(detection.category) }}
                className="w-24 h-24 rounded-lg bg-surface-container-high"
              />
              <View className="flex-1">
                <View className="flex-row justify-between items-center mb-1">
                  <View className={`px-2 py-0.5 rounded ${
                    isCritical ? 'bg-error-container/20 border border-error-container/30' :
                    isWarning ? 'bg-tertiary-container/20 border border-tertiary-container/30' :
                    'bg-primary-container/20 border border-primary-container/30'
                  }`}>
                    <Text className={`text-xs font-semibold uppercase tracking-wider ${
                      isCritical ? 'text-error' :
                      isWarning ? 'text-tertiary' :
                      'text-primary'
                    }`}>{detection.category}</Text>
                  </View>
                  <Text className="text-label-sm text-on-surface-variant">{formatTimeAgo(detection.timestamp)}</Text>
                </View>

                <Text className="text-body-md font-bold text-on-surface mb-1">{displayTitle}</Text>
                <Text className="text-xs text-on-surface-variant leading-relaxed mb-2" numberOfLines={2}>{detection.description}</Text>

                <View className="flex-row items-center gap-3">
                  <Text className="text-xs font-semibold text-secondary-container">✓ {detection.status}</Text>
                  <Text className="text-xs text-on-surface-variant">• {detection.location?.address || 'Pakistan'}</Text>
                </View>
              </View>
            </Animated.View>
          );
        })}

        {/* Footer spacer */}
        <View className="h-16" />
      </ScrollView>
    </SafeAreaView>
  );
}


