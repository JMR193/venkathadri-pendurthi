
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { TempleService } from '../services/temple.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Top Scrolling Ticker -->
    <div class="bg-amber-50 border-b border-amber-200 py-1 overflow-hidden shadow-inner relative z-10">
      <div class="container mx-auto px-4 flex items-center">
        <span class="bg-[#800000] text-white text-[10px] font-bold px-3 py-1 uppercase tracking-wider mr-4 shadow-sm flex-shrink-0">Latest Updates</span>
        <div class="whitespace-nowrap animate-marquee font-bold text-sm text-[#800000] flex items-center gap-12">
          <span>{{ templeService.flashNews() }}</span>
          <span>✦</span>
          <span>Sarva Darshan tokens are available at Srinivasam Complex.</span>
          <span>✦</span>
          <span>Advance Booking for next month opens on 24th at 10 AM.</span>
        </div>
      </div>
    </div>

    <!-- Main Hero Banner (Full width like Tirumala.org) -->
    <div class="relative w-full h-[350px] md:h-[500px] overflow-hidden bg-stone-900 group">
       <img src="https://opwncdejpaeltylplvhk.supabase.co/storage/v1/object/public/images/channels4_banner.jpg" 
           class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[20s]" 
           alt="Temple Banner">
       <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10 flex flex-col justify-end pb-16 px-4 md:px-20">
           <div class="container mx-auto animate-fade-in-up">
               <h2 class="text-3xl md:text-5xl font-serif font-bold text-amber-400 drop-shadow-lg mb-2">Uttarandhra Tirupati</h2>
               <p class="text-white text-lg md:text-xl font-light tracking-widest uppercase mb-8 border-l-4 border-amber-500 pl-4">Kali Yuga Vaikuntham • Pendurthi</p>
               
               <div class="flex flex-wrap gap-4">
                  <a routerLink="/booking" class="bg-[#800000] hover:bg-red-900 text-white px-8 py-3 font-bold uppercase tracking-wider text-sm transition-all flex items-center gap-2 shadow-lg border border-amber-500/30">
                     Book Darshan
                  </a>
                  <a routerLink="/e-hundi" class="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white px-8 py-3 font-bold uppercase tracking-wider text-sm transition-all flex items-center gap-2 shadow-lg">
                     E-Hundi
                  </a>
               </div>
           </div>
       </div>
    </div>

    <!-- Featured Panchangam Section (Automatic Update) -->
    <div class="bg-gradient-to-r from-red-900 to-[#800000] text-amber-50 py-6 border-b-4 border-amber-500 shadow-xl relative overflow-hidden">
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-10" style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
        
        <div class="container mx-auto px-4 relative z-10">
            <div class="flex flex-col md:flex-row items-center justify-between gap-6">
                <!-- Date Header -->
                <div class="flex items-center gap-4 border-r border-amber-700/50 pr-6 mr-4 min-w-max">
                    <div class="text-center bg-white/10 rounded-lg p-2 backdrop-blur-sm border border-white/20">
                        <span class="block text-xs uppercase tracking-wider text-amber-300">Today</span>
                        <span class="block text-2xl font-bold font-serif leading-none">{{ templeService.dailyPanchangam().date | date:'dd' }}</span>
                        <span class="block text-xs font-bold">{{ templeService.dailyPanchangam().date | date:'MMM' }}</span>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold font-serif text-amber-300">Daily Panchangam</h3>
                        <p class="text-xs text-amber-100 opacity-80">{{ templeService.dailyPanchangam().date }}</p>
                    </div>
                </div>

                <!-- Scrollable/Grid Data -->
                <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-4 text-sm w-full">
                    <div class="flex flex-col">
                        <span class="text-[10px] uppercase text-amber-400 font-bold tracking-wider">Tithi</span>
                        <span class="font-semibold">{{ templeService.dailyPanchangam().tithi }}</span>
                    </div>
                    <div class="flex flex-col">
                        <span class="text-[10px] uppercase text-amber-400 font-bold tracking-wider">Nakshatra</span>
                        <span class="font-semibold">{{ templeService.dailyPanchangam().nakshatra }}</span>
                    </div>
                    <div class="flex flex-col">
                        <span class="text-[10px] uppercase text-amber-400 font-bold tracking-wider">Rahu Kalam</span>
                        <span class="font-semibold text-red-200">{{ templeService.dailyPanchangam().rahuKalam }}</span>
                    </div>
                    <div class="flex flex-col">
                        <span class="text-[10px] uppercase text-amber-400 font-bold tracking-wider">Yamagandam</span>
                        <span class="font-semibold text-red-200">{{ templeService.dailyPanchangam().yamagandam }}</span>
                    </div>
                    <div class="flex flex-col">
                        <span class="text-[10px] uppercase text-amber-400 font-bold tracking-wider">Sunrise</span>
                        <span class="font-semibold flex items-center gap-1">
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
                           {{ templeService.dailyPanchangam().sunrise }}
                        </span>
                    </div>
                    <div class="flex flex-col">
                        <span class="text-[10px] uppercase text-amber-400 font-bold tracking-wider">Sunset</span>
                        <span class="font-semibold flex items-center gap-1">
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>
                           {{ templeService.dailyPanchangam().sunset }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Pilgrim Services Dashboard (AP Gov Portal Clone) -->
    <div class="bg-[#f0f2f5] py-16">
       <div class="container mx-auto px-4">
          <div class="text-center mb-12">
              <h3 class="text-2xl md:text-3xl font-serif font-bold text-[#4a4a4a] mb-3">Pilgrim Services</h3>
              <div class="w-16 h-1 bg-amber-500 mx-auto"></div>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
             <!-- Service Card 1 -->
             <a routerLink="/booking" class="bg-white rounded shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all p-6 flex flex-col items-center justify-center text-center gap-4 group border-b-4 border-transparent hover:border-[#800000]">
                <div class="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center group-hover:bg-[#800000] transition-colors duration-300">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7 text-[#800000] group-hover:text-white"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
                </div>
                <span class="text-sm font-bold text-stone-600 group-hover:text-[#800000] uppercase tracking-wide">Special Entry<br>Darshan</span>
             </a>

             <!-- Service Card 2 -->
             <a routerLink="/e-hundi" class="bg-white rounded shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all p-6 flex flex-col items-center justify-center text-center gap-4 group border-b-4 border-transparent hover:border-[#800000]">
                <div class="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center group-hover:bg-green-700 transition-colors duration-300">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7 text-green-700 group-hover:text-white"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                </div>
                <span class="text-sm font-bold text-stone-600 group-hover:text-green-700 uppercase tracking-wide">Srivari<br>Hundi</span>
             </a>

             <!-- Service Card 3 -->
             <a routerLink="/digital-darshan" class="bg-white rounded shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all p-6 flex flex-col items-center justify-center text-center gap-4 group border-b-4 border-transparent hover:border-[#800000] relative">
                <div class="absolute top-2 right-2 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm">NEW</div>
                <div class="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center group-hover:bg-amber-600 transition-colors duration-300">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7 text-amber-600 group-hover:text-white"><path stroke-linecap="round" stroke-linejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></svg>
                </div>
                <span class="text-sm font-bold text-stone-600 group-hover:text-amber-600 uppercase tracking-wide">Virtual<br>Seva</span>
             </a>

             <!-- Service Card 4 -->
             <a routerLink="/library" class="bg-white rounded shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all p-6 flex flex-col items-center justify-center text-center gap-4 group border-b-4 border-transparent hover:border-[#800000]">
                <div class="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-700 transition-colors duration-300">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7 text-blue-700 group-hover:text-white"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
                </div>
                <span class="text-sm font-bold text-stone-600 group-hover:text-blue-700 uppercase tracking-wide">Digital<br>Library</span>
             </a>

             <!-- Service Card 5 -->
             <a routerLink="/gallery" class="bg-white rounded shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all p-6 flex flex-col items-center justify-center text-center gap-4 group border-b-4 border-transparent hover:border-[#800000]">
                <div class="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center group-hover:bg-purple-700 transition-colors duration-300">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7 text-purple-700 group-hover:text-white"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                </div>
                <span class="text-sm font-bold text-stone-600 group-hover:text-purple-700 uppercase tracking-wide">Photo<br>Gallery</span>
             </a>

              <!-- Service Card 6 -->
             <a [href]="templeService.siteConfig().liveLink" target="_blank" class="bg-white rounded shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all p-6 flex flex-col items-center justify-center text-center gap-4 group border-b-4 border-transparent hover:border-[#800000]">
                <div class="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center group-hover:bg-red-600 transition-colors duration-300">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7 text-red-600 group-hover:text-white"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" /></svg>
                </div>
                <span class="text-sm font-bold text-stone-600 group-hover:text-red-600 uppercase tracking-wide">SVBC<br>Live</span>
             </a>
          </div>
       </div>
    </div>

    <!-- Announcements Section (Supabase Integrated) -->
    <div class="bg-white py-12 border-t border-stone-200">
       <div class="container mx-auto px-4">
          <div class="flex items-center gap-3 mb-8">
             <div class="w-1 h-8 bg-amber-500 rounded"></div>
             <h3 class="text-2xl font-serif font-bold text-[#800000]">Latest Updates & Announcements</h3>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             @if (templeService.news().length === 0) {
                <div class="col-span-full text-center py-8 text-stone-500 bg-stone-50 rounded-lg border border-dashed border-stone-300">
                   No announcements at this moment.
                </div>
             }
             @for (item of templeService.news(); track item.id) {
                <div class="bg-white border border-stone-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full">
                   @if (item.imageUrl) {
                      <div class="h-40 overflow-hidden">
                         <img [src]="item.imageUrl" class="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt="News Image">
                      </div>
                   }
                   <div class="p-6 flex-grow flex flex-col">
                      <div class="flex items-center gap-2 mb-3">
                         <span class="bg-red-50 text-[#800000] text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">News</span>
                         <span class="text-xs text-stone-400 font-bold">{{ item.date | date:'mediumDate' }}</span>
                      </div>
                      <h4 class="text-lg font-bold text-stone-800 mb-3 leading-tight">{{ item.title }}</h4>
                      <div class="text-stone-600 text-sm line-clamp-3 mb-4" [innerHTML]="item.content"></div>
                      
                      <div class="mt-auto">
                         @if (item.attachmentUrl) {
                            <a [href]="item.attachmentUrl" target="_blank" class="inline-flex items-center gap-1 text-sm font-bold text-amber-600 hover:text-amber-700 hover:underline">
                               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" /></svg>
                               Download Attachment
                            </a>
                         }
                      </div>
                   </div>
                </div>
             }
          </div>
       </div>
    </div>

    <!-- Info Stats -->
    <div class="bg-stone-50 py-16 border-t border-stone-200">
       <div class="container mx-auto px-4 flex justify-center">
          <!-- Live Stats (Wait Time) -->
          <div class="w-full max-w-4xl bg-white rounded border border-stone-200 shadow-sm p-6 relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
             <div class="absolute top-0 left-0 w-full md:w-1 h-1 md:h-full bg-[#800000]"></div>
             
             <div class="flex-shrink-0">
                <span class="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-[#800000]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </span>
             </div>
             
             <div class="flex-grow grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-center md:text-left">
                <div>
                   <span class="text-stone-600 text-sm font-medium block mb-1">Sarva Darshan Wait Time</span>
                   <span class="font-bold text-3xl text-[#800000]">{{ templeService.insights().darshanWaitTime }} <span class="text-sm font-normal text-stone-500">mins</span></span>
                </div>
                <div>
                   <span class="text-stone-600 text-sm font-medium block mb-1">Crowd Density</span>
                   <span class="font-bold text-sm px-3 py-1 rounded-full bg-amber-100 text-amber-800 uppercase inline-block">{{ templeService.insights().crowdStatus }}</span>
                </div>
                <div>
                   <span class="text-stone-600 text-sm font-medium block mb-1">Laddu Prasadam</span>
                   <span class="font-bold text-sm px-3 py-1 rounded-full bg-green-100 text-green-800 uppercase flex items-center justify-center md:justify-start gap-1 inline-block">
                      <span class="w-2 h-2 rounded-full bg-green-500"></span> Available
                   </span>
                </div>
             </div>
          </div>
       </div>
    </div>
  `
})
export class HomeComponent {
  templeService = inject(TempleService);
}
