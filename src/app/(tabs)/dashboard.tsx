import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, DimensionValue } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, Cpu, Users, Zap, ShieldAlert, Clock, ChevronRight } from 'lucide-react-native';
import Animated, { FadeInUp, FadeInRight, useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';
import { useCrisisStore, CrisisReport } from '@/store/crisisStore';

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

const getLocalLives = (r: CrisisReport) => {
  if (r.id === 'seed_1') return 1240;
  if (r.id === 'seed_2') return 342;
  if (r.id === 'seed_3') return 85;
  
  // Custom reports
  const seed = parseInt(r.id.replace(/\D/g, '')) || 42;
  const sev = r.severity;
  if (sev === 'Critical') return (seed % 80) + 120;
  if (sev === 'High') return (seed % 40) + 50;
  if (sev === 'Medium') return (seed % 20) + 15;
  return (seed % 10) + 5;
};

const getReportLatency = (r: CrisisReport) => {
  if (r.id === 'seed_1') return '0.74';
  if (r.id === 'seed_2') return '0.82';
  if (r.id === 'seed_3') return '0.68';
  
  const seed = parseInt(r.id.replace(/\D/g, '')) || 42;
  return (0.55 + (seed % 25) * 0.01).toFixed(2);
};

const getManualMinutes = (r: CrisisReport) => {
  const sev = r.severity;
  if (sev === 'Critical') return 15.4;
  if (sev === 'High') return 12.5;
  if (sev === 'Medium') return 8.2;
  return 6.5;
};

const getNeuralLoad = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('flood')) {
    return { retrieval: 42, detection: 28, reasoning: 18, execution: 12 };
  }
  if (cat.includes('fire')) {
    return { retrieval: 20, detection: 45, reasoning: 15, execution: 20 };
  }
  if (cat.includes('medical') || cat.includes('accident')) {
    return { retrieval: 25, detection: 15, reasoning: 35, execution: 25 };
  }
  if (cat.includes('security')) {
    return { retrieval: 30, detection: 35, reasoning: 15, execution: 20 };
  }
  return { retrieval: 25, detection: 25, reasoning: 25, execution: 25 };
};

const getCategoryEmoji = (category: string): string => {
  const cat = category.toLowerCase();
  if (cat.includes('flood')) return '🌊';
  if (cat.includes('fire')) return '🔥';
  if (cat.includes('medical') || cat.includes('accident')) return '🚑';
  if (cat.includes('security')) return '🛡️';
  if (cat.includes('analyzing')) return '⚙️';
  return '⚠️';
};

