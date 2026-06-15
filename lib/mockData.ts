export interface Incident {
  id: string;
  title: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  location: string;
  coords: string;
  teams: number;
  rescued: number;
  timestamp: string;
  status: "ACTIVE" | "MONITORING" | "CONTAINED";
}

export const INCIDENTS: Incident[] = [
  { id: "INC-2847", title: "7.4M Earthquake - Eastern Turkey", severity: "CRITICAL", location: "Kahramanmaraş, Turkey", coords: "37.5°N 36.9°E", teams: 12, rescued: 847, timestamp: "T+02:14", status: "ACTIVE" },
  { id: "INC-2846", title: "Category 5 Cyclone Landfall", severity: "CRITICAL", location: "Odisha Coast, India", coords: "20.1°N 86.8°E", teams: 8, rescued: 312, timestamp: "T+05:47", status: "ACTIVE" },
  { id: "INC-2845", title: "Flash Flood - Rhine Valley", severity: "HIGH", location: "Koblenz, Germany", coords: "50.3°N 7.5°E", teams: 5, rescued: 128, timestamp: "T+08:22", status: "ACTIVE" },
  { id: "INC-2844", title: "Wildfire Complex - 40,000 Acres", severity: "HIGH", location: "Northern California, USA", coords: "39.7°N 122.1°W", teams: 6, rescued: 2100, timestamp: "T+11:30", status: "ACTIVE" },
  { id: "INC-2843", title: "Volcanic Eruption Evacuation", severity: "HIGH", location: "Reykjanes, Iceland", coords: "63.8°N 22.5°W", teams: 4, rescued: 540, timestamp: "T+14:05", status: "MONITORING" },
  { id: "INC-2842", title: "Tsunami Warning - Pacific Coast", severity: "MEDIUM", location: "Northern Japan", coords: "38.2°N 142.4°E", teams: 9, rescued: 3200, timestamp: "T+18:44", status: "MONITORING" },
  { id: "INC-2841", title: "Building Collapse - 6 Stories", severity: "MEDIUM", location: "Cairo, Egypt", coords: "30.0°N 31.2°E", teams: 3, rescued: 47, timestamp: "T+22:10", status: "MONITORING" },
  { id: "INC-2840", title: "Chemical Plant Explosion", severity: "HIGH", location: "Houston, Texas, USA", coords: "29.7°N 95.3°W", teams: 7, rescued: 680, timestamp: "T+26:33", status: "CONTAINED" },
];

export interface CommsMessage {
  time: string;
  freq: string;
  team: string;
  message: string;
}

export const COMMS_FEED: CommsMessage[] = [
  { time: "14:22:07", freq: "156.8 MHz", team: "ALPHA-7", message: "Sector 4 clear. Moving to grid reference Delta-9. Over." },
  { time: "14:21:44", freq: "121.5 MHz", team: "BRAVO-3", message: "Requesting additional medics. 14 survivors located in basement. Critical injuries. Over." },
  { time: "14:21:02", freq: "156.8 MHz", team: "COMMAND", message: "BRAVO-3, medical unit ETA 8 minutes. Hold position. Over." },
  { time: "14:20:38", freq: "243.0 MHz", team: "DELTA-2", message: "Helicopter ECHO-1 inbound with supplies. LZ is clear at coordinates provided." },
  { time: "14:20:15", freq: "156.8 MHz", team: "ALPHA-7", message: "Structural instability in Block C. Do not enter. Repeat: do not enter Block C." },
  { time: "14:19:50", freq: "121.5 MHz", team: "MEDIC-1", message: "Three critical patients stabilized. Preparing for airlift to Ankara General." },
  { time: "14:19:22", freq: "156.8 MHz", team: "COMMAND", message: "All units: aftershock magnitude 4.2 expected in next 30 minutes. Take cover protocol." },
  { time: "14:18:55", freq: "243.0 MHz", team: "FOXTROT-4", message: "Water supply secured. Distribution to Camp Bravo commencing in 10 minutes." },
  { time: "14:18:30", freq: "156.8 MHz", team: "SIERRA-5", message: "Deploying sonar scanners at Block B. Checking for signs of life. Over." },
  { time: "14:18:05", freq: "121.5 MHz", team: "MEDIC-2", message: "Field hospital Alpha-B at full capacity. Redirecting non-critical to Bravo. Over." },
  { time: "14:17:40", freq: "243.0 MHz", team: "AIR-SUP-1", message: "Drop zone Bravo-9 is compromised. Winds exceeding 45 knots. Re-routing. Over." },
  { time: "14:17:15", freq: "156.8 MHz", team: "K9-UNIT-3", message: "K9 team has positive alert in sector 1-A. Excavation team requested. Over." },
  { time: "14:16:50", freq: "121.5 MHz", team: "COMMAND", message: "All units, severe weather warning in effect. High winds expected. Secure all loose gear." },
  { time: "14:16:22", freq: "243.0 MHz", team: "HAZMAT-1", message: "Gas line isolated at Houston plant. Air quality index returning to baseline. Over." },
  { time: "14:15:55", freq: "156.8 MHz", team: "DELTA-2", message: "Supply drops successfully retrieved. Standard distribution protocol active. Over." },
];

