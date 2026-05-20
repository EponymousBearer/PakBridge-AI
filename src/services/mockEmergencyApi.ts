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

export interface MockEmergencyPlan {
  sensors: SensorReading[];
  routes: SafeRoute[];
  roadblocks: Roadblock[];
  authorities: Authority[];
  broadcast: BroadcastStats;
}

export const getMockEmergencyData = (
  category: string,
  locationName: string,
  baseLat: number,
  baseLng: number,
  severity: string
): MockEmergencyPlan => {
  const cat = category.toLowerCase();
  const loc = locationName.split(',')[0]?.trim() || 'Local';
  const parentCity = locationName.split(',')[1]?.trim() || 'Pakistan';
  
  const isHigh = severity === 'Critical' || severity === 'High';

  // 1. Dynamic Local Sensors
  let sensors: SensorReading[] = [];
  if (cat.includes('flood')) {
    sensors = [
      { name: `${loc} Drain Water Gauge`, value: isHigh ? '4.8m (Danger: >3.5m)' : '2.1m (Normal)', status: isHigh ? 'critical' : 'normal' },
      { name: 'Rainfall Intensity Node', value: isHigh ? '138mm/h' : '15mm/h', status: isHigh ? 'critical' : 'normal' },
      { name: 'Soil Saturation Grid', value: isHigh ? '92%' : '45%', status: isHigh ? 'critical' : 'normal' },
      { name: 'Sewer Overload Index', value: isHigh ? '96%' : '18%', status: isHigh ? 'critical' : 'normal' },
    ];
  } else if (cat.includes('fire')) {
    sensors = [
      { name: 'Thermal Cam Zone Spot', value: isHigh ? '295°C' : '45°C', status: isHigh ? 'critical' : 'normal' },
      { name: 'CO2 Air Quality Sensor', value: isHigh ? '890 ppm' : '380 ppm', status: isHigh ? 'critical' : 'normal' },
      { name: 'Smoke Density Analyzer', value: isHigh ? '84%' : '2%', status: isHigh ? 'critical' : 'normal' },
      { name: 'Water Line Pressure', value: isHigh ? '12 PSI (Low)' : '55 PSI', status: isHigh ? 'warn' : 'normal' },
    ];
  } else if (cat.includes('medical') || cat.includes('accident')) {
    sensors = [
      { name: 'Active Ambulances on Grid', value: '4 Patrols', status: 'normal' },
      { name: 'ER Bed Availability', value: isHigh ? '12% (Full Strain)' : '48%', status: isHigh ? 'warn' : 'normal' },
      { name: 'Traffic Delay Index', value: isHigh ? '78% (Gridlock)' : '15%', status: isHigh ? 'warn' : 'normal' },
      { name: 'Local Dispatch Wait Time', value: isHigh ? '14.5 mins' : '3.2 mins', status: isHigh ? 'warn' : 'normal' },
    ];
  } else if (cat.includes('security')) {
    sensors = [
      { name: 'Acoustic Gunfire Node', value: isHigh ? 'Alert Triggered' : 'Normal Scanning', status: isHigh ? 'critical' : 'normal' },
      { name: 'Police Radio Dispatch Queue', value: isHigh ? 'Priority 1 Active' : 'Idle', status: isHigh ? 'critical' : 'normal' },
      { name: 'Crowd Gathering Density', value: isHigh ? 'High (Est: 200+)' : 'Normal Flow', status: isHigh ? 'warn' : 'normal' },
    ];
  } else {
    sensors = [
      { name: 'Environmental Heat Sensor', value: '42°C', status: 'normal' },
      { name: 'Civilian Distress Beacons', value: isHigh ? '8 Signals' : '0 Signals', status: isHigh ? 'warn' : 'normal' },
      { name: 'Auxiliary Power Load Grid', value: '92%', status: 'warn' },
    ];
  }

  // 2. Safe Evacuation Routes (calculated from base coordinate offsets)
  let routes: SafeRoute[] = [];
  if (cat.includes('flood')) {
    routes = [
      {
        name: `Evacuation Route to High Ground`,
        path: `${loc} main bypass -> Elevated Highway`,
        points: [
          { latitude: baseLat, longitude: baseLng },
          { latitude: baseLat + 0.004, longitude: baseLng - 0.003 },
          { latitude: baseLat + 0.009, longitude: baseLng - 0.007 },
          { latitude: baseLat + 0.015, longitude: baseLng - 0.012 },
        ]
      }
    ];
  } else if (cat.includes('fire')) {
    routes = [
      {
        name: `Safe Fire Escape Sector`,
        path: `Wind-Opposing Perimeter -> Southern Safe Zone`,
        points: [
          { latitude: baseLat, longitude: baseLng },
          { latitude: baseLat - 0.003, longitude: baseLng + 0.002 },
          { latitude: baseLat - 0.007, longitude: baseLng + 0.006 },
          { latitude: baseLat - 0.011, longitude: baseLng + 0.010 },
        ]
      }
    ];
  } else {
    routes = [
      {
        name: `Optimized Ambulance Lane`,
        path: `${loc} Avenue -> Central Referral Highway`,
        points: [
          { latitude: baseLat, longitude: baseLng },
          { latitude: baseLat + 0.003, longitude: baseLng + 0.004 },
          { latitude: baseLat + 0.008, longitude: baseLng + 0.009 },
          { latitude: baseLat + 0.012, longitude: baseLng + 0.014 },
        ]
      }
    ];
  }

  // 3. Roadblocks
  let roadblocks: Roadblock[] = [];
  if (cat.includes('flood')) {
    roadblocks = [
      {
        name: `${loc} Underpass Blockage`,
        reason: 'Flooded underpass. Water height exceeding 1.2 meters.',
        coordinate: { latitude: baseLat + 0.005, longitude: baseLng + 0.004 }
      }
    ];
  } else if (cat.includes('fire')) {
    roadblocks = [
      {
        name: `${loc} Commercial Street Block`,
        reason: 'Active flame suppression. Closed for heavy fire trucks.',
        coordinate: { latitude: baseLat + 0.003, longitude: baseLng - 0.002 }
      }
    ];
  } else {
    roadblocks = [
      {
        name: `${loc} Intersection Block`,
        reason: 'Civilian accident pileup. Responders active.',
        coordinate: { latitude: baseLat - 0.004, longitude: baseLng + 0.003 }
      }
    ];
  }

  // 4. Dispatched Nearby Authorities (Hospital, Rescue, Fire Station, etc.)
  let authorities: Authority[] = [];
  if (cat.includes('flood')) {
    authorities = [
      {
        name: `Rescue 1122 Flood Rescue Depot (${parentCity})`,
        type: 'rescue',
        distanceKm: 2.4,
        contact: '1122',
        coordinate: { latitude: baseLat - 0.008, longitude: baseLng + 0.006 }
      },
      {
        name: `District HQ Hospital Trauma Unit`,
        type: 'medical',
        distanceKm: 4.1,
        contact: '021-99201300',
        coordinate: { latitude: baseLat + 0.011, longitude: baseLng - 0.010 }
      }
    ];
  } else if (cat.includes('fire')) {
    authorities = [
      {
        name: `Central Municipal Fire Brigade Station`,
        type: 'fire',
        distanceKm: 1.8,
        contact: '16',
        coordinate: { latitude: baseLat - 0.005, longitude: baseLng - 0.006 }
      },
      {
        name: `Police Mobile Unit - Sector Patrol`,
        type: 'police',
        distanceKm: 0.9,
        contact: '15',
        coordinate: { latitude: baseLat + 0.002, longitude: baseLng + 0.005 }
      }
    ];
  } else {
    authorities = [
      {
        name: `Rescue 1122 Medical Command Station`,
        type: 'rescue',
        distanceKm: 1.5,
        contact: '1122',
        coordinate: { latitude: baseLat - 0.004, longitude: baseLng - 0.003 }
      },
      {
        name: `City Police Patrol Unit`,
        type: 'police',
        distanceKm: 0.8,
        contact: '15',
        coordinate: { latitude: baseLat + 0.006, longitude: baseLng + 0.002 }
      }
    ];
  }

  // 5. Geofenced Alert Broadcast Stats
  const devicesNotified = isHigh ? Math.floor(Math.random() * 8000) + 12000 : Math.floor(Math.random() * 3000) + 1000;
  const radiusMeters = isHigh ? 2000 : 1000;
  const warningText = `Ugent Safety Alert: Active ${category} reported in your immediate vicinity (${loc}). Follow designated evacuation corridors. Roadblocks active.`;

  const broadcast: BroadcastStats = {
    radiusMeters,
    devicesNotified,
    text: warningText
  };

  return {
    sensors,
    routes,
    roadblocks,
    authorities,
    broadcast
  };
};
