// Auth Types
export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  kycStatus: string;
  profileImage?: string;
}

// Poll Types
export interface Poll {
  id: string;
  question: string;
  description?: string;
  category: string;
  endDate: string;
  status: 'active' | 'completed' | 'cancelled';
  totalVolume: number;
  yesPrice: number;
  noPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface PollOption {
  id: string;
  pollId: string;
  type: 'yes' | 'no';
  currentPrice: number;
  totalVolume: number;
}

// Bid Types
export interface Bid {
  id: string;
  pollId: string;
  optionId: string;
  userId: string;
  amount: number;
  price: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

// Wallet Types
export interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'bid' | 'payout';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  description?: string;
}

// Market Display Types
export interface MarketDisplay {
  id: string;
  category: string;
  categoryColor: string;
  changePercent: string;
  question: string;
  yesPrice: string;
  noPrice: string;
  volume: string;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'bid' | 'poll' | 'wallet' | 'system';
  read: boolean;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Navigation Types
export type RootStackParamList = {
  Auth: undefined;
  Login: undefined;
  Register: undefined;
  Main: undefined;
  Home: undefined;
  Polls: undefined;
  Portfolio: undefined;
  Wallet: undefined;
  Profile: undefined;
};

