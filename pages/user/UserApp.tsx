
import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Task, TaskType, PaymentMethod } from '../../types';
import { Card, Button, Badge, Modal, Input, Select } from '../../components/Shared';
import AdOverlay, { AdProvider, BannerAd } from '../../components/AdOverlay';
import ConsentModal from '../../components/ConsentModal';
import { 
  Home, PlayCircle, Wallet, User as UserIcon, LogOut, 
  DollarSign, AlertCircle, Smartphone 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function UserApp() {
  const { 
    currentUser, tasks, completeTask, withdrawals, transactions, 
    requestWithdrawal, logout, settings, userConsent, setUserConsent, areAdsInitialized 
  } = useStore();
  const [activeTab, setActiveTab] = useState<'home' | 'tasks' | 'wallet' | 'profile'>('home');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskTimer, setTaskTimer] = useState(0);
  const [isTaskActive, setIsTaskActive] = useState(false);
  
  // Ad State
  const [showAd, setShowAd] = useState(false);
  const [adProvider, setAdProvider] = useState<AdProvider>('admob');

  // Consent State
  const [showConsent, setShowConsent] = useState(false);

  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState(PaymentMethod.BKASH);
  const [withdrawDetails, setWithdrawDetails] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) navigate('/');
  }, [currentUser, navigate]);

  // Check for GDPR Consent on mount
  useEffect(() => {
    if (settings.privacy.enabled && userConsent === null) {
      const timer = setTimeout(() => setShowConsent(true), 1000); // Small delay for UX
      return () => clearTimeout(timer);
    }
  }, [settings.privacy.enabled, userConsent]);

  const handleConsent = () => {
    setUserConsent(true);
    setShowConsent(false);
  };

  const handleDeclineConsent = () => {
    setUserConsent(false);
    setShowConsent(false);
    // In a real app, you might initialize SDKs in non-personalized mode here
  };

  // Anti-Cheat & Task Timer Logic for NON-AD tasks (like Website visits)
  useEffect(() => {
    let interval: any;
    // Only run this internal timer for tasks that are NOT Video/Ads, as those are handled by AdOverlay
    const isAdTask = selectedTask && (selectedTask.type === TaskType.VIDEO || selectedTask.type === TaskType.ADS);
    
    if (isTaskActive && selectedTask && !isAdTask && taskTimer > 0) {
      interval = setInterval(() => {
        // Simple Anti-Cheat: check visibility
        if (document.visibilityState === 'visible') {
          setTaskTimer(prev => prev - 1);
        }
      }, 1000);
    } else if (isTaskActive && taskTimer === 0 && selectedTask && !isAdTask) {
      setIsTaskActive(false);
      completeTask(selectedTask.id).then(() => {
        setSelectedTask(null);
        alert(`Task Completed! You earned $${selectedTask.reward}`);
      });
    }
    return () => clearInterval(interval);
  }, [isTaskActive, taskTimer, selectedTask, completeTask]);

  const startTask = (task: Task) => {
    // Check if it's a Video/Ad task
    if (task.type === TaskType.VIDEO || task.type === TaskType.ADS) {
        
        // Block if SDKs aren't ready yet
        if (!areAdsInitialized && (settings.adMob.enabled || settings.unityAds.enabled)) {
          alert("Ad Networks are initializing... Please wait a moment.");
          return;
        }

        setSelectedTask(task);
        
        // Check availability based on Admin Settings
        // We use 'rewardedEnabled' because tasks are typically rewarded videos
        const isAdMobAvailable = settings.adMob.enabled && settings.adMob.rewardedEnabled;
        const isUnityAvailable = settings.unityAds.enabled && settings.unityAds.rewardedEnabled;

        let provider: AdProvider | null = null;

        if (isAdMobAvailable && isUnityAvailable) {
             provider = Math.random() > 0.5 ? 'unity' : 'admob';
        } else if (isUnityAvailable) {
            provider = 'unity';
        } else if (isAdMobAvailable) {
            provider = 'admob';
        }
        
        if (provider) {
            setAdProvider(provider);
            setShowAd(true);
        } else {
            // Fallback if NO ads are enabled: Treat as a timed website task
            // This ensures users aren't stuck if admin disables ads but leaves tasks
            console.warn("No ad providers available. Falling back to timer.");
            setTaskTimer(task.durationSeconds);
            setIsTaskActive(true);
        }

    } else {
        setSelectedTask(task);
        // Website or other tasks use the spinner overlay
        setTaskTimer(task.durationSeconds);
        setIsTaskActive(true);
    }
  };

  const handleAdReward = () => {
      if (selectedTask) {
        completeTask(selectedTask.id).then(() => {
             // Reward is handled in background, user sees update on UI refresh
        });
      }
  };

  const handleAdClose = () => {
      setShowAd(false);
      setSelectedTask(null);
  };

  const handleWithdraw = () => {
    if(!withdrawAmount || !withdrawDetails) return;
    requestWithdrawal(parseFloat(withdrawAmount), withdrawMethod, withdrawDetails);
    setWithdrawModalOpen(false);
    setWithdrawAmount('');
    setWithdrawDetails('');
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-brand-darker max-w-md mx-auto shadow-2xl overflow-hidden border-x border-slate-800 relative flex flex-col">
      
      {/* Header */}
      <div className="bg-brand-card p-4 flex justify-between items-center sticky top-0 z-30 shadow-md border-b border-slate-700">
        <div className="flex items-center gap-3">
          <img src={currentUser.avatar} alt="User" className="w-10 h-10 rounded-full border-2 border-brand-blue" />
          <div>
            <h2 className="font-bold text-white leading-tight">{currentUser.name}</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-brand-blue font-medium bg-blue-500/10 px-2 py-0.5 rounded-full">Level 1</span>
              {!areAdsInitialized && <span className="text-[10px] text-yellow-500 animate-pulse">Initializing Ads...</span>}
            </div>
          </div>
        </div>
        <div className="bg-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-2 border border-slate-700">
          <DollarSign className="w-4 h-4 text-brand-green" />
          <span className="font-bold text-white">${currentUser.balance.toFixed(2)}</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 space-y-6 pb-32 overflow-y-auto custom-scrollbar">
        
        {/* HOME TAB */}
        {activeTab === 'home' && (
          <div className="animate-in slide-in-from-right duration-300">
            {/* Daily Bonus Card */}
            <div className="bg-gradient-to-r from-brand-blue to-purple-600 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden mb-6">
              <div className="relative z-10">
                <h3 className="font-bold text-lg mb-1">Daily Bonus</h3>
                <p className="text-blue-100 text-sm mb-3">Claim your daily reward now!</p>
                <button className="bg-white text-brand-blue px-4 py-2 rounded-lg font-bold text-sm shadow hover:bg-blue-50">Claim $0.05</button>
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-white/10 skew-x-12 -mr-8"></div>
            </div>

            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-brand-blue" />
              Task Categories
            </h3>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { label: 'Watch Video', color: 'bg-red-500', icon: PlayCircle },
                { label: 'View Ads', color: 'bg-orange-500', icon: AlertCircle },
                { label: 'Visit Web', color: 'bg-blue-500', icon: Smartphone },
                { label: 'Offerwall', color: 'bg-purple-500', icon: DollarSign },
              ].map((cat, i) => (
                <button key={i} onClick={() => setActiveTab('tasks')} className={`${cat.color} hover:opacity-90 transition-opacity p-4 rounded-xl flex flex-col items-center justify-center gap-2 text-white shadow-lg`}>
                  <cat.icon className="w-8 h-8" />
                  <span className="font-medium text-sm">{cat.label}</span>
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center mb-3">
              <h3 className="text-white font-bold">Recent Tasks</h3>
              <button onClick={() => setActiveTab('tasks')} className="text-brand-blue text-sm">See All</button>
            </div>
            
            <div className="space-y-3">
              {tasks.slice(0, 3).map(task => (
                <div key={task.id} className="bg-brand-card p-3 rounded-xl border border-slate-700 flex gap-3 items-center">
                  <img src={task.thumbnail} className="w-16 h-12 object-cover rounded-lg bg-slate-700" alt="" />
                  <div className="flex-1">
                    <h4 className="text-white font-medium text-sm line-clamp-1">{task.title}</h4>
                    <p className="text-slate-400 text-xs">{task.durationSeconds} sec • ${task.reward}</p>
                  </div>
                  <button onClick={() => startTask(task)} className="bg-brand-blue p-2 rounded-full text-white">
                    <PlayCircle className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TASKS TAB */}
        {activeTab === 'tasks' && (
          <div className="animate-in slide-in-from-right duration-300">
            <h3 className="text-xl text-white font-bold mb-4">Available Tasks</h3>
            <div className="space-y-4">
              {tasks.map(task => (
                <Card key={task.id} className="hover:border-brand-blue transition-colors">
                  <div className="relative h-32 mb-3 rounded-lg overflow-hidden">
                    <img src={task.thumbnail} className="w-full h-full object-cover" alt={task.title} />
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-xs font-bold text-white border border-white/10">
                      ${task.reward}
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-1">{task.title}</h4>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">{task.description}</p>
                  <Button fullWidth onClick={() => startTask(task)} className="flex items-center justify-center gap-2">
                    <PlayCircle className="w-4 h-4" />
                    Start Task ({task.durationSeconds}s)
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* WALLET TAB */}
        {activeTab === 'wallet' && (
          <div className="animate-in slide-in-from-right duration-300">
            <div className="bg-brand-card border border-slate-700 rounded-2xl p-6 text-center mb-6">
              <p className="text-slate-400 mb-1">Available Balance</p>
              <h2 className="text-4xl font-bold text-white mb-2">${currentUser.balance.toFixed(2)}</h2>
              <p className="text-slate-500 text-sm mb-6">Pending: ${currentUser.pendingBalance.toFixed(2)}</p>
              <Button onClick={() => setWithdrawModalOpen(true)} fullWidth variant="success">
                Withdraw Money
              </Button>
            </div>

            <h3 className="text-white font-bold mb-3">Transaction History</h3>
            <div className="space-y-3">
              {transactions.length === 0 && <p className="text-slate-500 text-center py-4">No transactions yet.</p>}
              {transactions.map(tx => (
                <div key={tx.id} className="bg-brand-card p-3 rounded-xl border border-slate-700 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${tx.type === 'CREDIT' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {tx.type === 'CREDIT' ? <DollarSign className="w-4 h-4" /> : <LogOut className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{tx.description}</p>
                      <p className="text-slate-500 text-xs">{new Date(tx.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`font-bold ${tx.type === 'CREDIT' ? 'text-green-500' : 'text-white'}`}>
                    {tx.type === 'CREDIT' ? '+' : '-'}${tx.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            
            <h3 className="text-white font-bold mt-6 mb-3">Withdrawal History</h3>
            <div className="space-y-3">
                {withdrawals.filter(w => w.userId === currentUser.id).map(w => (
                     <div key={w.id} className="bg-brand-card p-3 rounded-xl border border-slate-700 flex justify-between items-center">
                        <div>
                             <p className="text-white font-medium text-sm">{w.method}</p>
                             <p className="text-slate-500 text-xs">{new Date(w.date).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-white font-bold">${w.amount}</p>
                            <Badge status={w.status} />
                        </div>
                     </div>
                ))}
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="animate-in slide-in-from-right duration-300">
            <div className="flex flex-col items-center mb-8">
              <img src={currentUser.avatar} alt="Profile" className="w-24 h-24 rounded-full border-4 border-slate-700 mb-4" />
              <h2 className="text-2xl font-bold text-white">{currentUser.name}</h2>
              <p className="text-slate-400">{currentUser.email}</p>
            </div>

            <div className="space-y-2">
              <div className="bg-brand-card p-4 rounded-xl border border-slate-700 flex justify-between">
                <span className="text-slate-400">Total Tasks</span>
                <span className="text-white font-bold">{currentUser.tasksCompleted}</span>
              </div>
              <div className="bg-brand-card p-4 rounded-xl border border-slate-700 flex justify-between">
                <span className="text-slate-400">User ID</span>
                <span className="text-white font-bold text-sm">{currentUser.id}</span>
              </div>
              <div className="bg-brand-card p-4 rounded-xl border border-slate-700 flex justify-between">
                <span className="text-slate-400">Version</span>
                <span className="text-white font-bold text-sm">1.0.0 (PWA)</span>
              </div>
            </div>

            <Button onClick={() => { logout(); navigate('/'); }} variant="secondary" fullWidth className="mt-8 text-red-400 hover:text-red-300">
              Sign Out
            </Button>
          </div>
        )}
      </div>

      {/* Footer Area: Banner Ad + Navigation */}
      <div className="fixed bottom-0 max-w-md w-full z-40">
        
        {/* Banner Ad Component */}
        <BannerAd />

        {/* Bottom Navigation */}
        <div className="bg-brand-card border-t border-slate-700 flex justify-around p-3 backdrop-blur-lg bg-opacity-95">
          {[
            { id: 'home', icon: Home, label: 'Home' },
            { id: 'tasks', icon: PlayCircle, label: 'Tasks' },
            { id: 'wallet', icon: Wallet, label: 'Wallet' },
            { id: 'profile', icon: UserIcon, label: 'Profile' }
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex flex-col items-center gap-1 transition-colors ${activeTab === item.id ? 'text-brand-blue' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <item.icon className={`w-6 h-6 ${activeTab === item.id ? 'fill-current' : ''}`} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Consent Modal */}
      <ConsentModal 
        isOpen={showConsent} 
        onConsent={handleConsent} 
        onDecline={handleDeclineConsent}
        policyUrl={settings.privacy.policyUrl}
      />

      {/* Ad Overlay for Video/Ad Tasks */}
      {selectedTask && (
        <AdOverlay 
            isOpen={showAd}
            provider={adProvider}
            duration={selectedTask.durationSeconds}
            onReward={handleAdReward}
            onClose={handleAdClose}
            title={selectedTask.title}
        />
      )}

      {/* Legacy Task Execution Overlay (For Website/Non-Ad Tasks) */}
      {isTaskActive && selectedTask && !showAd && (
        <div className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-sm text-center">
            <div className="w-20 h-20 rounded-full border-4 border-brand-blue border-t-transparent animate-spin mx-auto mb-8"></div>
            <h2 className="text-2xl font-bold text-white mb-2">Visiting Website...</h2>
            <p className="text-slate-400 mb-8">Do not close or switch tabs.</p>
            <div className="text-6xl font-mono font-bold text-brand-blue mb-4">
              {taskTimer}s
            </div>
            <p className="text-xs text-slate-500">Reward: ${selectedTask.reward}</p>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      <Modal isOpen={withdrawModalOpen} onClose={() => setWithdrawModalOpen(false)} title="Withdraw Funds">
        <form onSubmit={(e) => { e.preventDefault(); handleWithdraw(); }}>
            <Select 
                label="Payment Method" 
                value={withdrawMethod} 
                onChange={e => setWithdrawMethod(e.target.value as PaymentMethod)}
                options={Object.values(PaymentMethod).map(m => ({ label: m, value: m }))}
            />
            <Input 
                label="Amount ($)" 
                type="number" 
                min="5" 
                placeholder="Minimum $5.00" 
                value={withdrawAmount}
                onChange={e => setWithdrawAmount(e.target.value)}
            />
            <Input 
                label="Account Details (Number/ID)" 
                placeholder="e.g. 01700..." 
                value={withdrawDetails}
                onChange={e => setWithdrawDetails(e.target.value)}
            />
            <div className="flex gap-3 mt-6">
                <Button onClick={() => setWithdrawModalOpen(false)} variant="secondary" className="flex-1">Cancel</Button>
                <Button type="submit" variant="success" className="flex-1">Withdraw</Button>
            </div>
        </form>
      </Modal>

    </div>
  );
}
