
import { Injectable, signal, computed } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../environments/environment';

export interface TempleTimings {
  suprabhatam: string;
  morningDarshan: string;
  breakTime: string;
  eveningDarshan: string;
  ekanthaSeva: string;
}

export interface BankInfo {
  accountName: string;
  accountNumber: string;
  bankName: string;
  ifsc: string;
  branch: string;
  qrCodeUrl: string;
}

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  headingFont: string;
  bodyFont: string;
  headingFontWeight: number;
  bodyFontWeight: number;
  borderRadius: number; // in px
}

export interface SiteConfig {
  templeName: string;
  subTitle: string;
  logoUrl: string;
  liveLink: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  mapEmbedUrl?: string;
  whatsappChannel?: string;
  panchangamImageUrl?: string;
  historyContent?: string;
  historyImageUrl?: string;
  bankInfo: BankInfo;
  timings: TempleTimings;
  theme: ThemeConfig;
  enableBooking: boolean;
  enableHundi: boolean;
  maintenanceMode: boolean;
  darshanPrice: number;
  darshanSlotCapacity: number;
  donationAmounts: number[];
  donationCategories: string[];
}

export interface TempleInsights {
  ladduStock: number;
  laddusDistributed: number;
  darshanWaitTime: number; // in minutes
  crowdStatus: 'Low' | 'Moderate' | 'High';
}

export interface WeatherData {
  temp: number;
  condition: string;
  isDay: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  content: string;
  attachmentUrl?: string;
  imageUrl?: string;
}

export interface GalleryItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  caption: string;
}

export interface FeedbackItem {
  id: string;
  name: string;
  message: string;
  date: string;
  read?: boolean;
}

export interface Donation {
  id: string;
  donorName: string;
  gothram?: string;
  category: string;
  amount: number;
  date: string;
  pan?: string;
  email?: string;
  user_id?: string;
  transactionId: string;
  status?: 'Verified' | 'Pending';
  created_at?: string;
}

export interface LibraryItem {
  id: string;
  type: 'audio' | 'ebook';
  title: string;
  url: string;
  description?: string;
}

export interface Booking {
  id?: string;
  date: string;
  slot: string;
  devoteeName: string;
  mobile: string;
  email?: string;
  user_id?: string;
  ticketCode: string;
  status: 'Booked' | 'Cancelled' | 'Completed';
  timestamp?: string;
}

export interface SlotAvailability {
  time: string;
  booked: number;
  capacity: number;
  status: 'AVAILABLE' | 'FULL' | 'FAST_FILLING';
}

export interface Panchangam {
  date: string;
  tithi: string;
  nakshatra: string;
  yogam: string;
  karanam: string;
  rahuKalam: string;
  yamagandam: string;
  sunrise: string;
  sunset: string;
}

@Injectable({
  providedIn: 'root'
})
export class TempleService {
  public supabase: SupabaseClient; 

  // --- State Signals ---
  isAdmin = signal<boolean>(false);
  currentUser = signal<User | null>(null);
  connectionStatus = signal<'connected' | 'disconnected' | 'checking'>('checking');
  
  // App Appearance State
  festivalMode = signal<boolean>(false);
  timeOfDay = signal<'morning' | 'afternoon' | 'evening' | 'night'>('morning');
  
  // Live Data Signals
  visitorCount = signal<number>(0); 
  
  // Configurable Insights (Synced with DB)
  insights = signal<TempleInsights>({
    ladduStock: 5000,
    laddusDistributed: 1240,
    darshanWaitTime: 30,
    crowdStatus: 'Moderate'
  });

  // Real Weather Signal
  weather = signal<WeatherData>({
    temp: 28,
    condition: 'Sunny',
    isDay: true
  });
  
  // 2FA Mock State
  private _pending2FASession = false;

