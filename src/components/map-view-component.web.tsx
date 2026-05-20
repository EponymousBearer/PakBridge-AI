import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { AlertTriangle, PlusCircle, Navigation, MapPin, RefreshCw, Layers, ShieldAlert, Cpu, Eye, Info, Send } from 'lucide-react-native';

interface Incident {
  id: string;
  title: string;
  type: string;
  coordinate: { latitude: number; longitude: number };
  severity: string;
  sensorFeeds?: { name: string; value: string; status: string }[];
  safeRoutes?: { name: string; path: string; points: { latitude: number; longitude: number }[] }[];
  roadblocks?: { name: string; reason: string; coordinate: { latitude: number; longitude: number } }[];
  authorities?: { name: string; type: string; distanceKm: number; contact: string; coordinate: { latitude: number; longitude: number } }[];
  broadcastStats?: { radiusMeters: number; devicesNotified: number; text: string };
}

interface MapViewComponentProps {
  incidents: Incident[];
  initialRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
}

export default function MapViewComponent({ incidents, initialRegion }: MapViewComponentProps) {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [filter, setFilter] = useState<'all' | 'high' | 'medium'>('all');
  const [mapType, setMapType] = useState<'standard' | 'cycle'>('standard');
  const [activeOverlayTab, setActiveOverlayTab] = useState<'info' | 'sensors' | 'routing' | 'dispatches'>('info');

  const filteredIncidents = incidents.filter(inc => {
    if (filter === 'all') return true;
    return inc.severity === filter;
  });

  // Construct OpenStreetMap Embed URL centered on Lahore or the selected incident
  const centerLat = selectedIncident ? selectedIncident.coordinate.latitude : initialRegion.latitude;
  const centerLng = selectedIncident ? selectedIncident.coordinate.longitude : initialRegion.longitude;
  
  const delta = 0.04;
  const minLng = centerLng - delta;
  const minLat = centerLat - delta;
  const maxLng = centerLng + delta;
  const maxLat = centerLat + delta;
  
  const mapLayer = mapType === 'standard' ? 'mapnik' : 'cycle';
  
  // Construct roadblocks and authority marks for OpenStreetMap embed if possible
  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${minLng}%2C${minLat}%2C${maxLng}%2C${maxLat}&layer=${mapLayer}&marker=${centerLat}%2C${centerLng}`;

  return (
    <View style={{ flex: 1, flexDirection: 'row', position: 'relative', height: '100%', width: '100%' }}>
      {/* Sidebar - Incident Feed */}
      <View className="w-80 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 flex flex-col z-10 shadow-lg">
        <View className="p-4 border-b border-gray-100 dark:border-zinc-850">
          <View className="flex-row items-center gap-2 mb-2">
            <ShieldAlert className="text-red-500" size={20} />
            <Text className="text-[10px] font-semibold tracking-wider text-gray-400 dark:text-zinc-500 uppercase">Live Operations Grid</Text>
          </View>
          <Text className="text-lg font-bold text-gray-900 dark:text-white">Active Incident Feeds</Text>
        </View>

        {/* Filters */}
        <View className="flex-row p-2 bg-gray-50 dark:bg-zinc-950 gap-1 border-b border-gray-100 dark:border-zinc-850">
          {(['all', 'high', 'medium'] as const).map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => setFilter(type)}
              className={`flex-1 py-1.5 px-3 rounded-lg items-center justify-center transition-all ${
                filter === type
                  ? 'bg-zinc-900 dark:bg-zinc-800'
                  : 'bg-transparent'
              }`}
            >
              <Text
                className={`text-xs font-semibold capitalize ${
                  filter === type
                    ? 'text-white'
                    : 'text-gray-500 dark:text-zinc-400'
                }`}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Scrollable Feed */}
        <ScrollView className="flex-1 p-3">
          {filteredIncidents.map((incident) => (
            <TouchableOpacity
              key={incident.id}
              onPress={() => {
                setSelectedIncident(incident);
                setActiveOverlayTab('info');
              }}
              className={`p-3 rounded-xl mb-2.5 border transition-all ${
                selectedIncident?.id === incident.id
                  ? 'bg-red-50/50 dark:bg-red-950/20 border-red-500/30'
                  : 'bg-zinc-50 dark:bg-zinc-900/50 border-gray-100 dark:border-zinc-800/80 hover:border-gray-200 dark:hover:border-zinc-700'
              }`}
            >
              <View className="flex-row justify-between items-start mb-2">
                <View className="flex-row items-center gap-2">
                  <View className={`w-2.5 h-2.5 rounded-full ${incident.severity === 'high' ? 'bg-red-500' : 'bg-amber-500'}`} />
                  <Text className="font-bold text-gray-900 dark:text-zinc-100 text-sm truncate max-w-[150px]">{incident.title}</Text>
                </View>
                <View className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  incident.severity === 'high'
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                }`}>
                  {incident.severity}
                </View>
              </View>

              <View className="flex-row items-center gap-1.5 mb-3">
                <MapPin size={12} className="text-gray-400" />
                <Text className="text-xs text-gray-500 dark:text-zinc-400">
                  Lat: {incident.coordinate.latitude.toFixed(4)}, Lng: {incident.coordinate.longitude.toFixed(4)}
                </Text>
              </View>

              <View className="flex-row justify-between items-center pt-2.5 border-t border-gray-100 dark:border-zinc-800">
                <View className="flex-row items-center gap-1.5">
                  {incident.type === 'medical' ? (
                    <PlusCircle size={14} className="text-blue-500" />
                  ) : (
                    <AlertTriangle size={14} className="text-red-500" />
                  )}
                  <Text className="text-[11px] font-semibold text-gray-500 dark:text-zinc-400 capitalize">{incident.type}</Text>
                </View>
                <Text className="text-xs font-bold text-blue-600 dark:text-blue-400 flex-row items-center gap-1">
                  Tactical View <Navigation size={10} />
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Map Area */}
      <View style={{ flex: 1, position: 'relative' }}>
        <iframe
          src={embedUrl}
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="Emergency Map"
        />

        {/* Map Control Buttons */}
        <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 15 }}>
          <TouchableOpacity
            onPress={() => setMapType(mapType === 'standard' ? 'cycle' : 'standard')}
            className="w-10 h-10 bg-white dark:bg-zinc-900 rounded-xl items-center justify-center shadow-lg border border-gray-100 dark:border-zinc-800"
          >
            <Layers size={18} className="text-gray-700 dark:text-zinc-300" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedIncident(null)}
            className="w-10 h-10 bg-white dark:bg-zinc-900 rounded-xl items-center justify-center shadow-lg border border-gray-100 dark:border-zinc-800"
          >
            <RefreshCw size={18} className="text-gray-700 dark:text-zinc-300" />
          </TouchableOpacity>
        </div>

        {/* Selected Incident Information Overlay */}
        {selectedIncident && (
          <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', display: 'flex', flexDirection: 'column', zIndex: 15 }}>
            <View className="bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-2xl border border-gray-100 dark:border-zinc-800">
              <View className="flex-row justify-between items-start mb-2.5 border-b border-gray-100 dark:border-zinc-800 pb-2">
                <View className="flex-row items-center gap-2">
                  <View className={`w-3 h-3 rounded-full ${selectedIncident.severity === 'high' ? 'bg-red-500' : 'bg-amber-500'}`} />
                  <Text className="text-base font-bold text-gray-900 dark:text-white">{selectedIncident.title}</Text>
                </View>
                <TouchableOpacity onPress={() => setSelectedIncident(null)} className="p-1 rounded-full">
                  <Text className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 font-bold text-lg">×</Text>
                </TouchableOpacity>
              </View>

              {/* Navigation Tabs in overlay */}
              <View className="flex-row gap-1 mb-3 bg-gray-50 dark:bg-zinc-950 p-1 rounded-xl">
                {[
                  { id: 'info', label: 'Summary', icon: <Info size={12} /> },
                  { id: 'sensors', label: 'Sensors (IoT)', icon: <Cpu size={12} /> },
                  { id: 'routing', label: 'Evac & Blocks', icon: <Navigation size={12} /> },
                  { id: 'dispatches', label: 'Responders', icon: <ShieldAlert size={12} /> },
                ].map(t => (
                  <TouchableOpacity
                    key={t.id}
                    onPress={() => setActiveOverlayTab(t.id as any)}
                    className={`flex-row items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                      activeOverlayTab === t.id 
                        ? 'bg-white dark:bg-zinc-800 shadow-sm' 
                        : 'bg-transparent'
                    }`}
                  >
                    <View className={activeOverlayTab === t.id ? 'text-blue-500' : 'text-gray-400'}>
                      {t.icon}
                    </View>
                    <Text className={`text-[10px] font-bold ${
                      activeOverlayTab === t.id ? 'text-gray-900 dark:text-white' : 'text-gray-500'
                    }`}>{t.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Content Panel based on active tab */}
              <ScrollView style={{ maxHeight: 150 }} showsVerticalScrollIndicator={false} className="mb-3">
                {activeOverlayTab === 'info' && (
                  <View>
                    <Text className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed">
                      Emergency radar scanned {selectedIncident.type} at coordinates {selectedIncident.coordinate.latitude.toFixed(5)}°N, {selectedIncident.coordinate.longitude.toFixed(5)}°E.
                      The operational status is categorized as <Text className="font-bold text-red-500">{selectedIncident.severity}</Text> priority.
                    </Text>
                    {selectedIncident.broadcastStats && (
                      <View className="mt-2.5 flex-row items-center gap-2 bg-blue-50/50 dark:bg-blue-950/20 p-2.5 rounded-xl border border-blue-100/50 dark:border-blue-900/30">
                        <Send size={14} className="text-blue-500" />
                        <Text className="text-[10px] text-blue-800 dark:text-blue-300 font-semibold leading-relaxed">
                          Resident Warning: Broadcasted geofenced SMS beacons to <Text className="font-bold">{selectedIncident.broadcastStats.devicesNotified.toLocaleString()}</Text> mobile devices within {selectedIncident.broadcastStats.radiusMeters}m of the sector!
                        </Text>
                      </View>
                    )}
                  </View>
                )}

                {activeOverlayTab === 'sensors' && (
                  <View className="flex-row flex-wrap gap-2">
                    {selectedIncident.sensorFeeds ? (
                      selectedIncident.sensorFeeds.map((s, idx) => (
                        <View key={idx} className="bg-gray-50 dark:bg-zinc-950 border border-gray-150 dark:border-zinc-800 p-2 rounded-xl flex-row items-center justify-between min-w-[48%]">
                          <Text className="text-[10px] font-bold text-gray-700 dark:text-zinc-300">{s.name}</Text>
                          <Text className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            s.status === 'critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                            s.status === 'warn' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                            'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          }`}>{s.value}</Text>
                        </View>
                      ))
                    ) : (
                      <Text className="text-[11px] text-gray-400 italic">No telemetry data loaded. Run the multi-agent pipeline first.</Text>
                    )}
                  </View>
                )}

                {activeOverlayTab === 'routing' && (
                  <View className="gap-2">
                    {selectedIncident.safeRoutes && selectedIncident.safeRoutes.length > 0 ? (
                      <View className="bg-green-50/40 dark:bg-green-950/10 border border-green-100/50 dark:border-green-900/20 p-2.5 rounded-xl">
                        <Text className="text-[10px] font-bold text-green-800 dark:text-green-300 uppercase mb-1">🧭 AI Safe Evacuation Corridor</Text>
                        <Text className="text-xs text-gray-800 dark:text-zinc-200 font-semibold">{selectedIncident.safeRoutes[0].name}</Text>
                        <Text className="text-[10px] text-gray-500 mt-0.5">Route: {selectedIncident.safeRoutes[0].path}</Text>
                      </View>
                    ) : (
                      <Text className="text-[11px] text-gray-400 italic">No safe routing corridor formulated.</Text>
                    )}

                    {selectedIncident.roadblocks && selectedIncident.roadblocks.length > 0 ? (
                      <View className="bg-amber-50/40 dark:bg-amber-950/10 border border-amber-100/50 dark:border-amber-900/20 p-2.5 rounded-xl">
                        <Text className="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase mb-1">🚧 Active Hazard roadblock</Text>
                        <Text className="text-xs text-gray-800 dark:text-zinc-200 font-semibold">{selectedIncident.roadblocks[0].name}</Text>
                        <Text className="text-[10px] text-gray-500 mt-0.5">Reason: {selectedIncident.roadblocks[0].reason}</Text>
                      </View>
                    ) : (
                      <Text className="text-[11px] text-gray-400 italic">No roadblocks detected.</Text>
                    )}
                  </View>
                )}

                {activeOverlayTab === 'dispatches' && (
                  <View className="flex-row flex-wrap gap-2">
                    {selectedIncident.authorities ? (
                      selectedIncident.authorities.map((a, idx) => (
                        <View key={idx} className="bg-gray-55 dark:bg-zinc-950 border border-gray-150 dark:border-zinc-800 p-2 rounded-xl flex-row items-center justify-between min-w-[48%]">
                          <View>
                            <Text className="text-[10px] font-bold text-gray-900 dark:text-zinc-100 leading-tight">{a.name}</Text>
                            <Text className="text-[9px] text-gray-400">Distance: {a.distanceKm}km away</Text>
                          </View>
                          <View className="items-end">
                            <Text className="text-[9px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-1.5 py-0.5 rounded capitalize">{a.type}</Text>
                            <Text className="text-[9px] text-gray-500 mt-0.5 font-mono">{a.contact}</Text>
                          </View>
                        </View>
                      ))
                    ) : (
                      <Text className="text-[11px] text-gray-400 italic">No dispatches triggered yet.</Text>
                    )}
                  </View>
                )}
              </ScrollView>

              <View className="flex-row gap-2 pt-2 border-t border-gray-100 dark:border-zinc-800">
                <TouchableOpacity className="flex-1 bg-red-600 dark:bg-red-600 py-2 rounded-xl items-center justify-center">
                  <Text className="text-white text-xs font-bold">Contact Station Command</Text>
                </TouchableOpacity>
              </View>
            </View>
          </div>
        )}
      </View>
    </View>
  );
}