export interface ResourceItem {
  total: number;
  deployed: number;
  label: string;
}

export interface Resources {
  helicopters: ResourceItem;
  medics: ResourceItem;
  vehicles: ResourceItem;
  shelters: ResourceItem;
  pallets: ResourceItem;
  boats: ResourceItem;
}

export const RESOURCES: Resources = {
  helicopters: { total: 24, deployed: 19, label: "Helicopters" },
  medics: { total: 340, deployed: 287, label: "Medic Teams" },
  vehicles: { total: 156, deployed: 134, label: "Ground Units" },
  shelters: { total: 48, deployed: 41, label: "Emergency Shelters" },
  pallets: { total: 2400, deployed: 1876, label: "Aid Pallets" },
  boats: { total: 32, deployed: 28, label: "Rescue Boats" },
};

export interface Stats {
  rescued: number;
  teams: number;
  zones: number;
  responseTime: string;
}

export const STATS: Stats = {
  rescued: 7854,
  teams: 54,
  zones: 8,
  responseTime: "4.2 min",
};

export const TICKER_ALERTS: string[] = [
  "INC-2847 CRITICAL: Search operation expanded to sector 7",
  "INC-2846: Cyclone VARUNA category downgraded to 4",
  "INC-2844: Air support authorized — 3 additional tankers deployed",
  "INC-2845: 128 survivors evacuated to temporary shelter",
  "WEATHER: 72-hour forecast issued for all active zones",
  "RESOURCE: Medical supply convoy ETA Ankara 14:45 UTC",
  "INC-2843: Volcanic activity intensifying — exclusion zone expanded to 8km",
];

export interface TimelineEvent {
  time: string;
  event: string;
  desc: string;
  icon: string;
}

export const CRISIS_TIMELINE: TimelineEvent[] = [
  { time: "T+0:00", event: "Seismic Alert Triggered", desc: "Magnitude 7.4 detected. Automated SENTINEL alert broadcast to all regional units.", icon: "AlertTriangle" },
  { time: "T+0:08", event: "Command Center Activated", desc: "SENTINEL Ops Center at full capacity. 54 teams placed on standby.", icon: "Radio" },
  { time: "T+1:30", event: "First Responders Deployed", desc: "12 ground teams and 4 helicopters dispatched to epicenter coordinates.", icon: "Truck" },
  { time: "T+4:00", event: "Survivor Contact Made", desc: "First radio contact. 47 survivors confirmed. Medical triage begins at LZ Bravo.", icon: "HeartPulse" },
  { time: "T+8:00", event: "International Aid Arrives", desc: "UN rapid response teams land. 24 nations contributing resources.", icon: "Plane" },
  { time: "T+24:00", event: "Major Operations Complete", desc: "2,847 survivors rescued. All missing person protocols active for remaining 140.", icon: "ShieldCheck" },
];

export interface Hotspot {
  lat: number;
  lng: number;
  severity: "critical" | "high" | "medium";
  id: string;
}

export const HOTSPOT_COORDS: Hotspot[] = [
  { lat: 37.5, lng: 36.9, severity: "critical", id: "INC-2847" },
  { lat: 20.1, lng: 86.8, severity: "critical", id: "INC-2846" },
  { lat: 50.3, lng: 7.5, severity: "high", id: "INC-2845" },
  { lat: 39.7, lng: -122.1, severity: "high", id: "INC-2844" },
  { lat: 63.8, lng: -22.5, severity: "high", id: "INC-2843" },
  { lat: 38.2, lng: 142.4, severity: "medium", id: "INC-2842" },
  { lat: 30.0, lng: 31.2, severity: "medium", id: "INC-2841" },
  { lat: 29.7, lng: -95.3, severity: "high", id: "INC-2840" },
];
