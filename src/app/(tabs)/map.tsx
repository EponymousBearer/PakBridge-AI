import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapViewComponent from '@/components/map-view-component';
import { ShieldAlert, Zap, Layers, Compass, Eye, Filter } from 'lucide-react-native';
import Animated, { FadeInUp, useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';
import { useCrisisStore } from '@/store/crisisStore';

export default function MapScreen() {
  const [activeLayer, setActiveLayer] = useState<'all' | 'flood' | 'medical' | 'fire'>('all');
  const { reports } = useCrisisStore();

  const allIncidents = reports.map((rep) => {
    let type = 'other';
    const cat = rep.category.toLowerCase();
    if (cat.includes('flood')) type = 'flood';
    else if (cat.includes('fire')) type = 'fire';
    else if (cat.includes('medical') || cat.includes('accident')) type = 'medical';
    else if (cat.includes('security')) type = 'fire'; // Map security to threat alert pins

    const isHigh = rep.severity.toLowerCase() === 'critical' || rep.severity.toLowerCase() === 'high';

    return {
      id: rep.id,
      title: rep.category === 'Analyzing...' ? 'New Distress Signal' : `${rep.category}: ${rep.location?.address?.split(',')[0] || 'Alert'}`,
      type,
      coordinate: rep.location ? { latitude: rep.location.lat, longitude: rep.location.lng } : { latitude: 31.5204, longitude: 74.3587 },
      severity: isHigh ? 'high' : 'medium',
      sensorFeeds: rep.sensorFeeds,
      safeRoutes: rep.safeRoutes,
      roadblocks: rep.roadblocks,
      authorities: rep.authorities,
      broadcastStats: rep.broadcastStats
    };
  });

  const filteredIncidents = activeLayer === 'all' 
    ? allIncidents 
    : allIncidents.filter(inc => inc.type === activeLayer);

  // Dynamically extract map overlay items belonging strictly to the currently filtered/visible incidents
  const activeRoadblocks = filteredIncidents.flatMap(inc => inc.roadblocks || []);
  const activeAuthorities = filteredIncidents.flatMap(inc => inc.authorities || []);
  const activeRoutes = filteredIncidents.flatMap(inc => inc.safeRoutes || []);

  // Dynamic map viewport centering
  const latestReport = reports[0];
  const isSeed = !latestReport || latestReport.id.startsWith('seed_');
  
  // Center nationwide if showing seeds, or center on user's live reported event
  const initialLat = isSeed ? 30.3753 : (latestReport?.location?.lat || 31.5204);
  const initialLng = isSeed ? 69.3451 : (latestReport?.location?.lng || 74.3587);
  const latDelta = isSeed ? 7.5 : 0.15; // 7.5 lat delta gives a perfect national view of Pakistan!
  const lngDelta = isSeed ? 7.5 : 0.15;

  return (
    <View className="flex-1 bg-surface-container-lowest">
      {/* Absolute Header Overlay */}
      <SafeAreaView edges={['top']} className="absolute top-0 left-0 right-0 z-20 px-6 py-4 bg-surface/90 border-b border-white/10">
        <View className="flex-row justify-between items-center">
          <View>
            <View className="flex-row items-center gap-2">
              <Text className="text-title-md font-bold text-on-surface">Live Intelligence Map</Text>
              <View className="w-2 h-2 rounded-full bg-secondary-container" />
            </View>
            <Text className="text-label-sm text-secondary-container uppercase tracking-wider font-semibold">
              {isSeed ? 'Active National Radar Sweep • Pakistan Grid' : `Focus: ${latestReport?.location?.address?.split(',')[0]} Operations`}
            </Text>
          </View>
          <View className="flex-row items-center bg-white/5 border border-white/10 px-3 py-1.5 rounded-full gap-1">
            <Layers size={14} color="#00f1fe" />
            <Text className="text-[10px] text-on-surface font-semibold uppercase tracking-wider">Layers</Text>
          </View>
        </View>
      </SafeAreaView>
      
      {/* Map Content */}
      <View className="flex-1">
        <MapViewComponent
          incidents={filteredIncidents}
          initialRegion={{
            latitude: initialLat,
            longitude: initialLng,
            latitudeDelta: latDelta,
            longitudeDelta: lngDelta,
          }}
          roadblocks={activeRoadblocks}
          authorities={activeAuthorities}
          routes={activeRoutes}
        />
      </View>

      {/* Layer Filter Overlay Panel */}
      <View className="absolute bottom-6 left-6 right-6 z-20">
        <Animated.View entering={FadeInUp.delay(200)} className="bg-surface-container/90 border border-white/10 p-4 rounded-xl shadow-lg backdrop-blur-md">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-xs font-bold text-on-surface uppercase tracking-wider">Active Signals Map Layer</Text>
            <Text className="text-[10px] text-secondary-container font-semibold uppercase tracking-wider">
              {filteredIncidents.length} Detections Tracked
            </Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-2 px-2">
            <View className="flex-row gap-2 pr-6">
              {[
                { id: 'all', label: 'All Signals', emoji: '🛰️' },
                { id: 'flood', label: 'Flooding', emoji: '🌊' },
                { id: 'medical', label: 'Medical ER', emoji: '🚑' },
                { id: 'fire', label: 'Fire Outbreak', emoji: '🔥' }
              ].map((layer) => (
                <TouchableOpacity
                  key={layer.id}
                  className={`px-3 py-2 rounded-lg border flex-row items-center gap-2 ${
                    activeLayer === layer.id
                      ? 'bg-secondary-container border-secondary-container'
                      : 'bg-white/5 border-white/10'
                  }`}
                  onPress={() => setActiveLayer(layer.id as any)}
                >
                  <Text className="text-sm">{layer.emoji}</Text>
                  <Text className={`text-xs font-semibold ${
                    activeLayer === layer.id ? 'text-surface-container-lowest' : 'text-on-surface'
                  }`}>{layer.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </View>
  );
}