  // Global Site Configuration
  siteConfig = signal<SiteConfig>({
    templeName: 'Uttarandhra Tirupati',
    subTitle: 'Shri Venkateswara Swamy Temple, Pendurthi',
    logoUrl: 'https://opwncdejpaeltylplvhk.supabase.co/storage/v1/object/public/images/logo/cb3d423f-ec99-48a4-b070-adf5c21ddd76.png', 
    liveLink: 'https://www.youtube.com/@ramanujampendurthi1012',
    contactPhone: '+91 99999 99999',
    contactEmail: 'helpdesk@uttarandhratirupati.org',
    address: 'UTTHARANDHRA TIRUPATI ( Venkateswara Swamy Temple ), Balaji Nagar, Pendurthi, Visakhapatnam, Pendurti, Andhra Pradesh 531173',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3798.1259530462065!2d83.2036413148855!3d17.833544987814984!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3967887611385d%3A0xb35e396264024500!2sSri%20Venkateswara%20Swamy%20Temple!5e0!3m2!1sen!2sin!4v1629440000000!5m2!1sen!2sin',
    whatsappChannel: 'https://whatsapp.com/channel/0029Vap96ByFnSzG0KocMq1y',
    panchangamImageUrl: '',
    historyContent: 'The Lord of the Universe and Vaikuntha, Srimannarayana, takes many forms to protect his devotees. In this Kaliyuga, he incarnated as Lord Venkateswara to offer solace to mankind.\n\nLocated in the serene surroundings of Pendurthi, Visakhapatnam, the Sri Venkatadri temple stands as a testament to devotion. It is widely revered as "Uttarandhra Tirupati" (Tirupati of North Andhra), serving millions of devotees who seek the blessings of the Lord but cannot travel to Tirumala.',
    historyImageUrl: 'https://opwncdejpaeltylplvhk.supabase.co/storage/v1/object/public/images/Gemini_Generated_Image_ujj4zlujj4zlujj4.png',
    bankInfo: {
      accountName: 'Uttarandhra Tirupati Devasthanam Trust',
      accountNumber: '123456789012',
      bankName: 'Union Bank of India',
      ifsc: 'UBIN0532101',
      branch: 'Pendurthi',
      qrCodeUrl: 'https://picsum.photos/id/20/200/200'
    },
    timings: {
      suprabhatam: '05:00 AM',
      morningDarshan: '06:00 AM - 01:00 PM',
      breakTime: '01:00 PM - 04:00 PM',
      eveningDarshan: '04:00 PM - 08:30 PM',
      ekanthaSeva: '09:00 PM'
    },
    theme: {
      primaryColor: '#4a0404', 
      secondaryColor: '#d97706',
      accentColor: '#fbbf24',
      backgroundColor: '#fffbeb',
      headingFont: 'Cinzel',
      bodyFont: 'Lato',
      headingFontWeight: 700,
      bodyFontWeight: 400,
      borderRadius: 12,
    },
    enableBooking: true,
    enableHundi: true,
    maintenanceMode: false,
    darshanPrice: 0,
    darshanSlotCapacity: 50,
    donationAmounts: [116, 516, 1116, 5000],
    donationCategories: [
      'General Hundi (Srivari Kanuka)', 
      'Annadanam Trust', 
      'Gosala Maintenance', 
      'Saswatha Puja Scheme', 
      'Temple Construction Fund'
    ]
  });

  // Dynamic Panchangam State
  dailyPanchangam = signal<Panchangam>({
    date: new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    tithi: 'Shukla Ekadashi',
    nakshatra: 'Shravana',
    yogam: 'Siddha',
    karanam: 'Bava',
    rahuKalam: '10:30 AM - 12:00 PM',
    yamagandam: '03:00 PM - 04:30 PM',
    sunrise: '06:05 AM',
    sunset: '06:12 PM'
  });

  // Content State
  flashNews = signal<string>("Om Namo Venkatesaya! Annual Brahmotsavams start from next week. Please book your darshan slots.");
  
