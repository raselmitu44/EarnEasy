
import React from 'react';
import { Button } from './Shared';
import { Shield, Check } from 'lucide-react';

interface ConsentModalProps {
  isOpen: boolean;
  onConsent: () => void;
  onDecline: () => void;
  policyUrl: string;
}

const ConsentModal: React.FC<ConsentModalProps> = ({ isOpen, onConsent, onDecline, policyUrl }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-700">
        
        {/* Header with Icon */}
        <div className="bg-brand-blue/10 p-8 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">We value your privacy</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            We and our partners use cookies and other technologies to collect data about your usage to deliver personalized ads and improve your experience.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 bg-white dark:bg-slate-900">
          <div className="text-xs text-slate-500 space-y-2">
            <p>
              By clicking <strong>"Consent"</strong>, you agree to our <a href={policyUrl} className="text-brand-blue hover:underline" target="_blank" rel="noreferrer">Privacy Policy</a> and allow EarnEasy and our partners (AdMob, Unity Ads) to use your data for:
            </p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Personalized advertising and content</li>
              <li>Ad and content measurement</li>
              <li>Audience insights and product development</li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 pt-0 flex flex-col gap-3">
          <Button onClick={onConsent} variant="primary" fullWidth className="py-3 text-base font-bold shadow-xl shadow-blue-500/20">
            <Check className="w-5 h-5 mr-2" />
            Consent
          </Button>
          <Button onClick={onDecline} variant="secondary" fullWidth className="py-3 text-base bg-transparent border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">
            Manage Options / Decline
          </Button>
          <p className="text-[10px] text-center text-slate-400 mt-2">
            You can change your preferences at any time in the app settings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConsentModal;
