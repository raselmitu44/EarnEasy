
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { UserRole } from '../types';
import { Button, Input, Card } from '../components/Shared';
import { Smartphone, Mail, Lock, Shield, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>(UserRole.USER);
  const { login } = useStore();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    login(email, role);
    if (role === UserRole.ADMIN) {
      navigate('/admin');
    } else {
      navigate('/app');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80')] bg-cover bg-center">
      <div className="absolute inset-0 bg-brand-darker/90 backdrop-blur-sm"></div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-blue mb-4 shadow-lg shadow-blue-500/50">
            <Smartphone className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">EarnEasy</h1>
          <p className="text-slate-400">Complete tasks. Earn rewards. Withdraw instantly.</p>
        </div>

        <Card className="bg-brand-card/95 border-slate-600">
          <div className="flex bg-slate-800 p-1 rounded-lg mb-6">
            <button 
              onClick={() => setRole(UserRole.USER)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${role === UserRole.USER ? 'bg-brand-blue text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              <User size={16} /> User App
            </button>
            <button 
              onClick={() => setRole(UserRole.ADMIN)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${role === UserRole.ADMIN ? 'bg-brand-blue text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              <Shield size={16} /> Admin Panel
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <Input 
              label="Email Address" 
              type="email" 
              placeholder={role === UserRole.ADMIN ? "admin@earneasy.com" : "name@example.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail />}
            />
            <Input 
              label="Password" 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock />}
            />
            
            <Button type="submit" fullWidth variant="primary" className="mt-6 mb-4">
              {isLogin ? (role === UserRole.ADMIN ? 'Access Dashboard' : 'Sign In') : 'Create Account'}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-brand-card text-slate-400">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" className="text-sm">
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </Button>
            <Button variant="secondary" className="text-sm">
              <Smartphone className="h-5 w-5 mr-2 text-slate-400" />
              Phone
            </Button>
          </div>

          <p className="mt-6 text-center text-sm text-slate-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-brand-blue hover:underline font-medium">
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
