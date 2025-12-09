
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export enum TaskType {
  VIDEO = 'VIDEO',
  ADS = 'ADS',
  WEBSITE = 'WEBSITE',
  STREAM = 'STREAM',
  OFFERWALL = 'OFFERWALL'
}

export enum WithdrawalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum PaymentMethod {
  BKASH = 'bKash',
  NAGAD = 'Nagad',
  PAYPAL = 'PayPal',
  PAYTM = 'Paytm',
  BANK = 'Bank Transfer'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  balance: number;
  pendingBalance: number;
  avatar: string;
  joinedAt: string;
  isBanned: boolean;
  tasksCompleted: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  reward: number;
  durationSeconds: number; // Anti-cheat timer duration
  url?: string;
  isActive: boolean;
  thumbnail?: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  method: PaymentMethod;
  accountDetails: string;
  status: WithdrawalStatus;
  date: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  description: string;
  date: string;
}

export interface AdNetworkConfig {
  enabled: boolean;
  bannersEnabled: boolean;
  interstitialEnabled: boolean;
  rewardedEnabled: boolean;
  appId: string;
  bannerId: string;
  interstitialId: string;
  rewardedId: string;
}

export interface PrivacyConfig {
  enabled: boolean;
  policyUrl: string;
}

export interface AppSettings {
  minWithdraw: number;
  currencySymbol: string;
  maintenanceMode: boolean;
  adMob: AdNetworkConfig;
  unityAds: AdNetworkConfig;
  privacy: PrivacyConfig;
}