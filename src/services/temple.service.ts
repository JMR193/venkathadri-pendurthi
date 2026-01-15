import { Injectable, signal, computed } from '@angular/core';

// Interfaces remain the same as they define the data model
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
  // --- State Signals (No Backend) ---
  isAdmin = signal<boolean>(false);
  currentUser = signal<any | null>(null); // No Firebase User type
  connectionStatus = signal<'connected' | 'disconnected' | 'checking'>('disconnected');
  
  // App Appearance State
  festivalMode = signal<boolean>(false);
  timeOfDay = signal<'morning' | 'afternoon' | 'evening' | 'night'>('morning');
  
  // Live Data Signals
  visitorCount = signal<number>(183); 
  
  // Configurable Insights (Hardcoded)
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

  // Global Site Configuration (Default values)
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
  
  // Data Signals (Hardcoded)
  news = signal<NewsItem[]>([]);
  gallery = signal<GalleryItem[]>([]);
  feedbacks = signal<FeedbackItem[]>([]);
  donations = signal<Donation[]>([]);
  library = signal<LibraryItem[]>([]);
  
  // Derived State
  totalDonations = computed(() => this.donations().reduce((acc, curr) => acc + curr.amount, 0));

  constructor() {
    this.calculateTimeOfDay();
    this.calculateDailyPanchangam();
    this.fetchRealWeather();

    // Load initial hardcoded data
    this.news.set(this.getFallbackNews());
    this.gallery.set(this.getFallbackGallery());
    this.library.set(this.getFallbackLibrary());
  }
  
  // --- Data Fetching Methods (Stubs & Fallbacks) ---
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
        content: 'Special Entry Darshan (Free) tokens for next month are now available online. Please book your slots in advance to avoid long waiting times.',
      },
      {
        id: 'fallback-3',
        title: 'Special Annadanam on Purnima',
        date: new Date(Date.now() - 172800000).toISOString(),
        content: 'A special Annadanam (food donation drive) will be held on the upcoming full moon day. All devotees are welcome to contribute.',
        imageUrl: 'https://picsum.photos/seed/food/400/200'
      }
    ];
  }

  private getFallbackGallery(): GalleryItem[] {
    return [
      { id: 'img10', type: 'image', url: 'https://opwncdejpaeltylplvhk.supabase.co/storage/v1/object/public/gallery/img%2010.jpg', caption: 'Venkateswara Swamy' },
      { id: 'img11', type: 'image', url: 'https://opwncdejpaeltylplvhk.supabase.co/storage/v1/object/public/gallery/img%2011.jpg', caption: 'Alankaram' },
      { id: 'img13', type: 'image', url: 'https://opwncdejpaeltylplvhk.supabase.co/storage/v1/object/public/gallery/img%2013.jpg', caption: 'Main Deity' },
      { id: 'img14', type: 'image', url: 'https://opwncdejpaeltylplvhk.supabase.co/storage/v1/object/public/gallery/img%2014.jpg', caption: 'Temple View' },
      { id: 'img17', type: 'image', url: 'https://opwncdejpaeltylplvhk.supabase.co/storage/v1/object/public/gallery/img%2017.jpg', caption: 'Devotees' },
      { id: 'img2', type: 'image', url: 'https://opwncdejpaeltylplvhk.supabase.co/storage/v1/object/public/gallery/img%202.jpg', caption: 'Gopuram' },
    ];
  }

  private getFallbackLibrary(): LibraryItem[] {
    return [
        { id: 'aud1', type: 'audio', title: 'Suprabhatam', url: 'https://www.tirumala.org/music/01_Suprabhatam.mp3', description: 'The sacred morning chant to awaken the Lord.' },
        { id: 'aud2', type: 'audio', title: 'Vishnu Sahasranamam', url: 'https://www.tirumala.org/music/10_Vishnu_Sahasranamam.mp3', description: 'The thousand names of Lord Vishnu.' },
        { id: 'ebook1', type: 'ebook', title: 'Introduction to Temple', url: '#', description: 'A brief guide on the history and significance of the temple (PDF).'}
    ];
  }

  // --- CRUD Stubs (No Backend) ---
  async addFeedback(name: string, message: string) {
    console.log('Feedback submitted (no backend):', { name, message });
    // This will be handled by the component now
  }
  
  async addDonation(donation: Donation) {
    console.log('Donation recorded locally (no backend):', donation);
    this.donations.update(d => [...d, donation]);
  }

  // --- FIX: Add missing backend-related methods as stubs ---

  // --- E-Hundi Stubs ---
  async verifyPayment(transactionId: string, amount: number, category: string): Promise<{success: boolean, message?: string}> {
      console.log('Verifying payment locally (no backend):', { transactionId, amount, category });
      // Always succeed in the demo
      return Promise.resolve({ success: true });
  }

  // --- Gallery Stubs ---
  async addMediaItem(url: string, caption: string, type: 'image' | 'video') {
    console.log('Adding media locally (no backend):', { url, caption, type });
    const newItem: GalleryItem = {
        id: `local-${Date.now()}`,
        url,
        caption,
        type
    };
    this.gallery.update(g => [newItem, ...g]);
  }
  
  async uploadFile(file: File): Promise<string | null> {
    console.log('Simulating file upload (no backend):', file.name);
    // Return a placeholder image URL
    return Promise.resolve('https://picsum.photos/seed/' + Date.now() + '/600/800');
  }
  
  async deletePhoto(id: string) {
    console.log('Deleting media locally (no backend):', id);
    this.gallery.update(g => g.filter(item => item.id !== id));
  }

  // --- Auth Stubs ---
  async login(email: string, password: string): Promise<{error?: string, requires2FA?: boolean}> {
    console.log('Login attempt (no backend):', { email });
    if (email.toLowerCase() === 'admin@uttarandhratirupati.org' && password === 'admin123') {
      // Admin login, simulate 2FA requirement
      this.currentUser.set({ email, is_admin: true });
      return { requires2FA: true };
    }
    if (password.length < 6) {
        return { error: 'Password should be at least 6 characters.' };
    }
    // Simulate regular user login
    this.currentUser.set({ email, is_admin: false });
    this.isAdmin.set(false);
    return { };
  }
  
  async verifyTwoFactor(otp: string): Promise<boolean> {
    console.log('Verifying OTP (no backend):', otp);
    if (otp === '123456') { // Static OTP for demo
        this.isAdmin.set(true);
        return true;
    }
    return false;
  }

  async logout() {
    console.log('Logging out (no backend)');
    this.currentUser.set(null);
    this.isAdmin.set(false);
  }

  async publicSignUp(email: string, password: string, fullName: string): Promise<{error?: any}> {
    console.log('Signup attempt (no backend):', { email, fullName });
    if (!email || !password || !fullName) {
        return { error: { message: 'Please fill all fields.' } };
    }
    // Simulate success
    return { error: null };
  }

  // --- Booking System (Simulated) ---
  async getSlotAvailability(date: string): Promise<SlotAvailability[]> {
    const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '04:00 PM', '05:00 PM', '06:00 PM'];
    const capacityPerSlot = this.siteConfig().darshanSlotCapacity || 50;

    // Simulate some slots being booked
    return timeSlots.map(time => {
        const booked = Math.floor(Math.random() * capacityPerSlot);
        let status: 'AVAILABLE' | 'FULL' | 'FAST_FILLING' = 'AVAILABLE';
        if (booked >= capacityPerSlot) status = 'FULL';
        else if (booked >= capacityPerSlot * 0.8) status = 'FAST_FILLING';

        return { time, booked, capacity: capacityPerSlot, status };
    });
  }

  async bookDarshanSlot(booking: Booking): Promise<{success: boolean, ticketCode?: string, message?: string, type?: 'SLOT_FULL' | 'NETWORK' | 'GENERIC'}> {
     // Simulate success
     const ticketCode = 'TKT-' + Math.floor(100000 + Math.random() * 900000);
     console.log('Booking successful (no backend):', { ...booking, ticketCode });
     return Promise.resolve({ success: true, ticketCode });
  }

  async getUserBookings(): Promise<Booking[]> {
      return Promise.resolve([]);
  }
  
  async getUserDonations(): Promise<Donation[]> {
      return Promise.resolve(this.donations());
  }

  // --- Unchanged Utility and Local State Methods ---
  getTodayDate(): string {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    const localDate = new Date(now.getTime() - offset);
    return localDate.toISOString().split('T')[0];
  }
  
  private calculateTimeOfDay() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) this.timeOfDay.set('morning');
    else if (hour >= 12 && hour < 17) this.timeOfDay.set('afternoon');
    else if (hour >= 17 && hour < 20) this.timeOfDay.set('evening');
    else this.timeOfDay.set('night');
  }

  private async fetchRealWeather() {
    try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=17.8335&longitude=83.2036&current=temperature_2m,weather_code,is_day&timezone=auto');
        if (!res.ok) return;
        const data = await res.json();
        if (data.current) {
            this.weather.set({
                temp: Math.round(data.current.temperature_2m),
                condition: 'Sunny', // simplified
                isDay: data.current.is_day === 1
            });
        }
    } catch (e) {
      console.warn("Weather fetch failed.");
    }
  }
  
  private calculateDailyPanchangam() { /* ... unchanged ... */ }
}