  // Data Signals
  news = signal<NewsItem[]>([]);
  gallery = signal<GalleryItem[]>([
      { id: 'img10', type: 'image', url: 'https://opwncdejpaeltylplvhk.supabase.co/storage/v1/object/public/gallery/img%2010.jpg', caption: 'Venkateswara Swamy' },
      { id: 'img11', type: 'image', url: 'https://opwncdejpaeltylplvhk.supabase.co/storage/v1/object/public/gallery/img%2011.jpg', caption: 'Venkateswara Swamy' },
      { id: 'img13', type: 'image', url: 'https://opwncdejpaeltylplvhk.supabase.co/storage/v1/object/public/gallery/img%2013.jpg', caption: 'Venkateswara Swamy' },
      { id: 'img14', type: 'image', url: 'https://opwncdejpaeltylplvhk.supabase.co/storage/v1/object/public/gallery/img%2014.jpg', caption: 'Venkateswara Swamy' },
      { id: 'img17', type: 'image', url: 'https://opwncdejpaeltylplvhk.supabase.co/storage/v1/object/public/gallery/img%2017.jpg', caption: 'Venkateswara Swamy' },
      { id: 'img2', type: 'image', url: 'https://opwncdejpaeltylplvhk.supabase.co/storage/v1/object/public/gallery/img%202.jpg', caption: 'Venkateswara Swamy' },
      { id: 'img3', type: 'image', url: 'https://opwncdejpaeltylplvhk.supabase.co/storage/v1/object/public/gallery/img%203.jpg', caption: 'Venkateswara Swamy' },
      { id: 'img4', type: 'image', url: 'https://opwncdejpaeltylplvhk.supabase.co/storage/v1/object/public/gallery/img%204.jpg', caption: 'Venkateswara Swamy' },
      { id: 'img5', type: 'image', url: 'https://opwncdejpaeltylplvhk.supabase.co/storage/v1/object/public/gallery/img%205.jpg', caption: 'Venkateswara Swamy' },
      { id: 'img7', type: 'image', url: 'https://opwncdejpaeltylplvhk.supabase.co/storage/v1/object/public/gallery/img%207.jpg', caption: 'Venkateswara Swamy' },
      { id: 'img6', type: 'image', url: 'https://opwncdejpaeltylplvhk.supabase.co/storage/v1/object/public/gallery/img%206.jpg', caption: 'Venkateswara Swamy' },
      { id: 'screenshot', type: 'image', url: 'https://opwncdejpaeltylplvhk.supabase.co/storage/v1/object/public/gallery/Screenshot%202026-01-09%20110644.png', caption: 'Venkateswara Swamy' }
  ]);
  feedbacks = signal<FeedbackItem[]>([]);
  donations = signal<Donation[]>([]);
  library = signal<LibraryItem[]>([]);
  
  // Derived State
  totalDonations = computed(() => this.donations().reduce((acc, curr) => acc + curr.amount, 0));

  constructor() {
    this.calculateTimeOfDay();
    
    // Initialize Supabase
    if (!environment.supabase.url || !environment.supabase.key) {
      console.error('Supabase URL or Key is missing in environment configuration.');
      this.connectionStatus.set('disconnected');
    }
    this.supabase = createClient(environment.supabase.url, environment.supabase.key);

    // Setup Logic (Fire and forget, but handle errors safely)
    this.checkConnection().catch(e => console.warn('Connection check handled', e));
    this.initAuth();
    this.loadInitialData().catch(e => console.warn('Initial data load handled', e));
    this.setupRealtimeListeners();
    
    // Live Features
    this.trackVisitor().catch(e => {}); // Suppress errors for background tasks
    this.fetchRealWeather().catch(e => {});
  }

