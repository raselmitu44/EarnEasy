
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, Task, WithdrawalRequest, Transaction, AppSettings, 
  UserRole, WithdrawalStatus, PaymentMethod 
} from '../types';
import { INITIAL_USERS, INITIAL_TASKS, INITIAL_WITHDRAWALS, INITIAL_TRANSACTIONS } from '../constants';
import { AdSdk } from '../utils/AdSdk';

interface StoreContextType {
  currentUser: User | null;
  users: User[];
  tasks: Task[];
  withdrawals: WithdrawalRequest[];
  transactions: Transaction[];
  settings: AppSettings;
  userConsent: boolean | null; // null = not asked, true = accepted, false = rejected
  areAdsInitialized: boolean;
  
  // Actions
  login: (email: string, role: UserRole) => void;
  logout: () => void;
  completeTask: (taskId: string) => Promise<boolean>;
  requestWithdrawal: (amount: number, method: PaymentMethod, details: string) => void;
  setUserConsent: (consent: boolean) => void;
  
  // Admin Actions
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  addTask: (task: Task) => void;
  updateWithdrawalStatus: (id: string, status: WithdrawalStatus) => void;
  updateUserStatus: (userId: string, isBanned: boolean) => void;
  updateSettings: (newSettings: AppSettings) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const DEFAULT_SETTINGS: AppSettings = {
  minWithdraw: 10,
  currencySymbol: '$',
  maintenanceMode: false,
  privacy: {
    enabled: true,
    policyUrl: 'https://earneasy.com/privacy-policy'
  },
  adMob: {
    enabled: true,
    bannersEnabled: true,
    interstitialEnabled: true,
    rewardedEnabled: true,
    appId: 'ca-app-pub-4307115135436522/6053881801',
    bannerId: 'ca-app-pub-4307115135436522/7581859541',
    interstitialId: 'ca-app-pub-4307115135436522/4338966142',
    rewardedId: 'ca-app-pub-4307115135436522/6053881801'
  },
  unityAds: {
    enabled: true,
    bannersEnabled: true,
    interstitialEnabled: true,
    rewardedEnabled: true,
    appId: '6000699',
    bannerId: 'banner',
    interstitialId: 'video',
    rewardedId: 'rewardedVideo'
  }
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(INITIAL_WITHDRAWALS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [userConsent, setConsentState] = useState<boolean | null>(null);
  const [areAdsInitialized, setAreAdsInitialized] = useState(false);

  // Initialize Ads when settings or consent changes
  useEffect(() => {
    // Logic: Ads are allowed if Privacy is disabled OR if Privacy is enabled AND User has Consented.
    const privacyEnabled = settings.privacy.enabled;
    const hasGivenConsent = userConsent === true;
    
    const canInitialize = !privacyEnabled || hasGivenConsent;

    if (canInitialize) {
      if (privacyEnabled) {
          console.log("Store: 🛡️ Consent verified. Proceeding with AdSDK Init.");
      }
      AdSdk.initialize(settings).then((status) => {
        // We consider ads initialized if at least one provider is ready
        setAreAdsInitialized(status.adMob || status.unity);
      });
    } else {
      // If consent was revoked (or not yet given), mark as not initialized
      setAreAdsInitialized(false);
      if (userConsent === false) {
        console.log("Store: ⛔ Consent declined. AdSDK initialization blocked.");
      }
    }
  }, [settings, userConsent]);

  const login = (email: string, role: UserRole) => {
    // Simple simulation
    const user = users.find(u => u.email === email && u.role === role);
    if (user) {
      if (user.isBanned) {
        alert("This account has been suspended.");
        return;
      }
      setCurrentUser(user);
    } else {
      // Auto register for demo if not found (and trying to be a user)
      if (role === UserRole.USER) {
        const newUser: User = {
          id: `user-${Date.now()}`,
          name: email.split('@')[0],
          email,
          role: UserRole.USER,
          balance: 0,
          pendingBalance: 0,
          avatar: `https://picsum.photos/100/100?random=${Date.now()}`,
          joinedAt: new Date().toISOString(),
          isBanned: false,
          tasksCompleted: 0
        };
        setUsers([...users, newUser]);
        setCurrentUser(newUser);
      } else {
        alert("Admin account not found.");
      }
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const completeTask = async (taskId: string): Promise<boolean> => {
    if (!currentUser) return false;
    
    const task = tasks.find(t => t.id === taskId);
    if (!task) return false;

    // Simulate Network Delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const reward = task.reward;
    
    // Update Local User State
    const updatedUser = { 
      ...currentUser, 
      balance: currentUser.balance + reward,
      tasksCompleted: currentUser.tasksCompleted + 1
    };
    
    setCurrentUser(updatedUser);
    
    // Update Users Array
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));

    // Add Transaction Log
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      userId: currentUser.id,
      amount: reward,
      type: 'CREDIT',
      description: `Task Completed: ${task.title}`,
      date: new Date().toISOString()
    };
    setTransactions(prev => [newTx, ...prev]);

    return true;
  };

  const requestWithdrawal = (amount: number, method: PaymentMethod, details: string) => {
    if (!currentUser) return;
    if (currentUser.balance < amount) {
      alert("Insufficient balance");
      return;
    }

    const newWithdrawal: WithdrawalRequest = {
      id: `w-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      amount,
      method,
      accountDetails: details,
      status: WithdrawalStatus.PENDING,
      date: new Date().toISOString()
    };

    // Deduct from balance immediately (or move to pending)
    const updatedUser = { ...currentUser, balance: currentUser.balance - amount, pendingBalance: currentUser.pendingBalance + amount };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
    setWithdrawals(prev => [newWithdrawal, ...prev]);
  };

  // Admin Actions
  const updateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const addTask = (newTask: Task) => {
    setTasks(prev => [...prev, newTask]);
  };

  const updateWithdrawalStatus = (id: string, status: WithdrawalStatus) => {
    const withdrawal = withdrawals.find(w => w.id === id);
    if (!withdrawal) return;

    if (status === WithdrawalStatus.REJECTED) {
       // Refund user
       const user = users.find(u => u.id === withdrawal.userId);
       if (user) {
         const updatedUser = { 
           ...user, 
           balance: user.balance + withdrawal.amount,
           pendingBalance: user.pendingBalance - withdrawal.amount
         };
         setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
         // Refresh current user if it's them
         if (currentUser?.id === user.id) setCurrentUser(updatedUser);
       }
    } else if (status === WithdrawalStatus.APPROVED) {
      // Just clear pending
       const user = users.find(u => u.id === withdrawal.userId);
       if (user) {
         const updatedUser = { 
           ...user, 
           pendingBalance: user.pendingBalance - withdrawal.amount
         };
         setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
         if (currentUser?.id === user.id) setCurrentUser(updatedUser);
       }
    }

    setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status } : w));
  };

  const updateUserStatus = (userId: string, isBanned: boolean) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isBanned } : u));
  };

  const updateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
  };

  const setUserConsent = (consent: boolean) => {
    setConsentState(consent);
  };

  return (
    <StoreContext.Provider value={{
      currentUser, users, tasks, withdrawals, transactions, settings, userConsent, areAdsInitialized,
      login, logout, completeTask, requestWithdrawal, setUserConsent,
      updateTask, deleteTask, addTask, updateWithdrawalStatus, updateUserStatus, updateSettings
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};
