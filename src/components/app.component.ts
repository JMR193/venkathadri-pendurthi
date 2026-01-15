
import { Component, ChangeDetectionStrategy, inject, signal, ViewChild, ElementRef } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { TempleService } from '../services/temple.service';
import { ChatComponent } from './chat.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ChatComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen flex flex-col bg-stone-50">
      <!-- Background Audio Element -->
      <audio #bgMusic loop src="https://www.tirumala.org/music/slogan.mp3"></audio>

      <!-- Top Bar -->
      <div class="bg-red-900 text-amber-100 text-sm py-2 px-4 flex justify-between items-center transition-colors duration-500" [class.bg-red-950]="isMusicPlaying()">
        <div class="container mx-auto flex flex-col md:flex-row justify-between items-center">
          
          <!-- Left Side: Mantra & Music Toggle -->
          <div class="flex items-center gap-4 mb-2 md:mb-0">
            <span class="font-serif tracking-wider font-bold text-amber-300">Om Namo Venkatesaya</span>
            
            <!-- Music Toggle Button -->
            <button (click)="toggleMusic()" 
               class="flex items-center gap-2 px-3 py-1 rounded-full border border-amber-800 bg-black/20 hover:bg-amber-900 transition-all shadow-sm group cursor-pointer"
               [title]="isMusicPlaying() ? 'Pause Chanting' : 'Play Background Chanting'">
               @if (isMusicPlaying()) {
                   <div class="relative flex h-3 w-3">
                     <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                     <span class="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                   </div>
                   <span class="text-xs font-bold text-amber-400 animate-pulse">PLAYING</span>
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-amber-400">
                     <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                   </svg>
               } @else {
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-stone-400 group-hover:text-white">
                     <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                   </svg>
                   <span class="text-xs font-bold text-stone-400 group-hover:text-white">Play Chant</span>
               }
            </button>
          </div>

          <div class="flex gap-4 items-center">
            <a [href]="'tel:' + templeService.siteConfig().contactPhone" class="hover:text-white transition-colors">Help Desk: {{ templeService.siteConfig().contactPhone }}</a>
            <span class="opacity-50">|</span>
            <a [href]="templeService.siteConfig().liveLink" target="_blank" class="hover:text-white transition-colors animate-pulse font-bold text-amber-400 flex items-center gap-1">
               <span class="w-2 h-2 rounded-full bg-red-500"></span> Live Darshan
            </a>
            <span class="opacity-50">|</span>
            
            @if (templeService.currentUser()) {
               @if (templeService.isAdmin()) {
                  <span class="font-bold text-amber-400">Admin</span>
                  <a routerLink="/admin" class="hover:text-white transition-colors">Dashboard</a>
               } @else {
                  <span class="font-bold text-amber-400">Welcome, Devotee</span>
                  <a routerLink="/booking" class="hover:text-white transition-colors">My Profile</a>
               }
               <button (click)="templeService.logout()" class="hover:text-red-300 font-bold ml-2">Logout</button>
            } @else {
               <a routerLink="/login" class="font-bold text-amber-200 hover:text-white transition-colors">Log In / Sign Up</a>
               <span class="opacity-50">|</span>
               <a routerLink="/admin" class="hover:text-white transition-colors text-xs opacity-70">Admin Login</a>
            }
          </div>
        </div>
      </div>

      <!-- Header / Navigation -->
      <header class="bg-white shadow-md sticky top-0 z-50 border-b-4 border-amber-500">
        <div class="container mx-auto px-4 py-3 flex justify-between items-center">
          <!-- Logo Area -->
          <div class="flex items-center gap-4 cursor-pointer" routerLink="/">
            <div class="w-16 h-16 md:w-20 md:h-20 bg-amber-100 rounded-full flex items-center justify-center border-2 border-red-800 shadow-inner overflow-hidden">
               <img [src]="templeService.siteConfig().logoUrl" alt="Logo" class="object-cover w-full h-full opacity-90" />
            </div>
            <div>
              <h1 class="text-xl md:text-2xl font-bold text-red-900 leading-tight">{{ templeService.siteConfig().templeName }}</h1>
              <p class="text-xs md:text-sm text-stone-600 font-semibold tracking-wide">{{ templeService.siteConfig().subTitle }}</p>
            </div>
          </div>

          <!-- Desktop Nav -->
          <nav class="hidden lg:flex gap-1 items-center">
            <a routerLink="/" routerLinkActive="bg-red-50 text-red-800" [routerLinkActiveOptions]="{exact: true}" class="px-3 py-2 rounded-lg font-bold text-stone-700 hover:bg-red-50 hover:text-red-800 transition-colors">Home</a>
            <a routerLink="/history" routerLinkActive="bg-red-50 text-red-800" class="px-3 py-2 rounded-lg font-bold text-stone-700 hover:bg-red-50 hover:text-red-800 transition-colors">History</a>
            <a routerLink="/booking" routerLinkActive="bg-red-50 text-red-800" class="px-3 py-2 rounded-lg font-bold text-stone-700 hover:bg-red-50 hover:text-red-800 transition-colors flex items-center gap-1">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
               Booking
            </a>
            <a routerLink="/e-hundi" routerLinkActive="bg-red-50 text-red-800" class="px-3 py-2 rounded-lg font-bold text-stone-700 hover:bg-red-50 hover:text-red-800 transition-colors">E-Hundi</a>
            <a routerLink="/library" routerLinkActive="bg-red-50 text-red-800" class="px-3 py-2 rounded-lg font-bold text-stone-700 hover:bg-red-50 hover:text-red-800 transition-colors">Library</a>
            <a routerLink="/gallery" routerLinkActive="bg-red-50 text-red-800" class="px-3 py-2 rounded-lg font-bold text-stone-700 hover:bg-red-50 hover:text-red-800 transition-colors">Gallery</a>
            <a routerLink="/feedback" routerLinkActive="bg-red-50 text-red-800" class="px-3 py-2 rounded-lg font-bold text-stone-700 hover:bg-red-50 hover:text-red-800 transition-colors">Feedback</a>
            
            @if (templeService.isAdmin()) {
              <a routerLink="/admin" routerLinkActive="bg-red-50 text-red-800" class="px-3 py-2 rounded-lg font-bold text-amber-700 border border-amber-200 bg-amber-50 ml-2">CMS Dashboard</a>
            } @else {
              <!-- Explicit Admin Login Link for visibility -->
              <a routerLink="/admin" class="ml-2 px-3 py-1 rounded text-xs font-bold text-stone-400 hover:text-amber-700 hover:bg-stone-100 transition-colors border border-transparent hover:border-stone-200">
                 Admin Login
              </a>
            }
          </nav>

          <!-- Mobile Menu Button (Simple) -->
          <button class="lg:hidden text-red-900 p-2" (click)="toggleMobileMenu()">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>

        <!-- Mobile Nav Drawer (Basic implementation) -->
        @if (isMobileMenuOpen()) {
          <div class="lg:hidden bg-stone-100 border-t border-stone-200 animate-fade-in">
            <nav class="flex flex-col p-4 gap-2">
              <a (click)="closeMobileMenu()" routerLink="/" class="px-4 py-3 rounded-md bg-white shadow-sm font-semibold text-stone-800 hover:bg-red-50">Home</a>
              <a (click)="closeMobileMenu()" routerLink="/history" class="px-4 py-3 rounded-md bg-white shadow-sm font-semibold text-stone-800 hover:bg-red-50">History & Info</a>
              <a (click)="closeMobileMenu()" routerLink="/booking" class="px-4 py-3 rounded-md bg-amber-50 shadow-sm font-bold text-red-900 hover:bg-red-50 border border-amber-200">Darshan Booking</a>
              <a (click)="closeMobileMenu()" routerLink="/e-hundi" class="px-4 py-3 rounded-md bg-white shadow-sm font-semibold text-stone-800 hover:bg-red-50">E-Hundi</a>
              <a (click)="closeMobileMenu()" routerLink="/library" class="px-4 py-3 rounded-md bg-white shadow-sm font-semibold text-stone-800 hover:bg-red-50">Library</a>
              <a (click)="closeMobileMenu()" routerLink="/gallery" class="px-4 py-3 rounded-md bg-white shadow-sm font-semibold text-stone-800 hover:bg-red-50">Gallery</a>
              <a (click)="closeMobileMenu()" routerLink="/feedback" class="px-4 py-3 rounded-md bg-white shadow-sm font-semibold text-stone-800 hover:bg-red-50">Feedback</a>
              
              @if (templeService.currentUser()) {
                 <button (click)="templeService.logout()" class="px-4 py-3 rounded-md bg-red-100 font-bold text-red-900 mt-2">Logout</button>
              } @else {
                 <a (click)="closeMobileMenu()" routerLink="/login" class="px-4 py-3 rounded-md bg-[#800000] text-white font-bold mt-2 text-center shadow">Log In / Sign Up</a>
                 <a (click)="closeMobileMenu()" routerLink="/admin" class="px-4 py-3 rounded-md bg-stone-200 text-stone-600 font-bold mt-2 text-center text-sm">Admin Login</a>
              }
            </nav>
          </div>
        }
      </header>

      <!-- Main Content -->
      <main class="flex-grow">
        <router-outlet></router-outlet>
      </main>

      <!-- Footer -->
      <footer class="bg-[#2a0a0a] text-stone-300 py-12 border-t-8 border-red-900">
        <div class="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 class="text-xl font-bold text-amber-500 mb-4 font-serif">Contact Us</h3>
            <p class="mb-2"><strong>{{ templeService.siteConfig().templeName }}</strong></p>
            <p class="mb-1">Pendurthi, Visakhapatnam</p>
            <p class="mb-1">{{ templeService.siteConfig().subTitle }}</p>
            <p class="mt-4 text-sm text-stone-400">Email: {{ templeService.siteConfig().contactEmail }}</p>
          </div>
          <div>
            <h3 class="text-xl font-bold text-amber-500 mb-4 font-serif">Quick Links</h3>
            <ul class="space-y-2">
              <li><a routerLink="/history" class="hover:text-amber-400 transition-colors">History & Timings</a></li>
              <li><a routerLink="/booking" class="hover:text-amber-400 transition-colors">Darshan Booking</a></li>
              <li><a routerLink="/e-hundi" class="hover:text-amber-400 transition-colors">E-Hundi Donation</a></li>
              <li><a routerLink="/library" class="hover:text-amber-400 transition-colors">Spiritual Library</a></li>
              <li><a routerLink="/gallery" class="hover:text-amber-400 transition-colors">Photo Gallery</a></li>
              <li><a [href]="templeService.siteConfig().liveLink" target="_blank" class="hover:text-amber-400 transition-colors">YouTube Channel</a></li>
              @if (!templeService.isAdmin()) {
                 <li><a routerLink="/admin" class="hover:text-amber-400 transition-colors opacity-70">Admin Portal</a></li>
              }
            </ul>
          </div>
          <div>
            <h3 class="text-xl font-bold text-amber-500 mb-4 font-serif">Temple Timing</h3>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <span>Suprabhatam:</span> <span>05:00 AM</span>
              <span>Darshanam:</span> <span>06:00 AM - 01:00 PM</span>
              <span>Break:</span> <span>01:00 PM - 04:00 PM</span>
              <span>Darshanam:</span> <span>04:00 PM - 08:30 PM</span>
              <span>Ekantha Seva:</span> <span>09:00 PM</span>
            </div>
          </div>
        </div>
        <div class="text-center mt-12 pt-8 border-t border-stone-800 text-sm text-stone-500">
          <p class="mb-1">&copy; 2026 {{ templeService.siteConfig().templeName }}. All Rights Reserved.</p>
          <p class="text-xs font-medium tracking-wide opacity-80">
            Designed & Developed by <span class="text-amber-600 font-bold uppercase tracking-widest hover:text-amber-500 transition-colors">JMRSai Technologies</span>
          </p>
        </div>
      </footer>
    </div>
  `
})
export class AppComponent {
  templeService = inject(TempleService);
  
  @ViewChild('bgMusic') bgMusicRef!: ElementRef<HTMLAudioElement>;
  
  isMusicPlaying = signal<boolean>(false);
  isMobileMenuOpen = signal<boolean>(false);

  toggleMusic() {
    const audio = this.bgMusicRef.nativeElement;
    if (this.isMusicPlaying()) {
      audio.pause();
      this.isMusicPlaying.set(false);
    } else {
      audio.play().catch(e => console.error("Audio play failed", e));
      this.isMusicPlaying.set(true);
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
  }
}
