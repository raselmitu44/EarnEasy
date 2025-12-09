
import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { UserRole, Task, TaskType, WithdrawalStatus } from '../../types';
import { Card, Button, Badge, Modal, Input, Select, StatCard } from '../../components/Shared';
import { 
  LayoutDashboard, Users, PlaySquare, Wallet, Settings, LogOut, 
  Search, CheckCircle, XCircle, Plus, Trash2, Edit, Save, Smartphone, ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function AdminPanel() {
  const { 
    currentUser, users, tasks, withdrawals, transactions, settings,
    logout, updateWithdrawalStatus, updateUserStatus, deleteTask, addTask, updateSettings
  } = useStore();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'tasks' | 'withdrawals' | 'settings'>('dashboard');
  const navigate = useNavigate();

  // Task Form State
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskReward, setNewTaskReward] = useState('');
  const [newTaskDuration, setNewTaskDuration] = useState('');
  const [newTaskType, setNewTaskType] = useState<TaskType>(TaskType.VIDEO);

  // Settings State
  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    if (!currentUser || currentUser.role !== UserRole.ADMIN) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
      setLocalSettings(settings);
  }, [settings]);

  const handleAddTask = (e: React.FormEvent) => {
      e.preventDefault();
      const task: Task = {
          id: `task-${Date.now()}`,
          title: newTaskTitle,
          description: newTaskDesc,
          reward: parseFloat(newTaskReward),
          durationSeconds: parseInt(newTaskDuration),
          type: newTaskType,
          isActive: true,
          thumbnail: `https://picsum.photos/300/200?random=${Date.now()}`
      };
      addTask(task);
      setTaskModalOpen(false);
      // Reset form
      setNewTaskTitle(''); setNewTaskDesc(''); setNewTaskReward(''); setNewTaskDuration('');
  };

  const handleSaveSettings = () => {
    updateSettings(localSettings);
    alert('Settings saved successfully!');
  };

  const pendingWithdrawals = withdrawals.filter(w => w.status === WithdrawalStatus.PENDING);
  const totalPaid = withdrawals.filter(w => w.status === WithdrawalStatus.APPROVED).reduce((acc, curr) => acc + curr.amount, 0);

  // Chart Data
  const chartData = [
    { name: 'Mon', earnings: 40 },
    { name: 'Tue', earnings: 30 },
    { name: 'Wed', earnings: 20 },
    { name: 'Thu', earnings: 27 },
    { name: 'Fri', earnings: 18 },
    { name: 'Sat', earnings: 23 },
    { name: 'Sun', earnings: 34 },
  ];

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-[#0F172A] flex">
      {/* Sidebar */}
      <div className="w-64 bg-brand-card border-r border-slate-700 flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-brand-blue">Earn</span>Admin
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'users', icon: Users, label: 'Users' },
            { id: 'tasks', icon: PlaySquare, label: 'Tasks' },
            { id: 'withdrawals', icon: Wallet, label: 'Withdrawals' },
            { id: 'settings', icon: Settings, label: 'Monetization' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
                activeTab === item.id 
                  ? 'bg-brand-blue text-white shadow-lg shadow-blue-500/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
              {item.id === 'withdrawals' && pendingWithdrawals.length > 0 && (
                 <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{pendingWithdrawals.length}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-700">
          <button onClick={() => { logout(); navigate('/'); }} className="flex items-center gap-3 text-red-400 hover:text-red-300 w-full px-4 py-2 font-medium transition-colors">
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        
        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h2 className="text-3xl font-bold text-white mb-6">Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Users" value={users.length} icon={Users} color="bg-blue-500" />
              <StatCard title="Active Tasks" value={tasks.length} icon={PlaySquare} color="bg-purple-500" />
              <StatCard title="Pending Payouts" value={`$${pendingWithdrawals.reduce((a,c)=>a+c.amount,0)}`} icon={Wallet} color="bg-orange-500" />
              <StatCard title="Total Paid" value={`$${totalPaid}`} icon={CheckCircle} color="bg-green-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <h3 className="text-white font-bold mb-4">Earning Analytics</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', color: '#fff' }}
                                    cursor={{fill: '#334155', opacity: 0.2}} 
                                />
                                <Bar dataKey="earnings" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card>
                    <h3 className="text-white font-bold mb-4">Recent Withdrawals</h3>
                    <div className="space-y-4">
                        {withdrawals.slice(0, 5).map(w => (
                            <div key={w.id} className="flex justify-between items-center border-b border-slate-700 pb-2 last:border-0">
                                <div>
                                    <p className="text-white text-sm font-medium">{w.userName}</p>
                                    <p className="text-slate-500 text-xs">{w.method}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-white font-bold text-sm">${w.amount}</p>
                                    <span className={`text-[10px] ${w.status === 'APPROVED' ? 'text-green-500' : 'text-yellow-500'}`}>{w.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
          </div>
        )}

        {/* USERS */}
        {activeTab === 'users' && (
          <div className="animate-in fade-in duration-300">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white">User Management</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Search users..." className="bg-slate-800 text-white pl-10 pr-4 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-brand-blue" />
                </div>
             </div>
             <Card className="overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-800 text-slate-400 text-sm uppercase">
                        <tr>
                            <th className="p-4">User</th>
                            <th className="p-4">Joined</th>
                            <th className="p-4">Balance</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {users.filter(u => u.role === UserRole.USER).map(user => (
                            <tr key={user.id} className="hover:bg-slate-800/50 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <img src={user.avatar} className="w-8 h-8 rounded-full" alt="" />
                                        <div>
                                            <p className="text-white font-medium">{user.name}</p>
                                            <p className="text-slate-500 text-xs">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-slate-400 text-sm">{new Date(user.joinedAt).toLocaleDateString()}</td>
                                <td className="p-4 text-white font-bold">${user.balance.toFixed(2)}</td>
                                <td className="p-4"><Badge status={user.isBanned ? 'BANNED' : 'ACTIVE'} /></td>
                                <td className="p-4 text-right">
                                    <Button 
                                        onClick={() => updateUserStatus(user.id, !user.isBanned)} 
                                        variant={user.isBanned ? 'success' : 'danger'} 
                                        className="py-1 px-3 text-xs"
                                    >
                                        {user.isBanned ? 'Unban' : 'Ban'}
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </Card>
          </div>
        )}

        {/* TASKS */}
        {activeTab === 'tasks' && (
           <div className="animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white">Task Inventory</h2>
                <Button onClick={() => setTaskModalOpen(true)} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add New Task
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tasks.map(task => (
                    <Card key={task.id} className="group hover:border-brand-blue transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-2 rounded-lg ${task.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                <PlaySquare className="w-6 h-6" />
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white"><Edit className="w-4 h-4" /></button>
                                <button onClick={() => deleteTask(task.id)} className="p-2 hover:bg-red-500/20 rounded text-red-500"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{task.title}</h3>
                        <p className="text-slate-400 text-sm mb-4 line-clamp-2">{task.description}</p>
                        <div className="flex justify-between items-center border-t border-slate-700 pt-4">
                            <span className="text-white font-bold">${task.reward}</span>
                            <span className="text-slate-500 text-sm">{task.durationSeconds}s Timer</span>
                        </div>
                    </Card>
                ))}
            </div>
           </div>
        )}

        {/* WITHDRAWALS */}
        {activeTab === 'withdrawals' && (
            <div className="animate-in fade-in duration-300">
                <h2 className="text-3xl font-bold text-white mb-6">Payout Requests</h2>
                <Card>
                    <div className="space-y-4">
                        {withdrawals.length === 0 && <p className="text-center text-slate-500 py-6">No withdrawal requests found.</p>}
                        {withdrawals.map(req => (
                            <div key={req.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-slate-700 rounded-xl bg-slate-800/30">
                                <div className="flex items-center gap-4 mb-4 md:mb-0">
                                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold">
                                        {req.userName.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold">{req.userName}</h4>
                                        <p className="text-slate-400 text-sm">{req.method} • {req.accountDetails}</p>
                                        <p className="text-slate-600 text-xs">{new Date(req.date).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <span className="block text-2xl font-bold text-white">${req.amount.toFixed(2)}</span>
                                        <Badge status={req.status} />
                                    </div>
                                    {req.status === WithdrawalStatus.PENDING && (
                                        <div className="flex gap-2">
                                            <button onClick={() => updateWithdrawalStatus(req.id, WithdrawalStatus.APPROVED)} className="p-2 bg-green-500 hover:bg-green-600 rounded text-white transition-colors" title="Approve">
                                                <CheckCircle className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => updateWithdrawalStatus(req.id, WithdrawalStatus.REJECTED)} className="p-2 bg-red-500 hover:bg-red-600 rounded text-white transition-colors" title="Reject">
                                                <XCircle className="w-5 h-5" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        )}

        {/* SETTINGS / MONETIZATION */}
        {activeTab === 'settings' && (
            <div className="animate-in fade-in duration-300">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold text-white">Ad Monetization & Privacy</h2>
                  <Button onClick={handleSaveSettings} className="flex gap-2">
                      <Save className="w-4 h-4" /> Save Changes
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* PRIVACY CONFIG */}
                    <Card className="p-6 lg:col-span-2 border-l-4 border-l-brand-blue">
                         <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-brand-blue/20 rounded-lg">
                                <ShieldCheck className="w-6 h-6 text-brand-blue" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Privacy & Consent (GDPR)</h3>
                                <p className="text-slate-400 text-sm">Configure User Messaging Platform for AdMob & Unity Ads</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <label className="flex items-center gap-3 p-4 bg-slate-800 rounded-lg border border-slate-700 cursor-pointer hover:bg-slate-750 transition-colors">
                                <input 
                                    type="checkbox" 
                                    checked={localSettings.privacy.enabled}
                                    onChange={(e) => setLocalSettings({...localSettings, privacy: {...localSettings.privacy, enabled: e.target.checked}})}
                                    className="w-5 h-5 accent-brand-blue"
                                />
                                <div>
                                    <span className="block text-white font-medium">Enable Consent Dialog</span>
                                    <span className="text-xs text-slate-400">Require users to accept GDPR policies before viewing ads</span>
                                </div>
                            </label>
                            <Input 
                                label="Privacy Policy URL"
                                value={localSettings.privacy.policyUrl}
                                onChange={(e) => setLocalSettings({...localSettings, privacy: {...localSettings.privacy, policyUrl: e.target.value}})}
                                placeholder="https://yourdomain.com/privacy"
                                icon={<ShieldCheck size={16}/>}
                            />
                        </div>
                    </Card>

                    {/* ADMOB CONFIG */}
                    <Card className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-yellow-500/20 rounded-lg">
                                <Smartphone className="w-6 h-6 text-yellow-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Google AdMob</h3>
                        </div>
                        
                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-white font-medium mb-4 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={localSettings.adMob.enabled}
                                    onChange={(e) => setLocalSettings({...localSettings, adMob: {...localSettings.adMob, enabled: e.target.checked}})}
                                    className="w-5 h-5 accent-brand-blue"
                                />
                                Enable AdMob Integration
                            </label>
                            
                            <Input 
                                label="App ID" 
                                value={localSettings.adMob.appId} 
                                onChange={(e) => setLocalSettings({...localSettings, adMob: {...localSettings.adMob, appId: e.target.value}})}
                                placeholder="ca-app-pub-4307115135436522/7581859541"
                                disabled={!localSettings.adMob.enabled}
                            />
                            
                            {/* Banner Configuration Section */}
                            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 space-y-3">
                                <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Banner Ads</h4>
                                <label className="flex items-center gap-2 text-white text-sm font-medium cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={localSettings.adMob.bannersEnabled}
                                        onChange={(e) => setLocalSettings({...localSettings, adMob: {...localSettings.adMob, bannersEnabled: e.target.checked}})}
                                        className="w-4 h-4 accent-brand-blue"
                                        disabled={!localSettings.adMob.enabled}
                                    />
                                    Enable Banner Ads
                                </label>
                                <Input 
                                    label="Banner Unit ID" 
                                    value={localSettings.adMob.bannerId} 
                                    onChange={(e) => setLocalSettings({...localSettings, adMob: {...localSettings.adMob, bannerId: e.target.value}})}
                                    placeholder="ca-app-pub-..."
                                    disabled={!localSettings.adMob.enabled || !localSettings.adMob.bannersEnabled}
                                    className="bg-slate-900"
                                />
                            </div>

                            {/* Interstitial Configuration Section */}
                            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 space-y-3">
                                <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Interstitial Ads</h4>
                                <label className="flex items-center gap-2 text-white text-sm font-medium cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={localSettings.adMob.interstitialEnabled}
                                        onChange={(e) => setLocalSettings({...localSettings, adMob: {...localSettings.adMob, interstitialEnabled: e.target.checked}})}
                                        className="w-4 h-4 accent-brand-blue"
                                        disabled={!localSettings.adMob.enabled}
                                    />
                                    Enable Interstitial Ads
                                </label>
                                <Input 
                                    label="Interstitial Unit ID" 
                                    value={localSettings.adMob.interstitialId} 
                                    onChange={(e) => setLocalSettings({...localSettings, adMob: {...localSettings.adMob, interstitialId: e.target.value}})}
                                    placeholder="ca-app-pub-4307115135436522/4338966142"
                                    disabled={!localSettings.adMob.enabled || !localSettings.adMob.interstitialEnabled}
                                    className="bg-slate-900"
                                />
                            </div>

                            {/* Rewarded Configuration Section */}
                            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 space-y-3">
                                <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Rewarded Ads</h4>
                                <label className="flex items-center gap-2 text-white text-sm font-medium cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={localSettings.adMob.rewardedEnabled}
                                        onChange={(e) => setLocalSettings({...localSettings, adMob: {...localSettings.adMob, rewardedEnabled: e.target.checked}})}
                                        className="w-4 h-4 accent-brand-blue"
                                        disabled={!localSettings.adMob.enabled}
                                    />
                                    Enable Rewarded Ads
                                </label>
                                <Input 
                                    label="Rewarded Video Unit ID" 
                                    value={localSettings.adMob.rewardedId} 
                                    onChange={(e) => setLocalSettings({...localSettings, adMob: {...localSettings.adMob, rewardedId: e.target.value}})}
                                    placeholder="ca-app-pub-4307115135436522/6053881801"
                                    disabled={!localSettings.adMob.enabled || !localSettings.adMob.rewardedEnabled}
                                    className="bg-slate-900"
                                />
                            </div>

                        </div>
                    </Card>

                    {/* UNITY ADS CONFIG */}
                    <Card className="p-6">
                         <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-slate-500/20 rounded-lg">
                                <Smartphone className="w-6 h-6 text-slate-300" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Unity Ads</h3>
                        </div>

                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-white font-medium mb-4 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={localSettings.unityAds.enabled}
                                    onChange={(e) => setLocalSettings({...localSettings, unityAds: {...localSettings.unityAds, enabled: e.target.checked}})}
                                    className="w-5 h-5 accent-brand-blue"
                                />
                                Enable Unity Ads Integration
                            </label>
                            
                            <Input 
                                label="Game ID" 
                                value={localSettings.unityAds.appId} 
                                onChange={(e) => setLocalSettings({...localSettings, unityAds: {...localSettings.unityAds, appId: e.target.value}})}
                                placeholder="6000699"
                                disabled={!localSettings.unityAds.enabled}
                            />

                             {/* Banner Configuration Section */}
                             <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 space-y-3">
                                <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Banner Ads</h4>
                                <label className="flex items-center gap-2 text-white text-sm font-medium cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={localSettings.unityAds.bannersEnabled}
                                        onChange={(e) => setLocalSettings({...localSettings, unityAds: {...localSettings.unityAds, bannersEnabled: e.target.checked}})}
                                        className="w-4 h-4 accent-brand-blue"
                                        disabled={!localSettings.unityAds.enabled}
                                    />
                                    Enable Banner Ads
                                </label>
                                <Input 
                                    label="Banner Placement ID" 
                                    value={localSettings.unityAds.bannerId} 
                                    onChange={(e) => setLocalSettings({...localSettings, unityAds: {...localSettings.unityAds, bannerId: e.target.value}})}
                                    placeholder="banner"
                                    disabled={!localSettings.unityAds.enabled || !localSettings.unityAds.bannersEnabled}
                                    className="bg-slate-900"
                                />
                            </div>

                             <Input 
                                label="Interstitial Placement ID" 
                                value={localSettings.unityAds.interstitialId} 
                                onChange={(e) => setLocalSettings({...localSettings, unityAds: {...localSettings.unityAds, interstitialId: e.target.value}})}
                                placeholder="video"
                                disabled={!localSettings.unityAds.enabled}
                            />
                            <Input 
                                label="Rewarded Video Placement ID" 
                                value={localSettings.unityAds.rewardedId} 
                                onChange={(e) => setLocalSettings({...localSettings, unityAds: {...localSettings.unityAds, rewardedId: e.target.value}})}
                                placeholder="rewardedVideo"
                                disabled={!localSettings.unityAds.enabled}
                            />
                        </div>
                    </Card>
                </div>
            </div>
        )}

      </div>

        {/* Add Task Modal */}
        <Modal isOpen={isTaskModalOpen} onClose={() => setTaskModalOpen(false)} title="Add New Earning Task">
            <form onSubmit={handleAddTask}>
                <Input label="Task Title" value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} placeholder="e.g. Watch Promo Video" required />
                <Input label="Description" value={newTaskDesc} onChange={e => setNewTaskDesc(e.target.value)} placeholder="Short instructions..." required />
                <div className="grid grid-cols-2 gap-4">
                    <Input label="Reward ($)" type="number" step="0.01" value={newTaskReward} onChange={e => setNewTaskReward(e.target.value)} placeholder="0.50" required />
                    <Input label="Duration (sec)" type="number" value={newTaskDuration} onChange={e => setNewTaskDuration(e.target.value)} placeholder="30" required />
                </div>
                <Select 
                    label="Task Type"
                    value={newTaskType}
                    onChange={e => setNewTaskType(e.target.value as TaskType)}
                    options={Object.values(TaskType).map(t => ({ label: t, value: t }))}
                />
                <Button type="submit" fullWidth className="mt-4">Create Task</Button>
            </form>
        </Modal>

    </div>
  );
}
