import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, CheckCircle2, AlertCircle, Cpu, ShieldCheck, Compass, MessageSquare, Bot } from 'lucide-react-native';
import Animated, { FadeIn, SlideInRight, useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';
import { COLORS } from '@/constants/theme';
import { useAgentStore, AgentType } from '@/store/agentStore';
import { useCrisisStore } from '@/store/crisisStore';
import { useAppStore } from '@/store/appStore';
import { getMockEmergencyData } from '@/services/mockEmergencyApi';

const getAgentColor = (type: AgentType) => {
  switch(type) {
    case 'Retrieval': return '#2d5bff'; // Electric Blue
    case 'Crisis Detection': return '#ffb4aa'; // Neon Orange
    case 'Reasoning': return '#00f1fe'; // Neon Cyan
    case 'Simplification': return '#ddfcff'; // Soft Sky Blue
    case 'Action Execution': return '#b8c3ff'; // Light Indigo
    default: return '#2d5bff';
  }
};

const getAgentIcon = (type: AgentType, color: string) => {
  switch(type) {
    case 'Retrieval': return <Cpu color={color} size={18} />;
    case 'Crisis Detection': return <ShieldCheck color={color} size={18} />;
    case 'Reasoning': return <Bot color={color} size={18} />;
    case 'Simplification': return <MessageSquare color={color} size={18} />;
    case 'Action Execution': return <Compass color={color} size={18} />;
    default: return <Cpu color={color} size={18} />;
  }
};

export default function WorkflowScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { agentSteps, addAgentStep, updateAgentStep, resetAgentWorkflow } = useAgentStore();
  const { reports, updateReport } = useCrisisStore();
  const { language } = useAppStore();
  
  const report = reports.find(r => r.id === id);
  const pulseAnim = useSharedValue(1);

  useEffect(() => {
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 1000 }),
        withTiming(1.0, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  useEffect(() => {
    if (!report) return;
    
    resetAgentWorkflow();

    const sequence = async () => {
      try {
        const addressParts = report.location?.address ? report.location.address.split(',') : ['Lahore', 'Punjab'];
        const areaName = addressParts[0]?.trim() || 'Lahore';
        const cityName = addressParts.length > 2 ? addressParts[1]?.trim() : areaName;
        const provinceName = addressParts.length > 2 ? addressParts[2]?.trim() : (addressParts[1]?.trim() || 'Punjab');
        const displayLocation = addressParts.length > 2 ? `${areaName}, ${cityName}` : areaName;

        const desc = report.description.toLowerCase();
        let guessedCategory = 'Other';
        if (desc.includes('flood') || desc.includes('water') || desc.includes('paani') || desc.includes('sailab') || desc.includes('baarnish') || desc.includes('rain')) {
          guessedCategory = 'Flood';
        } else if (desc.includes('fire') || desc.includes('aag') || desc.includes('smoke') || desc.includes('dhuwan') || desc.includes('blast') || desc.includes('explosion')) {
          guessedCategory = 'Fire';
        } else if (desc.includes('medical') || desc.includes('accident') || desc.includes('hadiqa') || desc.includes('chot') || desc.includes('blood') || desc.includes('ambulance')) {
          guessedCategory = 'Medical';
        } else if (desc.includes('security') || desc.includes('chor') || desc.includes('daku') || desc.includes('firing') || desc.includes('gun') || desc.includes('fight') || desc.includes('robbery')) {
          guessedCategory = 'Security';
        }

        const baseLat = report.location?.lat || 31.5204;
        const baseLng = report.location?.lng || 74.3587;
        const baseSeverity = report.severity === 'Analyzing...' ? 'High' : report.severity;

        // Generate hyper-localized operational and sensor details from Mock API
        const mockData = getMockEmergencyData(
          guessedCategory,
          report.location?.address || `${areaName}, ${cityName}`,
          baseLat,
          baseLng,
          baseSeverity
        );

        // 1. Retrieval Agent
        const step1Id = 'step_1';
        addAgentStep({ id: step1Id, type: 'Retrieval', status: 'running', output: `Scanning localized telemetry and IoT sensors in ${displayLocation}...`, timestamp: Date.now() });
        await new Promise(r => setTimeout(r, 1500));

        let sensorLog = mockData.sensors.map(s => `\n   • ${s.name}: ${s.value}`).join('');
        let retrievalOutput = `Telemetry gathered: Connected to localized municipal IoT nodes in ${displayLocation}.${sensorLog}`;

        updateAgentStep(step1Id, 'completed', retrievalOutput);

        // 2. Crisis Detection Agent
        const step2Id = 'step_2';
        addAgentStep({ id: step2Id, type: 'Crisis Detection', status: 'running', output: 'Triggering threat scoring & severity validation...', timestamp: Date.now() });
        
        const { analyzeCrisis } = require('@/services/geminiService');
        const analysis = await analyzeCrisis(report.description);
        
        updateAgentStep(step2Id, 'completed', `Severity evaluated: ${analysis.severity.toUpperCase()}. Standard Classification: ${analysis.category}.`);
        updateReport(report.id, { category: analysis.category, severity: analysis.severity, status: 'Agent Analyzing' });

        // 3. Reasoning Agent
        const step3Id = 'step_3';
        addAgentStep({ id: step3Id, type: 'Reasoning', status: 'running', output: 'Mapping safe corridors and localized roadblock obstacles...', timestamp: Date.now() });
        await new Promise(r => setTimeout(r, 1500));

        let roadblockLog = mockData.roadblocks.map(rb => `${rb.name} (${rb.reason})`).join(', ');
        let reasoningOutput = `Operational Planning Complete!\n• Evacuation Corridor: ${mockData.routes[0].path}\n• Active Roadblock Hazards: ${roadblockLog}\n• Action Items: ${analysis.actionPlan}`;

        updateAgentStep(step3Id, 'completed', reasoningOutput);
        updateReport(report.id, { status: 'Action Planned' });

        // 4. Simplification Agent
        const step4Id = 'step_4';
        addAgentStep({ id: step4Id, type: 'Simplification', status: 'running', output: `Translating technical checklists to ${language}...`, timestamp: Date.now() });
        await new Promise(r => setTimeout(r, 1200));
        
        let translated = analysis.userInstructionEnglish;
        if (language === 'Urdu') translated = analysis.userInstructionUrdu;
        if (language === 'Roman Urdu') translated = analysis.userInstructionRomanUrdu;
        
        updateAgentStep(step4Id, 'completed', `Citizen Advisories (${language}): "${translated}"`);

        // 5. Action Execution Agent
        const step5Id = 'step_5';
        addAgentStep({ id: step5Id, type: 'Action Execution', status: 'running', output: `Dispatches triggered. Sending local warnings...`, timestamp: Date.now() });
        await new Promise(r => setTimeout(r, 1500));

        let authorityLog = mockData.authorities.map(a => `\n   • ${a.name} (Contact: ${a.contact}, Response Dist: ${a.distanceKm}km)`).join('');
        let executionOutput = `Dispatches Successful!\n• Municipal Responders Mobilized:${authorityLog}\n• Geo-Fenced Alert Broadcast: Dispatched cellular danger warnings to ${mockData.broadcast.devicesNotified} mobile devices inside a ${mockData.broadcast.radiusMeters}m geofence around the incident zone. Neighbors alerted successfully!`;

        updateAgentStep(step5Id, 'completed', executionOutput);
        
        // Save the high-fidelity mock metrics back to the state report for mapping visualization
        updateReport(report.id, { 
          status: 'In Progress',
          sensorFeeds: mockData.sensors,
          safeRoutes: mockData.routes,
          roadblocks: mockData.roadblocks,
          authorities: mockData.authorities,
          broadcastStats: mockData.broadcast
        });
      } catch (error: any) {
        console.error(error);
        addAgentStep({ id: 'error', type: 'Reasoning', status: 'error', output: `Error: ${error.message}`, timestamp: Date.now() });
      }
    };

    sequence();
  }, [id]);

  if (!report) {
    return (
      <View className="flex-1 items-center justify-center bg-surface-container-lowest">
        <Text className="text-on-surface font-semibold mb-3">Report telemetry not found.</Text>
        <TouchableOpacity onPress={() => router.back()} className="p-3 bg-primary-container rounded-xl">
          <Text className="text-on-primary-container font-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface-container-lowest">
      {/* Header */}
      <View className="px-6 py-4 border-b border-white/10 flex-row items-center bg-surface/80">
        <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 bg-white/5 border border-white/10 rounded-full">
          <ArrowLeft size={18} color="#dfe2f3" />
        </TouchableOpacity>
        <View>
          <Text className="text-title-md font-bold text-on-surface">Agent Orchestration</Text>
          <Text className="text-label-sm text-secondary-container font-semibold uppercase tracking-wider">Multi-Agent Workflow Simulation</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 py-6" contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Original Input Banner */}
        <Animated.View entering={FadeIn.delay(100)}>
          <View className="bg-surface-container border border-white/10 p-5 rounded-xl mb-8">
            <Text className="text-label-sm text-on-surface-variant font-bold uppercase tracking-wider mb-2">Original Incident Log</Text>
            <Text className="text-body-md text-on-surface italic leading-relaxed">"{report.description}"</Text>
          </View>
        </Animated.View>

        <Text className="text-title-md font-bold text-on-surface mb-6">Workflow Operations Pipeline</Text>

        {/* Timeline Pipeline */}
        <View className="pl-6 border-l border-white/10 ml-3">
          {agentSteps.map((step, index) => {
            const agentColor = getAgentColor(step.type);
            const isRunning = step.status === 'running';
            const isCompleted = step.status === 'completed';

            return (
              <Animated.View 
                key={step.id} 
                entering={SlideInRight.delay(100)}
              >
                <View className="mb-8 relative">
                  {/* Timeline Dot Indicator */}
                  <View className="absolute -left-[35px] top-1 w-6 h-6 rounded-full bg-surface-container-lowest items-center justify-center border border-white/10">
                    {isRunning ? (
                      <Animated.View style={[pulseStyle, { backgroundColor: agentColor, width: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }]}>
                        <ActivityIndicator size="small" color="#0a0e1a" />
                      </Animated.View>
                    ) : (
                      <View className="w-4 h-4 rounded-full items-center justify-center" style={{ backgroundColor: isCompleted ? '#00c853' : agentColor }}>
                        {isCompleted ? <CheckCircle2 size={12} color="#0a0e1a" /> : <AlertCircle size={12} color="#0a0e1a" />}
                      </View>
                    )}
                  </View>

                  {/* Glass Card Container */}
                  {isRunning ? (
                    <View 
                      key={`${step.id}_running`}
                      className="p-5 rounded-xl border bg-surface-container border-secondary-container/30"
                      style={{
                        shadowColor: agentColor,
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.15,
                        shadowRadius: 8,
                        elevation: 4,
                      }}
                    >
                      <View className="flex-row items-center gap-2 mb-3">
                        <View className="p-1.5 rounded bg-white/5 border border-white/10">
                          {getAgentIcon(step.type, agentColor)}
                        </View>
                        <Text className="font-bold text-sm uppercase tracking-wider" style={{ color: agentColor }}>
                          {step.type} Agent
                        </Text>
                      </View>
                      
                      <Text className="text-sm leading-relaxed text-on-surface italic">
                        {step.output}
                      </Text>
                    </View>
                  ) : (
                    <View 
                      key={`${step.id}_completed`}
                      className="p-5 rounded-xl border bg-surface-container/60 border-white/10"
                    >
                      <View className="flex-row items-center gap-2 mb-3">
                        <View className="p-1.5 rounded bg-white/5 border border-white/10">
                          {getAgentIcon(step.type, agentColor)}
                        </View>
                        <Text className="font-bold text-sm uppercase tracking-wider" style={{ color: agentColor }}>
                          {step.type} Agent
                        </Text>
                        {isCompleted && (
                          <View className="ml-auto bg-[#00c853]/20 border border-[#00c853]/30 px-2 py-0.5 rounded">
                            <Text className="text-[10px] text-[#00c853] font-bold uppercase tracking-wider">ONLINE</Text>
                          </View>
                        )}
                      </View>
                      
                      <Text className="text-sm leading-relaxed text-on-surface-variant">
                        {step.output}
                      </Text>
                    </View>
                  )}
                </View>
              </Animated.View>
            );
          })}
        </View>
        
        {/* Navigation back to analytics */}
        {agentSteps.length === 5 && agentSteps[4].status === 'completed' && (
          <Animated.View entering={FadeIn.delay(400)}>
            <View className="mt-8">
              <TouchableOpacity 
                className="bg-primary-container py-4 rounded-xl items-center shadow-lg gap-2"
                onPress={() => {
                  router.dismissAll();
                  router.replace('/dashboard');
                }}
              >
                <Text className="text-on-primary-container font-bold text-base uppercase tracking-wider">Launch Impact analytics</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
