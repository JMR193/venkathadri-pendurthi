
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
    <div class="text-white py-2 overflow-hidden relative shadow-md border-b-4 border-amber-500 bg-[#800000]">
      <div class="container mx-auto px-4 flex items-center">
        <span class="text-[10px] font-extrabold px-3 py-1 rounded bg-amber-500 text-[#800000] mr-4 z-10 whitespace-nowrap uppercase tracking-widest shadow-sm">Latest Updates</span>
        <div class="whitespace-nowrap animate-marquee font-medium text-sm flex items-center gap-8 text-amber-50">
          <span>{{ templeService.flashNews() }}</span>
          <span class="text-amber-400">✦</span>
          <span>Annual Brahmotsavams to be held next month</span>
          <span class="text-amber-400">✦</span>
          <span>Booking for next month's Darshan opens tomorrow at 10 AM</span>
        </div>
      </div>
    </div>

    <!-- Hero Banner -->
    <div class="relative h-[600px] w-full overflow-hidden bg-[#2a0a0a] group">
      <img src="https://opwncdejpaeltylplvhk.supabase.co/storage/v1/object/public/images/channels4_banner.jpg" 
           class="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-[25s] ease-linear group-hover:scale-105" 
           style="object-position: center 25%;"
           alt="Lord Venkateswara">
      
      <div class="absolute inset-0 bg-gradient-to-t from-[#450a0a] via-black/20 to-transparent flex items-center justify-center text-center">
         <div class="container mx-auto px-6 md:px-12 animate-fade-in-up mt-16">
            <h2 class="text-5xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-b from-amber-100 to-amber-400 font-serif font-extrabold drop-shadow-xl mb-2 tracking-tight">Uttarandhra Tirupati</h2>
            <p class="text-amber-200 text-xl md:text-2xl font-serif italic drop-shadow-md mb-8">"Bhuloka Vaikuntham"</p>

            <div class="flex flex-col md:flex-row gap-6 justify-center mt-8">
              @if (templeService.siteConfig().enableBooking) {
                <a routerLink="/booking" class="bg-[#800000] text-amber-100 px-8 py-3 rounded-full font-bold uppercase text-sm tracking-widest border-2 border-amber-500 hover:bg-amber-500 hover:text-[#800000] transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
                  Book Darshan
                </a>
              }
              <a routerLink="/e-hundi" class="bg-white/10 backdrop-blur-md text-white px-8 py-3 rounded-full font-bold uppercase text-sm tracking-widest border-2 border-white/50 hover:bg-white hover:text-[#800000] transition-all flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H4.5a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" /></svg>
                E-Hundi
              </a>
            </div>
         </div>
      </div>
    </div>

    <!-- Pilgrim Services Dashboard (TTD Style) -->
    <div class="bg-stone-100 py-12 relative -mt-10 z-20 rounded-t-3xl">
       <div class="container mx-auto px-4">
          <div class="text-center mb-10">
             <h2 class="text-3xl font-serif font-bold text-[#800000] uppercase tracking-wide">Pilgrim Services</h2>
             <div class="w-16 h-1 bg-amber-500 mx-auto mt-2"></div>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
             <!-- Service Tile 1: Digital Darshan (New) -->
             <a routerLink="/digital-darshan" class="bg-[#2a0a0a] p-6 rounded-xl shadow-md border-b-4 border-amber-500 hover:-translate-y-2 transition-transform duration-300 flex flex-col items-center justify-center text-center group relative overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div class="w-14 h-14 bg-amber-500 rounded-full flex items-center justify-center text-[#2a0a0a] mb-3 group-hover:scale-110 transition-transform">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                </div>
                <h3 class="font-bold text-amber-100 text-sm z-10">3D Digital Darshan</h3>
                <span class="absolute top-2 right-2 text-[8px] bg-red-600 text-white px-1.5 py-0.5 rounded font-bold animate-pulse">NEW</span>
             </a>

             <!-- Service Tile 2 -->
             <a routerLink="/booking" class="bg-white p-6 rounded-xl shadow-md border-b-4 border-amber-500 hover:-translate-y-2 transition-transform duration-300 flex flex-col items-center justify-center text-center group">
                <div class="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center text-[#800000] mb-3 group-hover:bg-[#800000] group-hover:text-white transition-colors">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
                </div>
                <h3 class="font-bold text-stone-700 text-sm">Darshan</h3>
             </a>

             <!-- Service Tile 3 -->
             <a routerLink="/e-hundi" class="bg-white p-6 rounded-xl shadow-md border-b-4 border-amber-500 hover:-translate-y-2 transition-transform duration-300 flex flex-col items-center justify-center text-center group">
                <div class="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center text-[#800000] mb-3 group-hover:bg-[#800000] group-hover:text-white transition-colors">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H4.5a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" /></svg>
                </div>
                <h3 class="font-bold text-stone-700 text-sm">E-Hundi</h3>
             </a>

             <!-- Service Tile 4 -->
             <a routerLink="/library" class="bg-white p-6 rounded-xl shadow-md border-b-4 border-amber-500 hover:-translate-y-2 transition-transform duration-300 flex flex-col items-center justify-center text-center group">
                <div class="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center text-[#800000] mb-3 group-hover:bg-[#800000] group-hover:text-white transition-colors">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
                </div>
                <h3 class="font-bold text-stone-700 text-sm">Library</h3>
             </a>

             <!-- Service Tile 5 -->
             <a routerLink="/gallery" class="bg-white p-6 rounded-xl shadow-md border-b-4 border-amber-500 hover:-translate-y-2 transition-transform duration-300 flex flex-col items-center justify-center text-center group">
                <div class="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center text-[#800000] mb-3 group-hover:bg-[#800000] group-hover:text-white transition-colors">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
                </div>
                <h3 class="font-bold text-stone-700 text-sm">Gallery</h3>
             </a>

             <!-- Service Tile 6 -->
             <a [href]="templeService.siteConfig().liveLink" target="_blank" class="bg-white p-6 rounded-xl shadow-md border-b-4 border-amber-500 hover:-translate-y-2 transition-transform duration-300 flex flex-col items-center justify-center text-center group">
                <div class="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center text-[#800000] mb-3 group-hover:bg-[#800000] group-hover:text-white transition-colors relative">
                   <span class="absolute top-0 right-0 flex h-3 w-3">
                      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                   </span>
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
                </div>
                <h3 class="font-bold text-stone-700 text-sm">Live Seva</h3>
             </a>
          </div>
       </div>
    </div>

    <!-- Live Stats Bar -->
    <div class="bg-white border-y border-stone-200">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-2 md:grid-cols-4 divide-x divide-stone-200">
          <div class="p-4 flex flex-col items-center justify-center text-center">
             <p class="text-xs font-bold text-stone-500 uppercase tracking-wider">Darshan Wait</p>
             <p class="text-2xl font-serif font-bold text-[#800000]">{{ templeService.insights().darshanWaitTime }} <span class="text-sm font-sans">min</span></p>
          </div>
          <div class="p-4 flex flex-col items-center justify-center text-center">
             <p class="text-xs font-bold text-stone-500 uppercase tracking-wider">Crowd Status</p>
             <p class="text-2xl font-serif font-bold text-[#800000]">{{ templeService.insights().crowdStatus }}</p>
          </div>
          <div class="p-4 flex flex-col items-center justify-center text-center">
             <p class="text-xs font-bold text-stone-500 uppercase tracking-wider">Prasadam</p>
             <p class="text-2xl font-serif font-bold text-[#800000]">{{ templeService.insights().laddusDistributed | number }}</p>
          </div>
          <div class="p-4 flex flex-col items-center justify-center text-center">
             <p class="text-xs font-bold text-stone-500 uppercase tracking-wider">Temperature</p>
             <p class="text-2xl font-serif font-bold text-[#800000]">{{ templeService.weather().temp }}°C</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Daily Panchangam (Traditional Look) -->
    <div class="bg-[#800000] text-amber-50 py-16 relative overflow-hidden">
       <div class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/sativa.png')]"></div>
       <div class="container mx-auto px-4 relative z-10">
          <div class="flex flex-col md:flex-row items-center gap-8 bg-white/5 border border-amber-500/30 rounded-xl p-8 backdrop-blur-sm">
             <!-- Date Badge -->
             <div class="flex-shrink-0 text-center border-r border-amber-500/30 pr-8 mr-4 hidden md:block">
                <div class="text-6xl font-serif font-bold text-amber-400">{{ getDay(templeService.dailyPanchangam().date) }}</div>
                <div class="text-xl uppercase tracking-widest">{{ getMonth(templeService.dailyPanchangam().date) }}</div>
                <div class="text-sm opacity-75 mt-2">{{ templeService.dailyPanchangam().date | date:'EEEE' }}</div>
             </div>
             
             <!-- Details -->
             <div class="flex-grow grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
                <div>
                   <p class="text-[10px] uppercase font-bold text-amber-400 tracking-widest mb-1">Tithi</p>
                   <p class="text-lg font-serif font-bold">{{ templeService.dailyPanchangam().tithi }}</p>
                </div>
                <div>
                   <p class="text-[10px] uppercase font-bold text-amber-400 tracking-widest mb-1">Nakshatra</p>
                   <p class="text-lg font-serif font-bold">{{ templeService.dailyPanchangam().nakshatra }}</p>
                </div>
                <div>
                   <p class="text-[10px] uppercase font-bold text-amber-400 tracking-widest mb-1">Yogam</p>
                   <p class="text-lg font-serif font-bold">{{ templeService.dailyPanchangam().yogam }}</p>
                </div>
                <div>
                   <p class="text-[10px] uppercase font-bold text-red-300 tracking-widest mb-1">Rahu Kalam</p>
                   <p class="text-lg font-serif font-bold">{{ templeService.dailyPanchangam().rahuKalam }}</p>
                </div>
             </div>
          </div>
       </div>
    </div>

    <!-- Upcoming Events & News Section (Grid Layout) -->
    <div class="py-20 bg-stone-50 relative">
      <div class="container mx-auto px-4">
         <div class="text-center mb-16">
             <div class="inline-flex items-center justify-center w-12 h-12 mb-4 bg-white rounded-full shadow-md text-[#800000] border border-amber-200">
                <span class="text-2xl font-serif">ॐ</span>
             </div>
             <h2 class="text-4xl font-bold font-serif mb-2 text-[#800000]">Upcoming Events & Updates</h2>
             <div class="w-24 h-1 bg-amber-500 mx-auto rounded"></div>
         </div>

         <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            @for (item of templeService.news(); track item.id) {
               <div class="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-stone-100 overflow-hidden flex flex-col h-full">
                  <div class="h-56 overflow-hidden relative bg-stone-200">
                     @if (item.imageUrl) {
                        <img [src]="item.imageUrl" alt="Event Image" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                     } @else {
                        <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-orange-200 opacity-50">
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 text-[#800000]/20"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" /></svg>
                        </div>
                     }
                     <div class="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-stone-200 overflow-hidden text-center min-w-[3.5rem]">
                        <div class="bg-[#800000] text-white text-[10px] font-extrabold py-1 px-2 uppercase tracking-widest">{{ getMonth(item.date) }}</div>
                        <div class="py-2 px-2">
                           <span class="block text-2xl font-bold font-serif text-stone-800 leading-none">{{ getDay(item.date) }}</span>
                        </div>
                     </div>
                  </div>
                  <div class="p-6 flex-grow flex flex-col">
                     <h4 class="text-xl font-bold font-serif text-[#800000] mb-3 group-hover:text-amber-600 transition-colors leading-tight">{{ item.title }}</h4>
                     <div class="text-stone-600 text-sm leading-relaxed mb-4 line-clamp-3 flex-grow" [innerHTML]="item.content"></div>
                     <div class="pt-4 border-t border-stone-100 flex items-center justify-between mt-auto">
                        <span class="text-xs text-stone-400 font-semibold">{{ item.date | date:'shortTime' }}</span>
                        @if (item.attachmentUrl) {
                           <a [href]="item.attachmentUrl" target="_blank" class="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full hover:bg-amber-100 transition-colors">Download Info</a>
                        }
                     </div>
                  </div>
               </div>
            }
         </div>
      </div>
    </div>
    
    <!-- Social Media Connect -->
    <div class="bg-stone-900 py-20 text-center border-t-8 border-amber-600 relative overflow-hidden">
       <div class="container mx-auto px-4 relative z-10">
          <h2 class="text-3xl md:text-4xl font-serif text-amber-100 mb-4 font-bold">Divine Connect</h2>
          <p class="text-stone-400 mb-10 max-w-2xl mx-auto">Stay connected with the divine. Follow the official channels for live updates.</p>
          
          <div class="flex flex-wrap justify-center gap-8">
             <!-- WhatsApp -->
             <a [href]="templeService.siteConfig().whatsappChannel" target="_blank" 
                class="group bg-[#25D366] hover:bg-[#1ebd59] text-white pl-6 pr-8 py-4 rounded-full font-bold text-lg flex items-center gap-4 transition-all hover:scale-105 hover:shadow-[0_0_25px_rgba(37,211,102,0.4)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.506-.669-.516-.173-.009-.371-.009-.57-.009-.198 0-.52.074-.792.372-.272.297-1.04 1.017-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                <div class="text-left">
                   <div class="text-[10px] uppercase font-bold opacity-80">Join Channel</div>
                   <div class="leading-none">Sri Venkatadri Pendhurti</div>
                </div>
             </a>
             
             <!-- YouTube -->
             <a [href]="templeService.siteConfig().liveLink" target="_blank" 
                class="group bg-[#FF0000] hover:bg-[#cc0000] text-white pl-6 pr-8 py-4 rounded-full font-bold text-lg flex items-center gap-4 transition-all hover:scale-105 hover:shadow-[0_0_25px_rgba(255,0,0,0.4)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                <div class="text-left">
                   <div class="text-[10px] uppercase font-bold opacity-80">Subscribe Now</div>
                   <div class="leading-none">Official YouTube</div>
                </div>
             </a>
          </div>
       </div>
    </div>
  `
})
export class HomeComponent {
  templeService = inject(TempleService);

  getMonth(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleString('default', { month: 'short' });
  }

  getDay(dateStr: string): string {
    const date = new Date(dateStr);
    return date.getDate().toString().padStart(2, '0');
  }
}
