import { create } from 'zustand';
import { db } from '@/services/firebaseConfig';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  orderBy, 
  getDocs,
  setDoc
} from 'firebase/firestore';

export interface SensorReading {
  name: string;
  value: string;
  status: 'normal' | 'warn' | 'critical';
}

export interface SafeRoute {
  name: string;
  path: string;
  points: { latitude: number; longitude: number }[];
}

export interface Roadblock {
  name: string;
  reason: string;
  coordinate: { latitude: number; longitude: number };
}

export interface Authority {
  name: string;
  type: 'rescue' | 'fire' | 'medical' | 'police';
  distanceKm: number;
  contact: string;
  coordinate: { latitude: number; longitude: number };
}

export interface BroadcastStats {
  radiusMeters: number;
  devicesNotified: number;
  text: string;
}

export interface CrisisReport {
  id: string;
  description: string;
  category: 'Medical' | 'Fire' | 'Flood' | 'Security' | 'Other' | 'Analyzing...';
  severity: 'Low' | 'Medium' | 'High' | 'Critical' | 'Analyzing...';
  location: {
    lat: number;
    lng: number;
    address?: string;
  } | null;
  status: 'Reported' | 'Agent Analyzing' | 'Action Planned' | 'In Progress' | 'Resolved';
  timestamp: number;
  sensorFeeds?: SensorReading[];
  safeRoutes?: SafeRoute[];
  roadblocks?: Roadblock[];
  authorities?: Authority[];
  broadcastStats?: BroadcastStats;
}

const INITIAL_REPORTS_DATA: Omit<CrisisReport, 'id'>[] = [
  {
    description: 'Neural analysis indicates rising water levels exceeding safety thresholds. Immediate evacuation recommended for low-lying sectors.',
    category: 'Flood',
    severity: 'Critical',
    location: {
      lat: 35.2227,
      lng: 72.4258,
      address: 'Swat Valley, Khyber Pakhtunkhwa'
    },
    status: 'In Progress',
    timestamp: Date.now() - 120000,
    sensorFeeds: [
      { name: 'River Swat Water Gauge', value: '4.85m (Critical Threshold: 3.5m)', status: 'critical' },
      { name: 'Rainfall Node - Kalam Basin', value: '142mm/h', status: 'critical' },
      { name: 'Basin Saturation Matrix', value: '94%', status: 'critical' },
      { name: 'Bridge CCTV Video Tag', value: 'Overtopping Risk Detected', status: 'critical' }
    ],
    safeRoutes: [
      {
        name: 'Kalam High Evacuation Line',
        path: 'Mingora Highway -> Saidu Sharif High Ridge',
        points: [
          { latitude: 35.2227, longitude: 72.4258 },
          { latitude: 35.2150, longitude: 72.4100 },
          { latitude: 35.2010, longitude: 72.3950 }
        ]
      }
    ],
    roadblocks: [
      {
        name: 'Kalam River Bridge Crossing',
        reason: 'Bridge under deck-overflow warning. High timber-drift impacts.',
        coordinate: { latitude: 35.2310, longitude: 72.4350 }
      }
    ],
    authorities: [
      {
        name: 'Rescue 1122 Swat Divisional Depot',
        type: 'rescue',
        distanceKm: 2.8,
        contact: '1122',
        coordinate: { latitude: 35.2110, longitude: 72.4150 }
      }
    ]
  },
  {
    description: 'Multiple distress signals detected in commercial zone. Rescue 1122 units dispatched.',
    category: 'Medical',
    severity: 'High',
    location: {
      lat: 31.5204,
      lng: 74.3587,
      address: 'Gulberg, Lahore, Punjab'
    },
    status: 'In Progress',
    timestamp: Date.now() - 840000,
    sensorFeeds: [
      { name: 'Active Responders on Grid', value: '4 Ambulances Active', status: 'normal' }
    ]
  }
];

interface CrisisState {
  reports: CrisisReport[];
  activeReport: CrisisReport | null;
  isLoading: boolean;
  initializeStore: () => void;
  addReport: (report: Omit<CrisisReport, 'id'> & { id?: string }) => Promise<string>;
  updateReport: (id: string, updates: Partial<CrisisReport>) => Promise<void>;
  setActiveReport: (id: string | null) => void;
}

export const useCrisisStore = create<CrisisState>((set, get) => ({
  reports: [],
  activeReport: null,
  isLoading: true,
  
  initializeStore: () => {
    const q = query(collection(db, 'crisis_reports'), orderBy('timestamp', 'desc'));
    
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      if (snapshot.empty) {
        // Seed database if empty
        for (const report of INITIAL_REPORTS_DATA) {
          await addDoc(collection(db, 'crisis_reports'), report);
        }
      } else {
        const reports = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as CrisisReport[];
        
        set({ 
          reports, 
          isLoading: false,
          activeReport: get().activeReport ? reports.find(r => r.id === get().activeReport?.id) || null : null
        });
      }
    });

    return unsubscribe;
  },

  addReport: async (report) => {
    const reportId = report.id || doc(collection(db, 'crisis_reports')).id;
    const { id, ...data } = report;
    await setDoc(doc(db, 'crisis_reports', reportId), {
      ...data,
      timestamp: Date.now()
    });
    return reportId;
  },

  updateReport: async (id, updates) => {
    const reportRef = doc(db, 'crisis_reports', id);
    await updateDoc(reportRef, updates);
  },

  setActiveReport: (id) => set((state) => ({
    activeReport: state.reports.find((r) => r.id === id) || null
  }))
}));
