import React, { useState, useEffect } from 'react';
import { X, Volume2, Info, ExternalLink } from 'lucide-react';
import { Button } from './Shared';
import { useStore } from '../context/StoreContext';

export type AdProvider = 'admob' | 'unity';

interface AdOverlayProps {
  isOpen: boolean;
  provider: AdProvider;
  duration: number; // Seconds
  onReward: () => void;
  onClose: () => void;
  title?: string;
}

const AdOverlay: React.FC<AdOverlayProps> = ({ 
  isOpen, 
  provider, 
  duration, 
  onReward, 
  onClose,
  title = "Sponsored Video"
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [canClose, setCanClose] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      setTimeLeft(duration);
      setCanClose(false);
      setIsCompleted(false);
    }
  }, [isOpen, duration]);

  useEffect(() => {
    if (!isOpen || isCompleted) return;

    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setCanClose(true);
      setIsCompleted(true);
      onReward();
    }
  }, [timeLeft, isOpen, isCompleted, onReward]);

  if (!isOpen) return null;

  // Render AdMob Style
  if (provider === 'admob') {
    return (
      <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-in fade-in duration-300">
        {/* AdMob Top Bar */}
        <div className="bg-white p-2 flex justify-between items-center shadow-sm z-10">
          <div className="flex items-center gap-2">
            <span className="bg-[#FBBC05] text-white text-[10px] font-bold px-1 rounded">Ad</span>
            <span className="text-xs text-gray-500">Google AdMob</span>
          </div>
          <button 
            onClick={onClose}
            disabled={!canClose}
            className={`p-1 rounded-full ${canClose ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'opacity-0 cursor-not-allowed'}`}
          >
            <X size={20} />
          </button>
        </div>

        {/* AdMob Content (Simulated Video) */}
        <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden group">
          <img 
            src="https://images.unsplash.com/photo-1596526131083-e8c633c948d2?auto=format&fit=crop&q=80" 
            className="w-full h-full object-cover opacity-60" 
            alt="Ad Content" 
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
            <h2 className="text-3xl font-bold mb-2 drop-shadow-md">Super Game 3D</h2>
            <p className="mb-6 opacity-90 drop-shadow-md">Install now and get 500 coins!</p>
            <Button className="bg-[#4285F4] hover:bg-[#3367D6] rounded-full px-8 py-2 shadow-lg">
              Install Now
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 h-1 bg-[#4285F4] transition-all duration-1000 ease-linear" style={{ width: `${((duration - timeLeft) / duration) * 100}%` }}></div>
          
          {/* Countdown Badge */}
          {!canClose && (
            <div className="absolute top-4 right-4 w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">
              {timeLeft}
            </div>
          )}
        </div>

        {/* AdMob Bottom Bar */}
        <div className="bg-[#F1F3F4] p-3 flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-300 rounded-md shrink-0"></div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-gray-800 truncate">Super Game 3D</h4>
            <div className="flex items-center text-xs text-gray-500">
               <span className="text-[#FABB05] mr-1">★★★★★</span> 4.8
            </div>
          </div>
          <Button variant="primary" className="text-sm py-1 px-4 shrink-0">Install</Button>
        </div>
      </div>
    );
  }

  // Render Unity Ads Style
  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in duration-300 font-sans text-white">
      {/* Unity Top Overlay */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-20">
        <div className="bg-black/40 backdrop-blur px-3 py-1 rounded-full text-xs text-white/80">
          This ad will end in {timeLeft}s
        </div>
        
        <div className="flex gap-4">
            <div className="flex flex-col items-center gap-1">
                 <Info size={20} className="text-white/60" />
            </div>
            <button 
                onClick={onClose}
                disabled={!canClose}
                className={`w-8 h-8 flex items-center justify-center rounded-full bg-black/40 backdrop-blur transition-opacity duration-300 ${canClose ? 'opacity-100' : 'opacity-0'}`}
            >
                <X size={18} />
            </button>
        </div>
      </div>

      {/* Unity Main Content */}
      <div className="flex-1 relative flex items-center justify-center bg-[#222]">
        <img 
            src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80" 
            className="absolute inset-0 w-full h-full object-cover opacity-40" 
            alt="Unity Ad"
        />
        <div className="relative z-10 text-center p-8">
            <div className="w-24 h-24 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-2xl mx-auto mb-6 shadow-2xl animate-bounce"></div>
            <h1 className="text-4xl font-black italic mb-2 tracking-tighter uppercase drop-shadow-lg">Mega Slots</h1>
            <p className="text-xl mb-8 text-white/90 drop-shadow-md">Spin to win HUGE JACKPOTS!</p>
            <Button className="bg-green-500 hover:bg-green-600 text-white font-bold text-xl px-12 py-4 rounded-full shadow-lg shadow-green-500/30 transform transition hover:scale-105">
                PLAY FREE
            </Button>
        </div>
        
        {/* Unity Watermark */}
        <div className="absolute bottom-6 left-6 flex items-center gap-2 opacity-50">
            <div className="w-6 h-6 border-2 border-white/80 rotate-45"></div>
            <span className="font-medium text-sm tracking-wide">Unity Ads</span>
        </div>

        {/* Sound Toggle */}
        <div className="absolute bottom-6 right-6 p-2 bg-black/20 rounded-full">
            <Volume2 size={20} className="text-white/80" />
        </div>
      </div>

      {/* Unity End Card (Simulated after timer) */}
      {canClose && (
         <div className="absolute inset-0 bg-black/90 z-30 flex flex-col items-center justify-center animate-in zoom-in duration-300">
             <h2 className="text-2xl font-bold mb-4">Reward Granted!</h2>
             <div className="flex gap-4">
                 <Button onClick={onClose} variant="secondary">Close</Button>
                 <Button className="bg-blue-600 hover:bg-blue-700"><ExternalLink size={16} className="mr-2"/> Download</Button>
             </div>
         </div>
      )}
    </div>
  );
};

