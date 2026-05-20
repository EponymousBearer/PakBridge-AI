import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { useCrisisStore, CrisisReport } from '@/store/crisisStore';
import { AlertTriangle, BellRing, MapPin, X, ArrowUpRight, ShieldAlert } from 'lucide-react-native';
import Animated, { 
  FadeInUp, 
  FadeOutUp, 
  SlideInUp, 
  SlideOutUp,
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withSequence,
  withDelay
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { sendLocalNotification } from '@/services/notificationService';
import { AREA_MAP } from '@/services/areaKnowledge';

const PROXIMITY_THRESHOLD = 0.035; // Approx 3.8km

export default function NotificationBanner() {
  const user = useAuthStore((state) => state.user);
  const reports = useCrisisStore((state) => state.reports);
  const [notifiedReport, setNotifiedReport] = useState<CrisisReport | null>(null);
  const [visible, setVisible] = useState(false);
  const [lastNotifiedId, setLastNotifiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!user || reports.length === 0) {
      setVisible(false);
      return;
    }

    // Get the most recent report (usually at index 0)
    const latestReport = reports[0];

    // Don't re-notify if we already saw this report in this session
    if (latestReport.id === lastNotifiedId) return;

    if (!latestReport.location) return;

    const latDiff = Math.abs(user.location.lat - latestReport.location.lat);
    const lngDiff = Math.abs(user.location.lng - latestReport.location.lng);

    // Dynamic precise area/neighborhood matching (e.g. "Malir", "Gulberg", "Clifton")
    const userNeighborhoodLower = user.neighborhood.toLowerCase();
    const reportDescLower = latestReport.description.toLowerCase();
    const reportAddressLower = (latestReport.location.address || '').toLowerCase();

    let isSameArea = false;
    let matchedAreaName = '';

    for (const item of AREA_MAP) {
      for (const keyword of item.keywords) {
        // Filter out broad cities/provinces to match specific town/neighborhood level
        if (
          keyword !== item.info.city.toLowerCase() && 
          keyword !== item.info.province.toLowerCase() && 
          keyword !== 'karachi' && 
          keyword !== 'lahore' && 
          keyword !== 'islamabad'
        ) {
          if (userNeighborhoodLower.includes(keyword) && (reportDescLower.includes(keyword) || reportAddressLower.includes(keyword))) {
            isSameArea = true;
            matchedAreaName = keyword.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            break;
          }
        }
      }
      if (isSameArea) break;
    }

    const inProximity = latDiff < PROXIMITY_THRESHOLD && lngDiff < PROXIMITY_THRESHOLD;

    if (inProximity || isSameArea) {
      setNotifiedReport(latestReport);
      setVisible(true);
      setLastNotifiedId(latestReport.id);

      // Trigger native system notification with custom dynamic text if in the same specific neighborhood
      const isAuthority = user.role === 'Authority';
      const notificationBody = isSameArea
        ? `⚠️ ${latestReport.category} is happening near you in ${matchedAreaName}, be alert.`
        : `${latestReport.category} detected near your ${isAuthority ? 'Office' : 'Home'}. Tap for details.`;

      sendLocalNotification(
        isAuthority ? '🚨 Authority Mobilization' : '⚠️ Immediate Danger Warning',
        notificationBody,
        { reportId: latestReport.id }
      );

      // Auto-dismiss the in-app banner after 6 seconds
      const timer = setTimeout(() => {
        setVisible(false);
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [reports, user, lastNotifiedId]);

  const handlePress = () => {
    if (notifiedReport) {
      router.push(`/workflow/${notifiedReport.id}`);
      setVisible(false);
    }
  };

  if (!visible || !notifiedReport || !user) return null;

  const isAuthority = user.role === 'Authority';

  return (
    <Animated.View 
      entering={SlideInUp.springify().damping(15)}
      exiting={SlideOutUp.duration(300)}
      className="absolute top-12 left-4 right-4 z-50"
    >
      <TouchableOpacity 
        activeOpacity={0.9}
        onPress={handlePress}
        className={`rounded-3xl border p-4 shadow-2xl flex-row items-center ${
          isAuthority 
            ? 'bg-secondary-container/95 border-secondary-container' 
            : 'bg-error-container/95 border-error'
        }`}
        style={{ elevation: 20 }}
      >
        <View className={`w-12 h-12 rounded-2xl items-center justify-center mr-3 ${
          isAuthority ? 'bg-black/10' : 'bg-white/20'
        }`}>
          {isAuthority ? (
            <ShieldAlert size={24} color="#000" />
          ) : (
            <AlertTriangle size={24} color="#fff" />
          )}
        </View>

        <View className="flex-1">
          <Text className={`text-[10px] font-black uppercase tracking-[2px] mb-0.5 ${
            isAuthority ? 'text-black/60' : 'text-white/70'
          }`}>
            {isAuthority ? 'Authority Mobilization' : 'Immediate Danger Warning'}
          </Text>
          <Text className={`text-base font-bold leading-tight ${
            isAuthority ? 'text-on-secondary-container' : 'text-white'
          }`}>
            {notifiedReport.category} near your {isAuthority ? 'Office' : 'Home'}
          </Text>
          <Text 
            numberOfLines={1}
            className={`text-xs mt-0.5 ${
              isAuthority ? 'text-on-secondary-container/80' : 'text-white/80'
            }`}
          >
            {isAuthority ? 'Dispatch rescue crews to coordinate...' : 'Safe evacuation routes available now...'}
          </Text>
        </View>

        <View className="ml-2 items-center justify-center">
          <ArrowUpRight size={20} color={isAuthority ? '#000' : '#fff'} />
        </View>

        <TouchableOpacity 
          onPress={() => setVisible(false)}
          className="absolute -top-1 -right-1 bg-surface-container rounded-full p-1 border border-white/10"
        >
          <X size={14} color="#8e918f" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}
