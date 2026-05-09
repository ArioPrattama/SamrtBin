export interface Bin {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  fillLevel: number;
  capacity: number;
  lastCollected: string;
  status: "full" | "medium" | "normal";
  batteryLevel: number;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  category: string;
  image: string;
  stock: number;
  validUntil: string;
}

export interface Transaction {
  id: string;
  binId?: string;
  binName?: string;
  rewardName?: string;
  points: number;
  timestamp: string;
  type: "earn" | "redeem";
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: "user" | "admin";
  ecoPoints: number;
  createdAt: string;
}

export interface ScanResult {
  success: boolean;
  binId: string;
  binName: string;
  pointsEarned: number;
  message: string;
}
