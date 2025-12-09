
import { AppSettings } from '../types';

interface AdInitializationStatus {
  adMob: boolean;
  unity: boolean;
}

class AdSdkService {
  private isAdMobReady: boolean = false;
  private isUnityReady: boolean = false;
  private isInitializing: boolean = false;
  private lastConfigSignature: string = '';

  /**
   * Initializes the Ad Networks based on the provided configuration.
   * Simulates the async nature of native SDK initialization.
   */
  public async initialize(settings: AppSettings): Promise<AdInitializationStatus> {
    // Create a signature of the current configuration to prevent redundant re-inits
    const configSignature = JSON.stringify({
      adMob: settings.adMob,
      unity: settings.unityAds,
      privacy: settings.privacy // Include privacy in signature in case it affects init mode
    });

    // If configuration hasn't changed and we are already ready, return current status
    if (this.lastConfigSignature === configSignature && !this.isInitializing) {
      if ((settings.adMob.enabled && this.isAdMobReady) || (settings.unityAds.enabled && this.isUnityReady)) {
         return { adMob: this.isAdMobReady, unity: this.isUnityReady };
      }
    }

    if (this.isInitializing) {
      console.warn("⚠️ AdSDK: Initialization already in progress...");
      return { adMob: this.isAdMobReady, unity: this.isUnityReady };
    }

    this.isInitializing = true;
    console.group("📱 AdSDK Initialization Sequence");
    
    // Reset states
    this.isAdMobReady = false;
    this.isUnityReady = false;

    const initPromises = [];

    // --- AdMob Initialization Logic ---
    if (settings.adMob.enabled) {
      const adMobTask = async () => {
        try {
          console.log(`[AdMob] ⏳ Connecting to servers... (App ID: ${settings.adMob.appId})`);
          
          // Simulation: Basic validation
          if (!settings.adMob.appId || settings.adMob.appId.length < 5) {
            throw new Error("Invalid AdMob App ID format");
          }

          // Simulation: Network delay
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          this.isAdMobReady = true;
          console.log(`[AdMob] ✅ Initialized Successfully.`);
          console.log(`[AdMob] └─ Banners: ${settings.adMob.bannersEnabled ? 'ON' : 'OFF'} | Interstitials: ${settings.adMob.interstitialEnabled ? 'ON' : 'OFF'}`);
        } catch (e) {
          console.error(`[AdMob] ❌ Initialization Failed:`, e);
          this.isAdMobReady = false;
        }
      };
      initPromises.push(adMobTask());
    } else {
      console.log("[AdMob] ⚪ Disabled in Admin Settings.");
    }

    // --- Unity Ads Initialization Logic ---
    if (settings.unityAds.enabled) {
      const unityTask = async () => {
        try {
          console.log(`[Unity Ads] ⏳ Initializing Game Engine... (ID: ${settings.unityAds.appId})`);
          
          // Simulation: Basic validation
          if (!settings.unityAds.appId || settings.unityAds.appId.length < 3) {
             throw new Error("Invalid Unity Game ID");
          }

          // Simulation: Network delay
          await new Promise(resolve => setTimeout(resolve, 1200));

          this.isUnityReady = true;
          console.log(`[Unity Ads] ✅ Initialized (Test Mode Active).`);
        } catch (e) {
           console.error(`[Unity Ads] ❌ Initialization Failed:`, e);
           this.isUnityReady = false;
        }
      };
      initPromises.push(unityTask());
    } else {
      console.log("[Unity Ads] ⚪ Disabled in Admin Settings.");
    }

    await Promise.all(initPromises);

    this.isInitializing = false;
    this.lastConfigSignature = configSignature;
    console.groupEnd();

    return {
      adMob: this.isAdMobReady,
      unity: this.isUnityReady
    };
  }

  public getStatus() {
    return { adMob: this.isAdMobReady, unity: this.isUnityReady };
  }
}

export const AdSdk = new AdSdkService();
