import React from 'react';
import { View, StyleSheet, Text as RNText } from 'react-native';
import MapView, { Marker, Callout, Polyline } from 'react-native-maps';
import { Shield, Home, Eye } from 'lucide-react-native';

interface Incident {
  id: string;
  title: string;
  type: string;
  coordinate: { latitude: number; longitude: number };
  severity: string;
}

export interface RoadblockMarker {
  name: string;
  reason: string;
  coordinate: { latitude: number; longitude: number };
}

export interface AuthorityMarker {
  name: string;
  type: 'rescue' | 'fire' | 'medical' | 'police';
  distanceKm: number;
  contact: string;
  coordinate: { latitude: number; longitude: number };
}

export interface SafeRouteLine {
  name: string;
  path: string;
  points: { latitude: number; longitude: number }[];
}

interface MapViewComponentProps {
  incidents: Incident[];
  initialRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  roadblocks?: RoadblockMarker[];
  authorities?: AuthorityMarker[];
  routes?: SafeRouteLine[];
}

const getAuthorityEmoji = (type: 'rescue' | 'fire' | 'medical' | 'police') => {
  switch (type) {
    case 'rescue': return '🚒';
    case 'fire': return '🚒';
    case 'medical': return '🏥';
    case 'police': return '🛡️';
    default: return '🚨';
  }
};

const getIncidentEmoji = (type: string) => {
  switch (type) {
    case 'flood': return '🌊';
    case 'fire': return '🔥';
    case 'medical': return '🚑';
    default: return '🚨';
  }
};

export default function MapViewComponent({ 
  incidents, 
  initialRegion,
  roadblocks = [],
  authorities = [],
  routes = []
}: MapViewComponentProps) {
  return (
    <MapView
      style={StyleSheet.absoluteFillObject}
      initialRegion={initialRegion}
      customMapStyle={[
        {
          featureType: 'poi',
          stylers: [{ visibility: 'off' }],
        },
      ]}
    >
      {/* 1. Main Incidents Markers */}
      {incidents.map((incident) => (
        <Marker
          key={incident.id}
          coordinate={incident.coordinate}
        >
          <View 
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 2,
              borderColor: 'white',
              backgroundColor: incident.severity === 'high' ? '#d71a18' : '#00f1fe', // Bright Red vs Neon Cyan
              elevation: 4,
            }}
          >
            <RNText style={{ fontSize: 14 }}>{getIncidentEmoji(incident.type)}</RNText>
          </View>
          <Callout>
            <View className="p-2 items-center min-w-[150px]">
              <RNText className="font-bold text-black text-center">{incident.title}</RNText>
              <RNText className="text-xs text-gray-500 capitalize">{incident.severity} Priority</RNText>
            </View>
          </Callout>
        </Marker>
      ))}

      {/* 2. Roadblocks Markers (🚧) */}
      {roadblocks.map((rb, idx) => (
        <Marker
          key={`roadblock_${idx}`}
          coordinate={rb.coordinate}
          pinColor="#e056fd"
        >
          <View 
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 2,
              borderColor: 'white',
              backgroundColor: '#ffb4aa', // Tertiary warning
              elevation: 4,
            }}
          >
            <RNText style={{ fontSize: 14 }}>🚧</RNText>
          </View>
          <Callout>
            <View className="p-2 min-w-[180px]">
              <RNText className="font-bold text-black">ROADBLOCK HAZARD</RNText>
              <RNText className="text-xs text-gray-700 font-semibold mt-0.5">{rb.name}</RNText>
              <RNText className="text-[10px] text-gray-500 italic mt-1 leading-relaxed">{rb.reason}</RNText>
            </View>
          </Callout>
        </Marker>
      ))}

      {/* 3. Dispatched Emergency Authorities Markers */}
      {authorities.map((auth, idx) => (
        <Marker
          key={`authority_${idx}`}
          coordinate={auth.coordinate}
        >
          <View 
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 2,
              borderColor: 'white',
              backgroundColor: '#2d5bff', // Primary container blue
              elevation: 4,
            }}
          >
            <RNText style={{ fontSize: 14 }}>{getAuthorityEmoji(auth.type)}</RNText>
          </View>
          <Callout>
            <View className="p-2 min-w-[180px]">
              <RNText className="font-bold text-black uppercase">{auth.type} DISPATCHED</RNText>
              <RNText className="text-xs text-gray-700 font-semibold mt-0.5">{auth.name}</RNText>
              <RNText className="text-[10px] text-gray-500 mt-1">Distance: {auth.distanceKm}km away</RNText>
              <RNText className="text-[10px] text-gray-500">Contact: {auth.contact}</RNText>
            </View>
          </Callout>
        </Marker>
      ))}

      {/* 4. Evacuation Path Polylines */}
      {routes.map((route, idx) => (
        <Polyline
          key={`route_${idx}`}
          coordinates={route.points}
          strokeColor="#00f1fe"
          strokeWidth={4}
          lineDashPattern={[5, 5]}
        />
      ))}
    </MapView>
  );
}