export default function DashboardScreen() {
  const { reports } = useCrisisStore();
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  // Set active focus report
  const activeReport = reports.find(r => r.id === selectedReportId) || (reports.length > 0 ? reports[0] : null);

  if (!activeReport) {
    return (
      <SafeAreaView className="flex-1 bg-surface-container-lowest justify-center items-center">
        <Text className="text-on-surface text-base">No active crisis telemetry available.</Text>
      </SafeAreaView>
    );
  }

  // 1. Dynamic platform metrics
  const totalLivesAssisted = (44258 + reports.reduce((sum, r) => sum + getLocalLives(r), 0)).toLocaleString();
  const avgLatency = (reports.reduce((sum, r) => sum + parseFloat(getReportLatency(r)), 0) / reports.length).toFixed(2);

  // Focus metrics
  const focusLocalLives = getLocalLives(activeReport);
  const focusLatency = getReportLatency(activeReport);
  const focusManualMinutes = getManualMinutes(activeReport);
  const focusArea = activeReport.location?.address?.split(',')[0] || 'Local';
  const focusCity = activeReport.location?.address?.split(',')[1]?.trim() || focusArea;

  // 2. Dynamic agent workloads
  const loads = getNeuralLoad(activeReport.category);
  const agentMetrics = [
    { name: 'Retrieval Agent', value: `${loads.retrieval}%`, color: 'bg-agent-retrieval', details: 'Scrapes live IoT & feeds' },
    { name: 'Detection Agent', value: `${loads.detection}%`, color: 'bg-agent-detection', details: 'Tags computer vision anomalies' },
    { name: 'Reasoning Agent', value: `${loads.reasoning}%`, color: 'bg-agent-reasoning', details: 'Generates crisis steps & routes' },
    { name: 'Execution Agent', value: `${loads.execution}%`, color: 'bg-agent-execution', details: 'Notifies civil response nodes' }
  ];

  // 3. Dynamic Regional Risk Matrix
  const provinces = [
    { name: 'Khyber Pakhtunkhwa', baseline: 35, defaultStatus: 'Critical Alerts', defaultScore: 58, defaultColor: 'text-error' },
    { name: 'Sindh', baseline: 12, defaultStatus: 'Heatwave Alert', defaultScore: 21, defaultColor: 'text-tertiary' },
    { name: 'Punjab', baseline: 6, defaultStatus: 'Normal Scan', defaultScore: 8, defaultColor: 'text-secondary-container' },
    { name: 'Balochistan', baseline: 3, defaultStatus: 'Normal Scan', defaultScore: 4, defaultColor: 'text-secondary-container' },
    { name: 'Gilgit-Baltistan', baseline: 3, defaultStatus: 'Normal Scan', defaultScore: 4, defaultColor: 'text-secondary-container' },
    { name: 'Capital Territory', baseline: 3, defaultStatus: 'Normal Scan', defaultScore: 4, defaultColor: 'text-secondary-container' },
  ];

  const provinceDetails = provinces.map(prov => {
    // Calculate risk score modifications using active reports matching this province
    const provReports = reports.filter(r => r.id !== 'seed_1' && r.id !== 'seed_2' && r.id !== 'seed_3' && getProvinceFromAddress(r.location?.address) === prov.name);
    
    let score = prov.defaultScore;
    let status = prov.defaultStatus;
    let color = prov.defaultColor;
    
    if (provReports.length > 0) {
      const severities = provReports.map(r => r.severity);
      if (severities.includes('Critical')) {
        status = 'Critical Alerts';
        color = 'text-error';
        score = prov.defaultScore + 25 + provReports.length * 10;
      } else if (severities.includes('High')) {
        status = 'High Risk Alert';
        color = 'text-tertiary';
        score = prov.defaultScore + 15 + provReports.length * 8;
      } else if (severities.includes('Medium')) {
        status = 'Moderate Alert';
        color = 'text-primary';
        score = prov.defaultScore + 8 + provReports.length * 5;
      } else {
        status = 'Minor Incidents';
        color = 'text-secondary-container';
        score = prov.defaultScore + 4 + provReports.length * 3;
      }
    }
    
    return { name: prov.name, score, status, color };
  });

  const totalScore = provinceDetails.reduce((sum, p) => sum + p.score, 0);
  const provinceMatrix = provinceDetails
    .map(p => ({
      region: p.name,
      pct: `${Math.round((p.score / totalScore) * 100)}%`,
      status: p.status,
      color: p.color
    }))
    .sort((a, b) => parseInt(b.pct) - parseInt(a.pct));

  return (
    <SafeAreaView className="flex-1 bg-surface-container-lowest">
      {/* Custom Header */}
      <View className="h-16 border-b border-white/10 px-6 flex-row justify-between items-center bg-surface/80">
        <View>
          <Text className="text-title-md font-bold text-on-surface">Crisis Analytics</Text>
          <Text className="text-label-sm text-secondary-container uppercase tracking-wider font-semibold">Real-Time Core Metrics</Text>
        </View>
        <View className="flex-row items-center bg-white/5 border border-white/10 px-3 py-1.5 rounded-full gap-2">
          <Zap size={14} color="#00f1fe" />
          <Text className="text-xs text-on-surface font-semibold">Live Feed</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingVertical: 24 }} showsVerticalScrollIndicator={false}>
        {/* Incident Selector */}
        <Text className="text-label-sm text-on-surface-variant font-bold uppercase tracking-wider mb-3">Simulation Focus Incident</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6 -mx-6 px-6">
          <View className="flex-row gap-3 pr-12">
            {reports.map((r) => {
              const isActive = r.id === activeReport.id;
              const locationName = r.location?.address?.split(',')[0] || 'Pakistan';
              const emoji = getCategoryEmoji(r.category);
              return (
                <TouchableOpacity
                  key={r.id}
                  onPress={() => setSelectedReportId(r.id)}
                  className={`px-4 py-3 rounded-xl border flex-row items-center gap-2 ${
                    isActive 
                      ? 'bg-secondary-container border-secondary-container' 
                      : 'bg-surface-container border-white/10'
                  }`}
                >
                  <Text className="text-xs">{emoji}</Text>
                  <Text className={`text-xs font-bold ${isActive ? 'text-black font-semibold' : 'text-on-surface'}`}>
                    {r.category === 'Analyzing...' ? 'NEW SIGNAL' : r.category}
                  </Text>
                  <Text className={`text-xs ${isActive ? 'text-black/75' : 'text-on-surface-variant'}`}>
                    • {locationName}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Core Stats Overview */}
        <Animated.View entering={FadeInUp.delay(100)} className="flex-row flex-wrap gap-4 mb-6">
          {/* Card 1 */}
          <View className="flex-1 bg-surface-container border border-white/10 p-4 rounded-xl min-w-[45%]">
            <Users color="#00f1fe" size={24} className="mb-2" />
            <Text className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Lives Assisted</Text>
            <Text className="text-headline-sm font-bold text-on-surface mb-1">{totalLivesAssisted}</Text>
            <View className="flex-row items-center gap-1">
              <TrendingUp size={14} color="#00c853" />
              <Text className="text-[11px] text-[#00c853] font-semibold">+{focusLocalLives} in {focusArea}</Text>
            </View>
          </View>

          {/* Card 2 */}
          <View className="flex-1 bg-surface-container border border-white/10 p-4 rounded-xl min-w-[45%]">
            <Clock color="#2d5bff" size={24} className="mb-2" />
            <Text className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Response Latency</Text>
            <Text className="text-headline-sm font-bold text-on-surface mb-1">{avgLatency}s</Text>
            <View className="flex-row items-center gap-1">
              <Text className="text-[11px] text-secondary-container font-semibold">Avg platform neural speed</Text>
            </View>
          </View>
        </Animated.View>

        {/* Impact Analytics */}
        <Text className="text-title-md font-bold text-on-surface mb-3">Before vs After AI</Text>
        <Animated.View entering={FadeInUp.delay(200)} className="bg-surface-container border border-white/10 rounded-xl p-5 mb-6">
          <Text className="text-body-md font-bold text-on-surface mb-2">Evacuation & Dispatch Latency</Text>
          <Text className="text-xs text-on-surface-variant mb-4 leading-relaxed">
            By automating drone feed scraping, threat-scoring via Gemini Pro, and municipal dispatch, PakBridge AI routed responders to <Text className="font-bold text-on-surface">{focusArea}, {focusCity}</Text> in <Text className="font-bold text-secondary-container">{focusLatency}s</Text> instead of the historical <Text className="font-bold text-tertiary-container">{focusManualMinutes} minutes</Text> of manual radio handoffs.
          </Text>
          
          <View className="mb-4">
            <View className="flex-row justify-between mb-1">
              <Text className="text-xs text-on-surface-variant">Manual Dispatch & Triage ({focusArea})</Text>
              <Text className="text-xs font-semibold text-tertiary-container">{focusManualMinutes} minutes</Text>
            </View>
            <View className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <View className="h-full bg-tertiary-container w-[85%]" />
            </View>
          </View>

          <View>
            <View className="flex-row justify-between mb-1">
              <Text className="text-xs text-on-surface-variant">PakBridge Neural Coordination ({focusArea})</Text>
              <Text className="text-xs font-semibold text-secondary-container">{focusLatency} seconds</Text>
            </View>
            <View className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <View className="h-full bg-secondary-container w-[10%]" />
            </View>
          </View>
        </Animated.View>

        {/* Sub-Agent Workload */}
        <Text className="text-title-md font-bold text-on-surface mb-3">Sub-Agent Neural Load</Text>
        <Animated.View entering={FadeInUp.delay(300)} className="bg-surface-container border border-white/10 rounded-xl p-5 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-body-md font-bold text-on-surface">Throughput Allocation</Text>
            <View className="px-2 py-0.5 rounded bg-white/5 border border-white/10">
              <Text className="text-[10px] text-secondary-container font-semibold uppercase">{activeReport.category} MODE</Text>
            </View>
          </View>
          
          <View className="gap-4">
            {agentMetrics.map((agent, index) => (
              <View key={index} className="flex-row items-center gap-3">
                <View className={`w-3 h-3 rounded-full ${agent.color}`} />
                <View className="flex-1">
                  <View className="flex-row justify-between items-center mb-1">
                    <Text className="text-xs font-semibold text-on-surface">{agent.name}</Text>
                    <Text className="text-xs font-bold text-on-surface">{agent.value}</Text>
                  </View>
                  <Text className="text-[10px] text-on-surface-variant mb-1">{agent.details}</Text>
                  <View className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <View className={`h-full ${agent.color} rounded-full`} style={{ width: agent.value as DimensionValue }} />
                  </View>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Regional Crisis Load */}
        <Text className="text-title-md font-bold text-on-surface mb-3">Regional Risk Matrix</Text>
        <Animated.View entering={FadeInUp.delay(400)} className="bg-surface-container border border-white/10 rounded-xl p-5 mb-6">
          <View className="gap-3">
            {provinceMatrix.map((reg, idx) => (
              <View key={idx} className="flex-row justify-between items-center py-2 border-b border-white/5 last:border-0">
                <View className="flex-row items-center gap-2">
                  <View className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  <View>
                    <Text className="text-xs font-semibold text-on-surface">{reg.region}</Text>
                    <Text className={`text-[10px] font-semibold ${reg.color}`}>{reg.status}</Text>
                  </View>
                </View>
                <Text className="text-sm font-bold text-on-surface">{reg.pct}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Footer spacer */}
        <View className="h-16" />
      </ScrollView>
    </SafeAreaView>
  );
}