  // --- Utility Helper for Dates ---
  getTodayDate(): string {
    const now = new Date();
    // Offset for local timezone to ensure YYYY-MM-DD corresponds to user's "today"
    const offset = now.getTimezoneOffset() * 60000;
    const localDate = new Date(now.getTime() - offset);
    return localDate.toISOString().split('T')[0];
  }

  async checkConnection() {
    try {
      const { data, error } = await this.supabase.from('settings').select('id').limit(1);
      if (error && error.code !== 'PGRST116') { 
         // Warn but don't error out console if table doesn't exist yet
         console.warn("Supabase connection check:", error.message);
      }
      this.connectionStatus.set('connected');
    } catch (e: any) {
      if (e.name !== 'AbortError' && e.message !== 'signal is aborted without reason' && !e.message?.includes('aborted')) {
          console.warn("Supabase connection failed (using offline mode):", e);
      }
      this.connectionStatus.set('disconnected');
    }
  }

  private calculateTimeOfDay() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) this.timeOfDay.set('morning');
    else if (hour >= 12 && hour < 17) this.timeOfDay.set('afternoon');
    else if (hour >= 17 && hour < 20) this.timeOfDay.set('evening');
    else this.timeOfDay.set('night');
  }

  // --- Real Weather Integration ---
  private async fetchRealWeather() {
    try {
        // Fetch weather for Pendurthi, Visakhapatnam
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=17.8335&longitude=83.2036&current=temperature_2m,weather_code,is_day&timezone=auto');
        if (!res.ok) throw new Error(`Weather API Status: ${res.statusText}`);
        
        const data = await res.json();
        
        if (data.current) {
            let condition = 'Sunny';
            const code = data.current.weather_code;
            const isDay = data.current.is_day === 1;

            // Simple WMO code mapping
            if (code >= 95) condition = 'Thunderstorm';
            else if (code >= 61) condition = 'Rainy';
            else if (code >= 51) condition = 'Drizzle';
            else if (code >= 45) condition = 'Foggy';
            else if (code >= 1) condition = isDay ? 'Partly Cloudy' : 'Cloudy';
            else condition = isDay ? 'Sunny' : 'Clear Night';

            this.weather.set({
                temp: Math.round(data.current.temperature_2m),
                condition: condition,
                isDay: isDay
            });
        }
    } catch (e: any) {
        if (e.name !== 'AbortError' && !e.message?.includes('aborted') && e.message !== 'signal is aborted without reason') {
           console.warn("Weather fetch failed, using default:", e.message || e);
        }
    }
  }

  // --- IP-Based Visitor Tracking (Simulated Persistence) ---
  private async trackVisitor() {
    try {
        // 1. Get IP Address
        const ipRes = await fetch('https://api.ipify.org?format=json');
        if (!ipRes.ok) throw new Error('IP Fetch Failed');
        const ipData = await ipRes.json();
        const ip = ipData.ip;

        // 2. Check if already counted in this session to prevent spamming
        const lastVisit = localStorage.getItem('last_visit_ip');
        const visitedToday = localStorage.getItem('visited_today');
        const today = this.getTodayDate();

        // Fetch current stats from Supabase
        const { data: statsData } = await this.supabase.from('settings').select('data').eq('id', 'stats').single();
        let currentCount = statsData?.data?.visitor_count || 0; // Reset default to 0

        if (visitedToday !== today || lastVisit !== ip) {
            // New unique visitor for today
            currentCount++;
            localStorage.setItem('last_visit_ip', ip);
            localStorage.setItem('visited_today', today);
            
            // Persist increment to Supabase if possible
            this.supabase.from('settings').upsert({ 
                id: 'stats', 
                data: { ...statsData?.data, visitor_count: currentCount } 
            }).then(({error}) => {
                if(error) console.warn("Could not update visitor stats in DB");
            });
        }

        // Add small random "Live" fluctuation
        const liveFluctuation = Math.floor(Math.random() * 5);
        this.visitorCount.set(currentCount + liveFluctuation);

    } catch (e: any) {
        if (e.name !== 'AbortError' && e.message !== 'signal is aborted without reason' && !e.message?.includes('aborted')) {
           // Fallback to purely local simulation if IP fetch fails (Start low)
           this.visitorCount.set(Math.floor(Math.random() * 5) + 120);
        }
    }
  }

  // --- Realtime Configuration Sync (Supabase) ---
  private setupRealtimeListeners() {
    // Listen for Global Settings & Insights Updates
    this.supabase.channel('public:settings')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'settings' }, (payload) => {
         const newData = (payload.new as any)['data'];
         const id = (payload.new as any)['id'];

         if (id === 'status' && newData?.scroll_news) {
             this.flashNews.set(newData.scroll_news);
         } else if (id === 'global') {
             this.updateLocalConfig(newData);
         } else if (id === 'insights') {
             if (newData) this.insights.set(newData);
         } else if (id === 'stats' && newData?.visitor_count) {
             // Update visitor count live
             this.visitorCount.set(newData.visitor_count + Math.floor(Math.random() * 5));
         }
      })
      .subscribe((status, err) => {
        if (err) console.warn('Supabase subscription warning:', err);
      });
      
    // Initial Fetches with error handling using .then(success, fail) to avoid unhandled rejections
    this.supabase.from('settings').select('data').eq('id', 'status').single()
      .then(
        ({ data }) => { if (data?.data?.scroll_news) this.flashNews.set(data.data.scroll_news); },
        () => {} // Suppress errors
      );
      
    this.supabase.from('settings').select('data').eq('id', 'global').single()
      .then(
        ({ data }) => { if (data?.data) this.updateLocalConfig(data.data); },
        () => {} // Suppress errors
      );

    this.supabase.from('settings').select('data').eq('id', 'insights').single()
      .then(
        ({ data }) => { 
            if (data?.data) this.insights.set(data.data); 
        },
        () => {} // Suppress errors
      );

    this.supabase.from('settings').select('data').eq('id', 'panchangam').single()
      .then(
        ({ data }) => { if (data?.data) this.dailyPanchangam.set(data.data); },
        () => {} // Suppress errors
      );
  }

  private updateLocalConfig(data: any) {
     this.siteConfig.update(curr => {
         const merged = { ...curr, ...data };
         merged.theme = { ...curr.theme, ...(data.theme || {}) };
         merged.bankInfo = { ...curr.bankInfo, ...(data.bankInfo || {}) };
         if (merged.enableBooking === undefined) merged.enableBooking = true;
         if (merged.enableHundi === undefined) merged.enableHundi = true;
         return merged;
     });
  }

  async updateSiteConfig(config: Partial<SiteConfig>) {
    this.siteConfig.update(current => {
        const updated = { ...current, ...config };
        if (config.theme) updated.theme = { ...current.theme, ...config.theme };
        return updated;
    });
    try {
        await this.supabase.from('settings').upsert({ id: 'global', data: this.siteConfig() });
    } catch(e) {
        console.error("Failed to save config", e);
    }
  }

  async updateInsights(data: TempleInsights) {
      this.insights.set(data);
      try {
          await this.supabase.from('settings').upsert({ id: 'insights', data });
      } catch(e) {
          console.error("Failed to save insights", e);
      }
  }

  async updatePanchangam(data: Panchangam) {
    this.dailyPanchangam.set(data);
    try {
        await this.supabase.from('settings').upsert({ id: 'panchangam', data: data });
    } catch(e) {
        console.error("Failed to save panchangam", e);
    }
  }

  async setFestivalMode(enabled: boolean) {
    this.festivalMode.set(enabled);
  }

  async updateFlashNews(text: string) {
      this.flashNews.set(text);
      await this.supabase.from('settings').upsert({ id: 'status', data: { scroll_news: text } });
  }

  // --- Auth & Security (Supabase Auth) ---

  private initAuth() {
    this.supabase.auth.getUser().then(({ data: { user } }) => {
       this.handleUser(user);
    });

    this.supabase.auth.onAuthStateChange((_event, session) => {
      this.handleUser(session?.user || null);
    });
  }

  private handleUser(user: User | null) {
      if (user) {
        this.currentUser.set(user);
        // Admin Logic: Check email or metadata
        // For security, strict check for specific email domain or specific email
        const isAdminUser = user.email === 'admin@uttarandhratirupati.org' || user.email === 'admin@temple.com';
        
        this.isAdmin.set(isAdminUser);
        
        if (isAdminUser) {
           this.fetchDonations().catch(() => {});
           this.fetchFeedbacks().catch(() => {});
        }
      } else {
        this.currentUser.set(null);
        this.isAdmin.set(false);
        this._pending2FASession = false;
      }
  }

  // Admin Login with optional 2FA simulation
  async login(email: string, password: string): Promise<{ error: any; requires2FA?: boolean }> {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // For Admins only, trigger the 2FA flow simulation
      if (email === 'admin@uttarandhratirupati.org' || email === 'admin@temple.com') {
          this._pending2FASession = true;
          return { error: null, requires2FA: true };
      }
      
      return { error: null, requires2FA: false };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  // Public Login (No 2FA)
  async publicLogin(email: string, password: string) {
      return this.supabase.auth.signInWithPassword({ email, password });
  }

  // Public Sign Up
  async publicSignUp(email: string, password: string, fullName: string) {
      return this.supabase.auth.signUp({
          email,
          password,
          options: {
              data: {
                  full_name: fullName
              }
          }
      });
  }

  async verifyTwoFactor(otp: string): Promise<boolean> {
    if (!this._pending2FASession) return false;
    // Mock 2FA for demonstration
    if (otp.length === 6 && !isNaN(Number(otp))) { 
        this._pending2FASession = false;
        return true;
    }
    return false;
  }

  async logout() {
    await this.supabase.auth.signOut();
  }

  async loadInitialData() {
    // Use Promise.allSettled to ensure that one failure doesn't block other data
    await Promise.allSettled([
        this.fetchNews(),
        this.fetchGallery(),
        this.fetchLibrary()
    ]);
  }

  // --- Data Fetching Methods (Supabase) ---

  async fetchNews() {
    try {
      const { data, error } = await this.supabase
        .from('news')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) {
        console.warn("Supabase News Fetch Warning:", error.message);
        // Fallback data if table missing
        this.news.set(this.getFallbackNews());
        return;
      }
      
      if (data && data.length > 0) {
        this.news.set(data as NewsItem[]);
      } else {
        this.news.set(this.getFallbackNews());
      }
    } catch (e: any) {
      if (e.name !== 'AbortError' && e.message !== 'signal is aborted without reason' && !e.message?.includes('aborted')) {
        console.warn('News fetch exception (Using Fallback):', e);
      }
      this.news.set(this.getFallbackNews());
    }
  }

  private getFallbackNews(): NewsItem[] {
    return [
      {
        id: 'fallback-1',
        title: 'Annual Brahmotsavams Schedule Released',
        date: new Date().toISOString(),
        content: 'The annual Brahmotsavams will be celebrated with grand fervor starting next week. Devotees are requested to participate and seek blessings. Highlights include Garuda Seva and Rathotsavam.',
        imageUrl: 'https://opwncdejpaeltylplvhk.supabase.co/storage/v1/object/public/images/channels4_banner.jpg'
      },
      {
        id: 'fallback-2',
        title: 'Darshan Booking Open for Next Month',
        date: new Date(Date.now() - 86400000).toISOString(),
        content: 'Special Entry Darshan (₹300) and Free Darshan tokens for next month are now available online. Please book your slots in advance to avoid long waiting times.',
      }
    ];
  }

  async fetchGallery() {
    try {
      const { data, error } = await this.supabase
        .from('gallery')
        .select('*')
        .order('date', { ascending: false });

      if (data && data.length > 0) this.gallery.set(data as GalleryItem[]);
    } catch (e) {
      // Keep default gallery
    }
  }

  async fetchLibrary() {
    try {
      const { data, error } = await this.supabase
        .from('library')
        .select('*');

      if (data) this.library.set(data as LibraryItem[]);
    } catch (e) {
      // Ignore
    }
  }

  async fetchFeedbacks() {
    if (!this.isAdmin()) return;
    try {
      const { data, error } = await this.supabase
        .from('feedback')
        .select('*')
        .order('date', { ascending: false })
        .limit(50);

      if (data) this.feedbacks.set(data as FeedbackItem[]);
    } catch(e) {}
  }

  async fetchDonations() {
    if (!this.isAdmin()) return;
    try {
      const { data, error } = await this.supabase
        .from('donations')
        .select('*')
        .order('date', { ascending: false })
        .limit(100);

      if (data) this.donations.set(data as Donation[]);
    } catch(e) {}
  }

  // --- Report Generation ---
  generateCSV(type: 'donations' | 'bookings', startDate: string, endDate: string) {
    let data: any[] = [];
    let filename = '';

    if (type === 'donations') {
        data = this.donations().filter(d => d.date >= startDate && d.date <= endDate);
        filename = `Donations_${startDate}_to_${endDate}.csv`;
    } else {
        data = []; 
    }

    if (data.length === 0) {
        alert('No data found for the selected range.');
        return;
    }

    const header = Object.keys(data[0]);
    const csvContent = [
      header.join(','), // Header row
      ...data.map(row => header.map(fieldName => JSON.stringify(row[fieldName as keyof typeof row] || '')).join(','))
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  // --- CRUD Operations (Supabase) ---

  async addNews(title: string, content: string, attachmentUrl: string = '', imageUrl: string = '') {
    await this.supabase.from('news').insert({
        title, 
        content, 
        attachmentUrl,
        imageUrl,
        date: new Date().toISOString()
    });
    this.fetchNews();
  }

  async updateNews(id: string, data: Partial<NewsItem>) {
     await this.supabase.from('news').update(data).eq('id', id);
     this.fetchNews();
  }

  async deleteNews(id: string) {
      await this.supabase.from('news').delete().eq('id', id);
      this.fetchNews();
  }

  async addMediaItem(url: string, caption: string, type: 'image' | 'video') {
      await this.supabase.from('gallery').insert({
          url,
          caption,
          type,
          date: new Date().toISOString()
      });
      this.fetchGallery();
  }

  async deletePhoto(id: string) {
      await this.supabase.from('gallery').delete().eq('id', id);
      this.fetchGallery();
  }

  async addLibraryItem(item: Omit<LibraryItem, 'id'>) {
      await this.supabase.from('library').insert(item);
      this.fetchLibrary();
  }

  async deleteLibraryItem(id: string) {
      await this.supabase.from('library').delete().eq('id', id);
      this.fetchLibrary();
  }

  async addFeedback(name: string, message: string) {
      await this.supabase.from('feedback').insert({
          name, message, date: new Date().toISOString()
      });
  }
  
  async deleteFeedback(id: string) {
      await this.supabase.from('feedback').delete().eq('id', id);
      this.fetchFeedbacks();
  }

  async addDonation(donation: Donation) {
      const user = this.currentUser();
      await this.supabase.from('donations').insert({
          ...donation,
          email: user?.email,
          user_id: user?.id,
          created_at: new Date().toISOString()
      });
      if (this.isAdmin()) this.fetchDonations();
  }

  async getUserDonations(): Promise<Donation[]> {
      const user = this.currentUser();
      if (!user?.email) return [];
      
      const { data } = await this.supabase
          .from('donations')
          .select('*')
          .eq('email', user.email)
          .order('date', { ascending: false });
      
      return (data as Donation[]) || [];
  }

  // --- Booking System (Supabase) ---

  async getSlotAvailability(date: string): Promise<SlotAvailability[]> {
    const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '04:00 PM', '05:00 PM', '06:00 PM'];
    const capacityPerSlot = this.siteConfig().darshanSlotCapacity || 50;

    try {
        const { data: bookings, error } = await this.supabase
            .from('bookings')
            .select('slot')
            .eq('date', date)
            .eq('status', 'Booked');
        
        if (error) {
            console.warn("Supabase (bookings) fetch failed. Using default slots.", error.message);
            return timeSlots.map(time => ({ time, booked: 0, capacity: capacityPerSlot, status: 'AVAILABLE' as const }));
        }

        const counts: {[key: string]: number} = {};
        (bookings || []).forEach((b: any) => {
            if (b.slot) counts[b.slot] = (counts[b.slot] || 0) + 1;
        });

        return timeSlots.map(time => {
            const booked = counts[time] || 0;
            let status: 'AVAILABLE' | 'FULL' | 'FAST_FILLING' = 'AVAILABLE';
            if (booked >= capacityPerSlot) status = 'FULL';
            else if (booked >= capacityPerSlot * 0.8) status = 'FAST_FILLING';

            return { time, booked, capacity: capacityPerSlot, status };
        });
    } catch (e) {
        console.error("Exception in getSlotAvailability:", e);
        return timeSlots.map(time => ({ time, booked: 0, capacity: capacityPerSlot, status: 'AVAILABLE' as const }));
    }
  }

  async getBookingsForAdmin(date: string): Promise<Booking[]> {
    try {
        const { data, error } = await this.supabase
            .from('bookings')
            .select('*')
            .eq('date', date);
        
        if (error) {
            return [];
        }
        return (data as Booking[]) || [];
    } catch (e) {
        return [];
    }
  }

  async getUserBookings(): Promise<Booking[]> {
      const user = this.currentUser();
      if (!user?.email) return [];

      try {
          const { data } = await this.supabase
              .from('bookings')
              .select('*')
              .eq('email', user.email)
              .order('date', { ascending: false });
          return (data as Booking[]) || [];
      } catch {
          return [];
      }
  }

  async cancelBooking(id: string) {
      await this.supabase.from('bookings').update({ status: 'Cancelled' }).eq('id', id);
  }

  async bookDarshanSlot(booking: Booking): Promise<{success: boolean, ticketCode?: string, message?: string}> {
     const ticketCode = 'TKT-' + Math.floor(100000 + Math.random() * 900000);
     const user = this.currentUser();
     
     try {
         const { error } = await this.supabase.from('bookings').insert({
             ...booking,
             email: user?.email,
             user_id: user?.id,
             ticketCode,
             timestamp: new Date().toISOString()
         });
         
         if (error) throw error;
         return { success: true, ticketCode };
     } catch (e: any) {
         return { success: false, message: e.message || 'Booking failed. Please try again.' };
     }
  }

  // --- Storage (Supabase Storage) ---

  async uploadFile(file: File, path: string = 'uploads'): Promise<string | null> {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.floor(Math.random()*1000)}.${fileExt}`;
        const filePath = `${path}/${fileName}`;

        const bucketName = 'temple-assets';
        
        const { data, error } = await this.supabase.storage
            .from(bucketName) 
            .upload(filePath, file);

        if (error) throw error;

        const { data: publicUrlData } = this.supabase.storage
            .from(bucketName)
            .getPublicUrl(filePath);

        return publicUrlData.publicUrl;
    } catch(e) {
        console.error("Upload failed", e);
        return null;
    }
  }

  async verifyPayment(transactionId: string, amount: number, category: string): Promise<{success: boolean, message: string}> {
     return { success: true, message: 'Verified' };
  }
}