export const BannerAd: React.FC = () => {
    const { settings } = useStore();

    // Determine if we should show a banner and which provider
    const showAdMob = settings.adMob.enabled && settings.adMob.bannersEnabled;
    const showUnity = settings.unityAds.enabled && settings.unityAds.bannersEnabled;

    if (!showAdMob && !showUnity) return null;

    // Pick one based on availability (Random if both)
    const provider: AdProvider = (showAdMob && showUnity) 
        ? (Math.random() > 0.5 ? 'admob' : 'unity') 
        : (showAdMob ? 'admob' : 'unity');

    if (provider === 'admob') {
        return (
            <div className="w-full h-[50px] bg-white border-t border-gray-200 flex items-center justify-center relative overflow-hidden shadow-lg z-50 animate-in slide-in-from-bottom duration-500">
                <div className="absolute top-0 left-0 bg-[#FBBC05] text-[8px] font-bold px-1 text-white">Ad</div>
                <div className="flex items-center gap-3 px-4 w-full">
                    <div className="w-8 h-8 bg-gray-200 rounded shrink-0"></div>
                    <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-gray-800 truncate">Trade Stocks Now</div>
                        <div className="text-[10px] text-gray-500 truncate">Best trading app 2024</div>
                    </div>
                    <button className="bg-[#4285F4] text-white text-[10px] px-3 py-1 rounded-full font-bold">OPEN</button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-[50px] bg-[#222] border-t border-gray-700 flex items-center justify-between px-3 relative shadow-lg z-50 animate-in slide-in-from-bottom duration-500">
            <div className="flex items-center gap-2">
                 <div className="w-4 h-4 border border-white/50 rotate-45"></div>
                 <div className="text-white text-xs font-bold tracking-wider">UNITY</div>
            </div>
            <div className="text-white/80 text-xs font-medium">Install Game & Play</div>
            <ExternalLink size={14} className="text-white" />
        </div>
    );
};

export default AdOverlay;
