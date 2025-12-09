import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

export const Card: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-brand-card rounded-xl p-4 border border-slate-700 shadow-sm ${className}`}>
    {children}
  </div>
);

export const Button: React.FC<{ 
  children: ReactNode; 
  onClick?: () => void; 
  variant?: 'primary' | 'secondary' | 'danger' | 'success'; 
  fullWidth?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
}> = ({ children, onClick, variant = 'primary', fullWidth = false, disabled = false, type="button", className='' }) => {
  const baseStyle = "py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-brand-blue hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 disabled:bg-blue-800",
    secondary: "bg-slate-700 hover:bg-slate-600 text-slate-200 disabled:bg-slate-800",
    danger: "bg-red-500 hover:bg-red-600 text-white disabled:bg-red-800",
    success: "bg-brand-green hover:bg-green-600 text-white shadow-lg shadow-green-500/20 disabled:bg-green-800"
  };

  return (
    <button 
      type={type}
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string; icon?: ReactNode }> = ({ label, icon, className, ...props }) => (
  <div className="mb-4">
    {label && <label className="block text-slate-400 text-sm mb-2 font-medium">{label}</label>}
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-500">
          {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 20 }) : icon}
        </div>
      )}
      <input 
        className={`w-full bg-slate-800 border border-slate-700 text-white rounded-lg ${icon ? 'pl-10' : 'px-4'} py-3 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-colors ${className}`}
        {...props}
      />
    </div>
  </div>
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string, options: {value: string, label: string}[] }> = ({ label, options, className, ...props }) => (
    <div className="mb-4">
      {label && <label className="block text-slate-400 text-sm mb-2 font-medium">{label}</label>}
      <select 
        className={`w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-colors ${className}`}
        {...props}
      >
        {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );

export const StatCard: React.FC<{ title: string; value: string | number; icon: LucideIcon; color: string }> = ({ title, value, icon: Icon, color }) => (
  <Card className="flex items-center gap-4">
    <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
      <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
    </div>
    <div>
      <p className="text-slate-400 text-sm">{title}</p>
      <h3 className="text-2xl font-bold text-white">{value}</h3>
    </div>
  </Card>
);

export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-brand-card w-full max-w-md rounded-2xl border border-slate-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-brand-darker">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export const Badge: React.FC<{ status: string }> = ({ status }) => {
  let colorClass = "bg-slate-700 text-slate-300";
  const s = status.toUpperCase();
  if (s === 'APPROVED' || s === 'COMPLETED' || s === 'CREDIT') colorClass = "bg-green-500/20 text-green-500 border border-green-500/30";
  if (s === 'PENDING') colorClass = "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30";
  if (s === 'REJECTED' || s === 'BANNED' || s === 'DEBIT') colorClass = "bg-red-500/20 text-red-500 border border-red-500/30";
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-bold ${colorClass}`}>
      {status}
    </span>
  );
};