
import { Component, inject, signal, effect, OnDestroy, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { TempleService, LibraryItem, Booking, NewsItem, GalleryItem, Donation, TempleInsights, Panchangam, SiteConfig, FeedbackItem, ThemeConfig } from '../services/temple.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-stone-100 font-sans flex flex-col">
      
      <!-- Login Overlay (Admin Access Only) -->
      @if (!templeService.isAdmin()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-red-900/95 backdrop-blur-sm">
          <div class="w-full max-w-md bg-white p-8 themed-rounded-xl shadow-2xl border-2 border-amber-400 animate-fade-in relative">
             
             <!-- Connection Status Indicator -->
             <div class="absolute top-4 right-4 flex items-center gap-2 text-xs font-bold cursor-pointer" (click)="checkConnection()">
               @if (templeService.connectionStatus() === 'connected') {
                 <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                 <span class="text-green-700">System Online</span>
               } @else if (templeService.connectionStatus() === 'checking') {
                 <span class="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                 <span class="text-yellow-700">Connecting...</span>
               } @else {
                 <span class="w-2 h-2 bg-red-500 rounded-full"></span>
                 <span class="text-red-700">Backend Offline</span>
               }
             </div>

             <div class="text-center mb-6">
               <div class="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2 border border-red-800">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-red-900"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
               </div>
               <h2 class="text-3xl font-serif font-bold text-red-900">Admin Portal</h2>
               <p class="text-stone-500 text-sm">Authorized Personnel Only</p>
             </div>
             
             @if (requires2FA) {
                <div class="mb-4 text-center">
                   <p class="text-sm font-bold text-stone-700 mb-2">Enter 2FA Code</p>
                   <input type="text" [(ngModel)]="otp" class="w-full text-center p-3 border themed-rounded text-2xl tracking-widest font-mono" placeholder="------" maxlength="6">
                   <button (click)="verifyOTP()" class="w-full mt-4 bg-amber-600 text-white p-3 themed-rounded font-bold hover:bg-amber-700">Verify</button>
                </div>
             } @else {
                <div class="mb-4 bg-amber-50 p-3 rounded text-xs text-amber-800 border border-amber-200">
                   <strong>Note:</strong> Public users, please use the <a routerLink="/login" class="underline font-bold">Devotee Login</a> page.
                </div>
                <input type="email" [(ngModel)]="email" class="w-full mb-4 p-3 border themed-rounded" placeholder="Admin Email Address">
                <input type="password" [(ngModel)]="password" class="w-full mb-4 p-3 border themed-rounded" placeholder="Password">
                <button (click)="handleLogin()" class="w-full bg-red-900 text-white p-3 themed-rounded font-bold hover:bg-red-800 transition-colors">Admin Login</button>
             }
             
             @if(loginError) {
                 <p class="text-red-500 text-center mt-4 bg-red-50 p-2 themed-rounded text-sm">{{loginError}}</p>
             }
          </div>
        </div>
      } @else {
        
        <div class="flex flex-1 overflow-hidden h-screen">
          
          <!-- Sidebar Navigation -->
          <aside class="w-64 bg-stone-900 text-amber-50 flex flex-col shadow-2xl z-20 border-r border-stone-800 flex-shrink-0">
            <div class="p-6 border-b border-stone-800 flex items-center gap-3">
                <div class="w-8 h-8 bg-amber-500 themed-rounded flex items-center justify-center text-stone-900 font-bold">A</div>
                <div>
                  <h3 class="font-bold text-amber-400">Temple CMS</h3>
                  <p class="text-[10px] text-stone-400">v4.3 • Live</p>
                </div>
            </div>

            <nav class="flex-grow p-4 space-y-1 overflow-y-auto custom-scrollbar">
              <button (click)="setActiveTab('dashboard')" [class.bg-red-900]="activeTab() === 'dashboard'" class="w-full text-left px-4 py-3 themed-rounded-lg flex gap-3 transition-all hover:bg-stone-800 text-sm font-medium">
                 Dashboard
              </button>
              <button (click)="setActiveTab('insights')" [class.bg-red-900]="activeTab() === 'insights'" class="w-full text-left px-4 py-3 themed-rounded-lg flex gap-3 transition-all hover:bg-stone-800 text-sm font-bold text-green-400 border border-green-900/30">
                 Live Insights Update
              </button>
              <button (click)="setActiveTab('panchangam')" [class.bg-red-900]="activeTab() === 'panchangam'" class="w-full text-left px-4 py-3 themed-rounded-lg flex gap-3 transition-all hover:bg-stone-800 text-sm font-medium text-amber-200">
                 Panchangam Editor
              </button>
              <button (click)="setActiveTab('history')" [class.bg-red-900]="activeTab() === 'history'" class="w-full text-left px-4 py-3 themed-rounded-lg flex gap-3 transition-all hover:bg-stone-800 text-sm font-medium">
                 History & Info
              </button>
              <button (click)="setActiveTab('bookings')" [class.bg-red-900]="activeTab() === 'bookings'" class="w-full text-left px-4 py-3 themed-rounded-lg flex gap-3 transition-all hover:bg-stone-800 text-sm font-medium">
                 Darshan Bookings
              </button>
              <button (click)="setActiveTab('donations')" [class.bg-red-900]="activeTab() === 'donations'" class="w-full text-left px-4 py-3 themed-rounded-lg flex gap-3 transition-all hover:bg-stone-800 text-sm font-medium">
                 Donations Ledger
              </button>
              <button (click)="setActiveTab('news')" [class.bg-red-900]="activeTab() === 'news'" class="w-full text-left px-4 py-3 themed-rounded-lg flex gap-3 transition-all hover:bg-stone-800 text-sm font-medium">
                 Announcements
              </button>
              <button (click)="setActiveTab('gallery')" [class.bg-red-900]="activeTab() === 'gallery'" class="w-full text-left px-4 py-3 themed-rounded-lg flex gap-3 transition-all hover:bg-stone-800 text-sm font-medium">
                 Gallery Manager
              </button>
              <button (click)="setActiveTab('library')" [class.bg-red-900]="activeTab() === 'library'" class="w-full text-left px-4 py-3 themed-rounded-lg flex gap-3 transition-all hover:bg-stone-800 text-sm font-medium">
                 Library Uploads
              </button>
              <button (click)="setActiveTab('feedback')" [class.bg-red-900]="activeTab() === 'feedback'" class="w-full text-left px-4 py-3 themed-rounded-lg flex gap-3 transition-all hover:bg-stone-800 text-sm font-medium">
                 User Feedback
              </button>
              
              <div class="pt-4 mt-4 border-t border-stone-800">
                <button (click)="setActiveTab('config')" [class.bg-red-900]="activeTab() === 'config'" class="w-full text-left px-4 py-3 themed-rounded-lg flex gap-3 transition-all hover:bg-stone-800 text-sm font-medium">
                    Global Settings
                </button>
                <button (click)="setActiveTab('theme')" [class.bg-red-900]="activeTab() === 'theme'" class="w-full text-left px-4 py-3 themed-rounded-lg flex gap-3 transition-all hover:bg-stone-800 text-sm font-medium">
                    Theme & Design
                </button>
                <button (click)="setActiveTab('reports')" [class.bg-red-900]="activeTab() === 'reports'" class="w-full text-left px-4 py-3 themed-rounded-lg flex gap-3 transition-all hover:bg-stone-800 text-sm font-medium">
                    Reports & Exports
                </button>
              </div>
            </nav>
            <div class="p-4 border-t border-stone-800">
               <a routerLink="/" class="block w-full text-left px-4 py-2 hover:bg-stone-800 themed-rounded text-sm text-stone-400 hover:text-white transition-colors mb-2">Back to Website</a>
               <button (click)="templeService.logout()" class="w-full text-left px-4 py-2 hover:bg-red-900 themed-rounded text-sm text-stone-400 hover:text-white transition-colors">Sign Out</button>
            </div>
          </aside>

          <!-- Main Content Area -->
          <main class="flex-grow p-8 overflow-y-auto bg-stone-100">
            
            <!-- Dashboard View -->
            @if (activeTab() === 'dashboard') {
              <header class="flex justify-between items-center mb-8">
                 <h2 class="text-3xl font-serif font-bold text-stone-800">Overview</h2>
                 <button (click)="checkConnection()" class="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border transition-colors cursor-pointer"
                    [class.bg-green-100]="templeService.connectionStatus() === 'connected'" 
                    [class.text-green-800]="templeService.connectionStatus() === 'connected'"
                    [class.border-green-200]="templeService.connectionStatus() === 'connected'"
                    [class.bg-red-100]="templeService.connectionStatus() !== 'connected'"
                    [class.text-red-800]="templeService.connectionStatus() !== 'connected'">
                    @if (templeService.connectionStatus() === 'connected') {
                        <span class="w-2 h-2 bg-green-500 rounded-full"></span> System Online
                    } @else {
                        <span class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span> Check Connection
                    }
                 </button>
              </header>
              
              <!-- Quick Actions -->
              <div class="bg-white p-6 themed-rounded-xl shadow-sm border border-stone-200 mb-8 flex flex-col md:flex-row gap-8 items-center justify-between flex-wrap">
                  <div class="flex items-center gap-4">
                    <div>
                        <h3 class="font-bold text-stone-700">Maintenance Mode</h3>
                        <p class="text-xs text-stone-500">Pauses public access to the site.</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" [checked]="configForm.maintenanceMode" (change)="toggleMaintenanceMode($event)" class="sr-only peer">
                        <div class="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>
                  <div class="flex items-center gap-4">
                    <div>
                        <h3 class="font-bold text-stone-700">Festival Mode</h3>
                        <p class="text-xs text-stone-500">Activates special theme & animations.</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" [checked]="templeService.festivalMode()" (change)="toggleFestivalMode($event)" class="sr-only peer">
                        <div class="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                    </label>
                 </div>

                 <div class="flex-grow md:ml-8 md:border-l md:border-stone-200 md:pl-8">
                     <label class="block text-xs font-bold text-stone-500 uppercase mb-1">Live Ticker Announcement</label>
                     <div class="flex gap-2">
                         <input type="text" [(ngModel)]="tickerText" class="flex-grow p-2 border themed-rounded text-sm bg-stone-50" placeholder="Update Flash News...">
                         <button (click)="updateTicker()" class="bg-stone-800 text-white px-4 themed-rounded text-sm font-bold hover:bg-stone-900">Update</button>
                     </div>
                 </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                 <div class="bg-white p-6 themed-rounded-xl shadow-sm border-l-4 border-amber-500">
                    <p class="text-xs font-bold uppercase tracking-widest text-stone-500">Total Donations</p>
                    <p class="text-4xl font-serif font-bold mt-2 text-stone-800">₹ {{ templeService.totalDonations() | number }}</p>
                    <p class="text-xs text-stone-400 mt-2">{{ templeService.donations().length }} Transactions</p>
                 </div>
                 <div class="bg-white p-6 themed-rounded-xl shadow-sm border-l-4 border-blue-500">
                    <p class="text-xs font-bold uppercase tracking-widest text-stone-500">Feedback Received</p>
                    <p class="text-4xl font-serif font-bold mt-2 text-stone-800">{{ templeService.feedbacks().length }}</p>
                    <p class="text-xs text-stone-400 mt-2">Unread messages</p>
                 </div>
                 <div class="bg-white p-6 themed-rounded-xl shadow-sm border-l-4 border-purple-500">
                    <p class="text-xs font-bold uppercase tracking-widest text-stone-500">Library Items</p>
                    <p class="text-4xl font-serif font-bold mt-2 text-stone-800">{{ templeService.library().length }}</p>
                    <p class="text-xs text-stone-400 mt-2">Audio & E-books</p>
                 </div>
              </div>
            }

            <!-- Live Insights Editor -->
            @if (activeTab() === 'insights') {
               <h2 class="text-2xl font-bold text-stone-800 mb-6 pb-4 border-b border-stone-300">Live Temple Insights</h2>
               <div class="bg-white p-8 themed-rounded-xl shadow-sm border border-stone-200 max-w-4xl">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <!-- Wait Time -->
                     <div class="bg-blue-50 p-6 themed-rounded-lg border border-blue-100">
                        <label class="block text-sm font-bold text-blue-800 mb-2">Wait Time (Minutes)</label>
                        <input type="number" [(ngModel)]="insightsForm.darshanWaitTime" class="w-full p-4 text-3xl font-bold text-blue-900 border border-blue-200 themed-rounded text-center">
                        <p class="text-xs text-blue-600 mt-2">Update this based on current Q-line status.</p>
                     </div>

                     <!-- Crowd Status -->
                     <div class="bg-stone-50 p-6 themed-rounded-lg border border-stone-200">
                        <label class="block text-sm font-bold text-stone-700 mb-2">Crowd Density</label>
                        <div class="flex gap-2">
                           <button (click)="insightsForm.crowdStatus = 'Low'" [class]="insightsForm.crowdStatus === 'Low' ? 'bg-green-600 text-white' : 'bg-white text-stone-600'" class="flex-1 py-3 themed-rounded border border-stone-300 font-bold transition-colors">Low</button>
                           <button (click)="insightsForm.crowdStatus = 'Moderate'" [class]="insightsForm.crowdStatus === 'Moderate' ? 'bg-amber-500 text-white' : 'bg-white text-stone-600'" class="flex-1 py-3 themed-rounded border border-stone-300 font-bold transition-colors">Moderate</button>
                           <button (click)="insightsForm.crowdStatus = 'High'" [class]="insightsForm.crowdStatus === 'High' ? 'bg-red-600 text-white' : 'bg-white text-stone-600'" class="flex-1 py-3 themed-rounded border border-stone-300 font-bold transition-colors">High</button>
                        </div>
                     </div>

                     <!-- Laddu Counters -->
                     <div class="bg-amber-50 p-6 themed-rounded-lg border border-amber-100 md:col-span-2">
                        <h4 class="font-bold text-amber-900 mb-4 border-b border-amber-200 pb-2">Prasadam Inventory</h4>
                        <div class="grid grid-cols-2 gap-6">
                           <div>
                              <label class="block text-xs font-bold text-amber-700 uppercase mb-1">Total Stock</label>
                              <input type="number" [(ngModel)]="insightsForm.ladduStock" class="w-full p-3 font-mono font-bold text-lg border border-amber-200 themed-rounded">
                           </div>
                           <div>
                              <label class="block text-xs font-bold text-amber-700 uppercase mb-1">Distributed Today</label>
                              <input type="number" [(ngModel)]="insightsForm.laddusDistributed" class="w-full p-3 font-mono font-bold text-lg border border-amber-200 themed-rounded">
                           </div>
                        </div>
                     </div>
                  </div>
                  
                  <button (click)="updateInsights()" class="mt-8 w-full bg-green-700 hover:bg-green-800 text-white font-bold py-4 themed-rounded-lg shadow-lg transition-all flex items-center justify-center gap-2">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
                     Update Live Dashboard
                  </button>
               </div>
            }
            
            @if (activeTab() === 'theme') {
                <h2 class="text-2xl font-bold text-stone-800 mb-6 pb-4 border-b border-stone-300">Theme & Design</h2>
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                   <!-- Controls -->
                   <div class="lg:col-span-2 bg-white p-6 themed-rounded-xl shadow-sm border border-stone-200 space-y-8">
                        <div>
                            <h3 class="font-bold text-lg text-stone-700 mb-4">Preset Themes</h3>
                            <div class="flex flex-wrap gap-3">
                                @for(theme of predefinedThemes; track theme.name) {
                                    <button (click)="applyPresetTheme(theme.config)" class="text-sm font-bold px-4 py-2 border-2 themed-rounded hover:scale-105 transition-transform" [style.borderColor]="theme.config.primaryColor" [style.color]="theme.config.primaryColor">{{theme.name}}</button>
                                }
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 border-t pt-6">
                            <div>
                                <h3 class="font-bold text-lg text-stone-700 mb-4">Color Palette</h3>
                                <div class="space-y-4">
                                    <div class="flex items-center justify-between"><label class="font-bold">Primary</label><input type="color" [(ngModel)]="configForm.theme.primaryColor" class="w-10 h-10"></div>
                                    <div class="flex items-center justify-between"><label class="font-bold">Secondary</label><input type="color" [(ngModel)]="configForm.theme.secondaryColor" class="w-10 h-10"></div>
                                    <div class="flex items-center justify-between"><label class="font-bold">Accent</label><input type="color" [(ngModel)]="configForm.theme.accentColor" class="w-10 h-10"></div>
                                    <div class="flex items-center justify-between"><label class="font-bold">Background</label><input type="color" [(ngModel)]="configForm.theme.backgroundColor" class="w-10 h-10"></div>
                                </div>
                            </div>
                            <div>
                                <h3 class="font-bold text-lg text-stone-700 mb-4">Typography</h3>
                                <div class="space-y-4">
                                    <div><label class="block text-sm font-bold text-stone-600 mb-1">Heading Font</label><input [(ngModel)]="configForm.theme.headingFont" class="w-full p-2 border themed-rounded" placeholder="e.g. Cinzel"></div>
                                    <div><label class="block text-sm font-bold text-stone-600 mb-1">Heading Weight</label><input type="range" min="300" max="900" step="100" [(ngModel)]="configForm.theme.headingFontWeight" class="w-full"></div>
                                    <div><label class="block text-sm font-bold text-stone-600 mb-1">Body Font</label><input [(ngModel)]="configForm.theme.bodyFont" class="w-full p-2 border themed-rounded" placeholder="e.g. Lato"></div>
                                    <div><label class="block text-sm font-bold text-stone-600 mb-1">Body Weight</label><input type="range" min="300" max="700" step="100" [(ngModel)]="configForm.theme.bodyFontWeight" class="w-full"></div>
                                </div>
                            </div>
                        </div>
                        <div class="border-t pt-6">
                           <h3 class="font-bold text-lg text-stone-700 mb-2">Border Radius</h3>
                           <div class="flex items-center gap-4">
                              <span class="text-sm">Sharp</span>
                              <input type="range" min="0" max="24" [(ngModel)]="configForm.theme.borderRadius" class="w-full">
                              <span class="text-sm">Round</span>
                           </div>
                        </div>

                        <button (click)="saveConfig()" class="w-full mt-4 bg-blue-600 text-white px-6 py-3 themed-rounded font-bold hover:bg-blue-700">Save Theme</button>
                   </div>
                   <!-- Live Preview -->
                   <div class="lg:col-span-1">
                        <div class="sticky top-8">
                            <h3 class="font-bold text-stone-700 mb-2">Live Preview</h3>
                            <div class="p-4 border-4 border-stone-300 bg-white themed-rounded-xl overflow-hidden">
                                <div class="w-full h-64 flex flex-col items-center justify-center p-4 transition-colors" [style.backgroundColor]="configForm.theme.backgroundColor">
                                    <div class="p-4 shadow-lg border-t-4 themed-rounded" [style.borderColor]="configForm.theme.accentColor" [style.backgroundColor]="'#ffffff'">
                                        <h4 class="text-lg font-bold mb-2" [style.fontFamily]="configForm.theme.headingFont" [style.fontWeight]="configForm.theme.headingFontWeight" [style.color]="configForm.theme.primaryColor">Service Card</h4>
                                        <p class="text-xs mb-4" [style.fontFamily]="configForm.theme.bodyFont" [style.fontWeight]="configForm.theme.bodyFontWeight">This is a preview of the new style settings.</p>
                                        <button class="w-full px-4 py-2 text-white text-sm font-bold" [style.backgroundColor]="configForm.theme.secondaryColor" [style.borderRadius.px]="configForm.theme.borderRadius">Book Now</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                   </div>
                </div>
            }

            <!-- Config View -->
            @if (activeTab() === 'config') {
               <h2 class="text-2xl font-bold text-stone-800 mb-6 pb-4 border-b border-stone-300">Global Settings</h2>
               <div class="bg-white p-8 themed-rounded-xl shadow-sm border border-stone-200 max-w-4xl space-y-8">
                  <!-- General Settings -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label class="block text-sm font-bold text-stone-700 mb-1">Temple Name</label>
                        <input [(ngModel)]="configForm.templeName" class="w-full p-2 border themed-rounded font-bold text-amber-900">
                     </div>
                     <div>
                        <label class="block text-sm font-bold text-stone-700 mb-1">Subtitle</label>
                        <input [(ngModel)]="configForm.subTitle" class="w-full p-2 border themed-rounded">
                     </div>
                  </div>

                  <!-- Booking & Donation Settings -->
                  <div class="border-t pt-6">
                    <h3 class="font-bold text-lg mb-4 text-stone-700">Operations</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                          <label class="block text-sm font-bold text-stone-700 mb-1">Darshan Ticket Price (INR)</label>
                          <input type="number" [(ngModel)]="configForm.darshanPrice" class="w-full p-2 border themed-rounded">
                       </div>
                       <div>
                          <label class="block text-sm font-bold text-stone-700 mb-1">Devotees Per Slot</label>
                          <input type="number" [(ngModel)]="configForm.darshanSlotCapacity" class="w-full p-2 border themed-rounded">
                       </div>
                       <!-- (Quick Amounts Logic would be here if extended) -->
                    </div>
                  </div>

                  <!-- Contact Settings -->
                   <div class="border-t pt-6">
                    <h3 class="font-bold text-lg mb-4 text-stone-700">Contact & Links</h3>
                     <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div class="md:col-span-2">
                          <label class="block text-sm font-bold text-stone-700 mb-1">Logo URL</label>
                          <input [(ngModel)]="configForm.logoUrl" class="w-full p-2 border themed-rounded text-blue-600">
                       </div>
                       <div>
                          <label class="block text-sm font-bold text-stone-700 mb-1">Contact Phone</label>
                          <input [(ngModel)]="configForm.contactPhone" class="w-full p-2 border themed-rounded">
                       </div>
                       <div>
                          <label class="block text-sm font-bold text-stone-700 mb-1">Contact Email</label>
                          <input [(ngModel)]="configForm.contactEmail" class="w-full p-2 border themed-rounded">
                       </div>
                       <div class="md:col-span-2">
                          <label class="block text-sm font-bold text-stone-700 mb-1">Live YouTube Link</label>
                          <input [(ngModel)]="configForm.liveLink" class="w-full p-2 border themed-rounded text-blue-600">
                       </div>
                        <div class="md:col-span-2">
                          <label class="block text-sm font-bold text-stone-700 mb-1">Address</label>
                          <textarea [(ngModel)]="configForm.address" class="w-full p-2 border themed-rounded h-24"></textarea>
                       </div>
                    </div>
                  </div>

                  <div class="flex items-center gap-8 border-t pt-6">
                      <div class="flex items-center gap-3">
                        <label for="enableBooking" class="font-bold text-stone-700">Enable Booking</label>
                        <input type="checkbox" id="enableBooking" [(ngModel)]="configForm.enableBooking" class="w-5 h-5">
                      </div>
                      <div class="flex items-center gap-3">
                        <label for="enableHundi" class="font-bold text-stone-700">Enable E-Hundi</label>
                        <input type="checkbox" id="enableHundi" [(ngModel)]="configForm.enableHundi" class="w-5 h-5">
                      </div>
                  </div>
                  <button (click)="saveConfig()" class="mt-6 w-full bg-blue-600 text-white px-6 py-3 themed-rounded font-bold hover:bg-blue-700">Save Configuration</button>
               </div>
            }

            @if (activeTab() === 'panchangam') {
               <h2 class="text-2xl font-bold text-stone-800 mb-6 pb-4 border-b border-stone-300">Daily Panchangam Editor</h2>
               <div class="bg-white p-8 themed-rounded-xl shadow-sm border border-stone-200 max-w-4xl">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label class="block text-sm font-bold text-stone-700 mb-1">Date String</label>
                        <input [(ngModel)]="panchangamForm.date" class="w-full p-2 border themed-rounded">
                     </div>
                     <div>
                        <label class="block text-sm font-bold text-stone-700 mb-1">Tithi</label>
                        <input [(ngModel)]="panchangamForm.tithi" class="w-full p-2 border themed-rounded">
                     </div>
                     <div>
                        <label class="block text-sm font-bold text-stone-700 mb-1">Nakshatra</label>
                        <input [(ngModel)]="panchangamForm.nakshatra" class="w-full p-2 border themed-rounded">
                     </div>
                     <div>
                        <label class="block text-sm font-bold text-stone-700 mb-1">Yogam</label>
                        <input [(ngModel)]="panchangamForm.yogam" class="w-full p-2 border themed-rounded">
                     </div>
                     <div>
                        <label class="block text-sm font-bold text-stone-700 mb-1">Karanam</label>
                        <input [(ngModel)]="panchangamForm.karanam" class="w-full p-2 border themed-rounded">
                     </div>
                      <div>
                        <label class="block text-sm font-bold text-stone-700 mb-1">Rahu Kalam</label>
                        <input [(ngModel)]="panchangamForm.rahuKalam" class="w-full p-2 border themed-rounded">
                     </div>
                      <div>
                        <label class="block text-sm font-bold text-stone-700 mb-1">Yamagandam</label>
                        <input [(ngModel)]="panchangamForm.yamagandam" class="w-full p-2 border themed-rounded">
                     </div>
                  </div>
                  <button (click)="savePanchangam()" class="mt-6 w-full bg-amber-600 text-white px-6 py-3 themed-rounded font-bold hover:bg-amber-700">Update Panchangam</button>
               </div>
            }
            
            @if (activeTab() === 'reports') {
              <h2 class="text-2xl font-bold text-stone-800 mb-6 pb-4 border-b border-stone-300">Reports & Exports</h2>
              <div class="bg-white p-8 themed-rounded-xl shadow-sm border border-stone-200 max-w-4xl">
                 <h3 class="font-bold text-lg text-stone-700 mb-4">Donations Report</h3>
                 <div class="flex items-end gap-4">
                    <div>
                       <label class="block text-sm font-bold text-stone-600 mb-1">Start Date</label>
                       <input type="date" [(ngModel)]="reportStartDate" class="p-2 border themed-rounded">
                    </div>
                     <div>
                       <label class="block text-sm font-bold text-stone-600 mb-1">End Date</label>
                       <input type="date" [(ngModel)]="reportEndDate" class="p-2 border themed-rounded">
                    </div>
                    <button (click)="generateReport('donations')" class="bg-green-700 text-white px-6 py-2 themed-rounded font-bold hover:bg-green-800">Generate CSV</button>
                 </div>
              </div>
            }
            
            <!-- History Page Editor -->
            @if(activeTab() === 'history') {
               <h2 class="text-2xl font-bold text-stone-800 mb-6 pb-4 border-b border-stone-300">History & Info Page</h2>
               <div class="bg-white p-8 themed-rounded-xl shadow-sm border border-stone-200 max-w-4xl space-y-6">
                  <div>
                     <label class="block text-sm font-bold text-stone-700 mb-1">Main Content</label>
                     <textarea [(ngModel)]="configForm.historyContent" class="w-full p-3 border themed-rounded h-64 font-serif text-stone-800 bg-stone-50"></textarea>
                  </div>
                  <div>
                     <label class="block text-sm font-bold text-stone-700 mb-1">Header Image URL</label>
                     <input [(ngModel)]="configForm.historyImageUrl" class="w-full p-2 border themed-rounded text-blue-600">
                  </div>
                  <button (click)="saveConfig()" class="w-full bg-blue-600 text-white px-6 py-3 themed-rounded font-bold hover:bg-blue-700">Save History Page</button>
               </div>
            }

            <!-- Bookings Manager -->
            @if(activeTab() === 'bookings') {
               <h2 class="text-2xl font-bold text-stone-800 mb-6 pb-4 border-b border-stone-300">Manage Darshan Bookings</h2>
               <div class="bg-white p-6 themed-rounded-xl shadow-sm border border-stone-200">
                  <div class="mb-4">
                     <label class="block text-sm font-bold text-stone-600 mb-1">Select Date</label>
                     <input type="date" [(ngModel)]="bookingDate" (change)="fetchAdminBookings()" class="p-2 border themed-rounded">
                  </div>
                  @if (adminBookings().length > 0) {
                     <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left">
                           <thead class="bg-stone-50 text-stone-600 uppercase"><tr><th class="p-3">Devotee</th><th class="p-3">Mobile</th><th class="p-3">Ticket</th><th class="p-3">Status</th><th class="p-3">Actions</th></tr></thead>
                           <tbody>
                              @for (booking of adminBookings(); track booking.id) {
                                 <tr class="border-b"><td class="p-3 font-bold">{{booking.devoteeName}}</td><td class="p-3">{{booking.mobile}}</td><td class="p-3 font-mono">{{booking.ticketCode}}</td><td class="p-3"><span [class.bg-green-100]="booking.status === 'Booked'" [class.text-green-800]="booking.status === 'Booked'" [class.bg-red-100]="booking.status === 'Cancelled'" [class.text-red-800]="booking.status === 'Cancelled'" class="px-2 py-1 rounded-full text-xs font-bold">{{booking.status}}</span></td><td class="p-3">@if(booking.status === 'Booked'){<button (click)="handleCancelBooking(booking.id!)" class="text-red-600 hover:underline text-xs">Cancel</button>}</td></tr>
                              }
                           </tbody>
                        </table>
                     </div>
                  } @else {
                     <p class="text-center text-stone-500 py-8">No bookings found for the selected date.</p>
                  }
               </div>
            }
            
            <!-- Donations Ledger -->
            @if(activeTab() === 'donations') {
              <h2 class="text-2xl font-bold text-stone-800 mb-6 pb-4 border-b border-stone-300">Donations Ledger</h2>
              <div class="bg-white p-6 themed-rounded-xl shadow-sm border border-stone-200">
                 <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left">
                       <thead class="bg-stone-50 text-stone-600 uppercase"><tr><th class="p-3">Date</th><th class="p-3">Donor</th><th class="p-3">Amount</th><th class="p-3">Category</th><th class="p-3">Transaction ID</th></tr></thead>
                       <tbody>
                          @for (donation of templeService.donations(); track donation.id) {
                             <tr class="border-b"><td class="p-3">{{donation.date | date:'short'}}</td><td class="p-3 font-bold">{{donation.donorName}}</td><td class="p-3 font-mono font-bold">₹{{donation.amount | number}}</td><td class="p-3">{{donation.category}}</td><td class="p-3 font-mono">{{donation.transactionId}}</td></tr>
                          }
                       </tbody>
                    </table>
                 </div>
              </div>
            }

            <!-- News/Announcements Manager with Rich Text -->
            @if(activeTab() === 'news') {
               <h2 class="text-2xl font-bold text-stone-800 mb-6 pb-4 border-b border-stone-300">Announcements</h2>
               <div class="bg-white p-6 themed-rounded-xl shadow-sm border border-stone-200 mb-8">
                  <h3 class="font-bold text-lg mb-4">{{ newsForm.id ? 'Edit' : 'Create' }} Announcement</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <input [(ngModel)]="newsForm.title" placeholder="Title" class="p-2 border themed-rounded md:col-span-2 font-bold text-lg">
                     
                     <div class="md:col-span-2 border border-stone-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-amber-500 transition-shadow">
                        <div class="bg-stone-100 border-b border-stone-200 p-2 flex gap-1 items-center">
                            <button (click)="applyFormat('bold')" title="Bold" class="w-8 h-8 flex items-center justify-center hover:bg-stone-200 rounded font-bold text-stone-700">B</button>
                            <button (click)="applyFormat('italic')" title="Italic" class="w-8 h-8 flex items-center justify-center hover:bg-stone-200 rounded italic font-serif text-stone-700">I</button>
                            <span class="w-px h-6 bg-stone-300 mx-1"></span>
                            <button (click)="applyFormat('h3')" title="Heading" class="w-8 h-8 flex items-center justify-center hover:bg-stone-200 rounded font-bold text-stone-700 text-xs">H3</button>
                            <button (click)="applyFormat('p')" title="Paragraph" class="w-8 h-8 flex items-center justify-center hover:bg-stone-200 rounded font-bold text-stone-700 text-xs">P</button>
                            <span class="w-px h-6 bg-stone-300 mx-1"></span>
                            <button (click)="applyFormat('link')" title="Link" class="w-8 h-8 flex items-center justify-center hover:bg-stone-200 rounded text-stone-700">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"><path d="M12.232 4.232a2.5 2.5 0 0 1 3.536 3.536l-1.225 1.224a.75.75 0 0 0 1.061 1.06l1.224-1.224a4 4 0 0 0-5.656-5.656l-3 3a4 4 0 0 0 .225 5.865.75.75 0 0 0 .977-1.138 2.5 2.5 0 0 1-.142-3.667l3-3Z" /><path d="M11.603 7.96a.75.75 0 0 0-.977 1.138 2.5 2.5 0 0 1 .142 3.667l-3 3a2.5 2.5 0 0 1-3.536-3.536l1.225-1.224a.75.75 0 0 0-1.061-1.06l-1.224 1.224a4 4 0 1 0 5.656 5.656l3-3a4 4 0 0 0-.225-5.865Z" /></svg>
                            </button>
                            <button (click)="applyFormat('list')" title="List" class="w-8 h-8 flex items-center justify-center hover:bg-stone-200 rounded text-stone-700">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"><path fill-rule="evenodd" d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75Zm0 10.5a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1-.75-.75ZM2 10a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 10Z" clip-rule="evenodd" /></svg>
                            </button>
                        </div>
                        <textarea #newsContentArea [(ngModel)]="newsForm.content" placeholder="Content (HTML supported)" class="w-full p-3 h-48 focus:outline-none resize-none bg-white" spellcheck="false"></textarea>
                     </div>

                     <input [(ngModel)]="newsForm.imageUrl" placeholder="Image URL (Optional)" class="p-2 border themed-rounded">
                     <input [(ngModel)]="newsForm.attachmentUrl" placeholder="Attachment URL (Optional)" class="p-2 border themed-rounded">
                  </div>
                  <div class="flex justify-end gap-3 mt-4">
                     @if (newsForm.id) { <button (click)="cancelEdit()" class="text-stone-500 hover:underline font-bold text-sm">Cancel</button> }
                     <button (click)="saveNews()" class="bg-green-700 text-white px-6 py-2 themed-rounded font-bold hover:bg-green-800">Save</button>
                  </div>
               </div>

               <div class="space-y-4">
                  @for (item of templeService.news(); track item.id) {
                     <div class="bg-white p-4 themed-rounded-lg shadow-sm border flex justify-between items-center group hover:border-amber-400 transition-colors">
                        <div>
                           <p class="font-bold text-stone-800">{{item.title}}</p>
                           <p class="text-xs text-stone-500">{{item.date | date:'medium'}}</p>
                           <div class="text-xs text-stone-400 mt-1 line-clamp-1 opacity-70">{{item.content}}</div>
                        </div>
                        <div class="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button (click)="editNews(item)" class="text-blue-600 hover:underline bg-blue-50 px-2 py-1 rounded text-xs font-bold">Edit</button>
                            <button (click)="deleteNews(item.id)" class="text-red-600 hover:underline bg-red-50 px-2 py-1 rounded text-xs font-bold">Delete</button>
                        </div>
                     </div>
                  }
               </div>
            }

            <!-- Gallery Manager with Drag & Drop -->
            @if(activeTab() === 'gallery') {
              <h2 class="text-2xl font-bold text-stone-800 mb-6 pb-4 border-b border-stone-300 flex justify-between items-center">
                  Gallery Manager
                  <span class="text-xs font-normal bg-amber-100 text-amber-800 px-2 py-1 rounded border border-amber-200">Drag to Reorder</span>
              </h2>
              
              <div class="bg-white p-6 themed-rounded-xl shadow-sm border border-stone-200 mb-8">
                 <h3 class="font-bold text-lg mb-4">Add New Media</h3>
                 <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input [(ngModel)]="galleryForm.url" placeholder="Image/Video URL" class="p-2 border themed-rounded md:col-span-2">
                    <select [(ngModel)]="galleryForm.type" class="p-2 border themed-rounded bg-white"><option value="image">Image</option><option value="video">Video</option></select>
                    <input [(ngModel)]="galleryForm.caption" placeholder="Caption" class="p-2 border themed-rounded md:col-span-3">
                 </div>
                 <div class="flex justify-end mt-4"><button (click)="addGalleryItem()" class="bg-green-700 text-white px-6 py-2 themed-rounded font-bold hover:bg-green-800">Add to Gallery</button></div>
              </div>

              <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4" (dragover)="$event.preventDefault()">
                 @for (item of templeService.gallery(); track item.id; let i = $index) {
                    <div 
                        draggable="true" 
                        (dragstart)="onDragStart($event, i)" 
                        (dragover)="onDragOver($event, i)" 
                        (drop)="onDrop($event, i)"
                        class="relative group bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-200"
                        [class.opacity-50]="draggedIdx() === i"
                        [class.scale-105]="draggedIdx() === i"
                        [class.ring-2]="draggedIdx() === i"
                        [class.ring-amber-400]="draggedIdx() === i"
                    >
                        <img [src]="item.url" class="w-full h-32 object-cover pointer-events-none">
                        <div class="p-2 bg-white">
                            <p class="text-xs font-bold text-stone-700 truncate" title="{{item.caption}}">{{item.caption}}</p>
                        </div>
                        <button (click)="deleteGalleryItem(item.id)" class="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-700" title="Delete">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        
                        <!-- Drag Handle Indicator -->
                        <div class="absolute top-1 left-1 bg-black/40 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
                        </div>
                    </div>
                 }
              </div>
            }
            
            <!-- Library Manager -->
            @if(activeTab() === 'library') {
               <h2 class="text-2xl font-bold text-stone-800 mb-6 pb-4 border-b border-stone-300">Library Manager</h2>
               <div class="bg-white p-6 themed-rounded-xl shadow-sm border border-stone-200 mb-8">
                  <h3 class="font-bold text-lg mb-4">Add New Item</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <input [(ngModel)]="libraryForm.title" placeholder="Title" class="p-2 border themed-rounded md:col-span-2">
                     <input [(ngModel)]="libraryForm.url" placeholder="Audio/PDF URL" class="p-2 border themed-rounded">
                     <select [(ngModel)]="libraryForm.type" class="p-2 border themed-rounded bg-white"><option value="audio">Audio</option><option value="ebook">E-Book (PDF)</option></select>
                     <textarea [(ngModel)]="libraryForm.description" placeholder="Description (Optional)" class="p-2 border themed-rounded md:col-span-2 h-20"></textarea>
                  </div>
                  <div class="flex justify-end mt-4"><button (click)="addLibraryItem()" class="bg-green-700 text-white px-6 py-2 themed-rounded font-bold hover:bg-green-800">Add to Library</button></div>
               </div>
               <div class="space-y-3">
                  @for (item of templeService.library(); track item.id) {
                     <div class="bg-white p-3 themed-rounded-lg shadow-sm border flex justify-between items-center"><p class="font-bold">{{item.title}} <span class="text-xs font-normal bg-stone-100 px-2 py-0.5 rounded-full ml-2">{{item.type}}</span></p><button (click)="deleteLibraryItem(item.id)" class="text-red-600 hover:underline">Delete</button></div>
                  }
               </div>
            }

            <!-- Feedback Viewer -->
            @if(activeTab() === 'feedback') {
               <h2 class="text-2xl font-bold text-stone-800 mb-6 pb-4 border-b border-stone-300">User Feedback</h2>
               <div class="space-y-4">
                  @if (templeService.feedbacks().length === 0) {
                     <p class="text-center text-stone-500 py-8">No feedback messages yet.</p>
                  }
                  @for (item of templeService.feedbacks(); track item.id) {
                     <div class="bg-white p-4 themed-rounded-lg shadow-sm border">
                        <div class="flex justify-between items-start">
                           <div>
                              <p class="font-bold">{{item.name}} <span class="font-normal text-xs text-stone-500 ml-2">{{item.date | date:'medium'}}</span></p>
                              <p class="mt-2 text-stone-600 text-sm">{{item.message}}</p>
                           </div>
                           <button (click)="deleteFeedback(item.id)" class="text-red-600 hover:underline text-xs">Delete</button>
                        </div>
                     </div>
                  }
               </div>
            }
            
          </main>
        </div>
      }
    </div>
  `
})
export class AdminComponent {
  templeService = inject(TempleService);
  
  // Auth State
  email = '';
  password = '';
  otp = '';
  loginError = '';
  requires2FA = false;
  
  activeTab = signal<'dashboard' | 'insights' | 'panchangam' | 'history' | 'config' | 'theme' | 'hundi' | 'timings' | 'library' | 'news' | 'bookings' | 'donations' | 'feedback' | 'gallery' | 'reports'>('dashboard');
  tickerText = '';

  // Forms & Data Models
  configForm: SiteConfig = this.templeService.siteConfig();
  panchangamForm: Panchangam = this.templeService.dailyPanchangam();
  insightsForm: TempleInsights = { ladduStock: 0, laddusDistributed: 0, darshanWaitTime: 0, crowdStatus: 'Moderate' };
  
  newsForm: Partial<NewsItem> = { title: '', content: '', imageUrl: '', attachmentUrl: '' };
  galleryForm: Omit<GalleryItem, 'id'> = { url: '', caption: '', type: 'image' };
  libraryForm: Omit<LibraryItem, 'id'> = { title: '', url: '', type: 'audio', description: '' };

  reportStartDate = '';
  reportEndDate = '';
  bookingDate = new Date().toISOString().split('T')[0];
  adminBookings = signal<Booking[]>([]);
  
  predefinedThemes = [
    { name: 'Saffron', config: { primaryColor: '#ea580c', secondaryColor: '#fbbf24', accentColor: '#fef3c7', backgroundColor: '#fff7ed', borderRadius: 8 } },
    { name: 'Divine Red', config: { primaryColor: '#7f1d1d', secondaryColor: '#d97706', accentColor: '#fcd34d', backgroundColor: '#fffbeb', borderRadius: 12 } },
    { name: 'Forest', config: { primaryColor: '#14532d', secondaryColor: '#166534', accentColor: '#86efac', backgroundColor: '#f0fdf4', borderRadius: 4 } },
    { name: 'Night', config: { primaryColor: '#312e81', secondaryColor: '#4338ca', accentColor: '#818cf8', backgroundColor: '#e0e7ff', borderRadius: 16 } },
  ];

  @ViewChild('newsContentArea') newsContentArea!: ElementRef;
  draggedIdx = signal<number | null>(null);

  constructor() {
    effect(() => {
        // Keep local forms in sync when service updates (e.g. initial load)
        this.configForm = JSON.parse(JSON.stringify(this.templeService.siteConfig())); // Deep copy
        this.panchangamForm = { ...this.templeService.dailyPanchangam() };
        this.insightsForm = { ...this.templeService.insights() };
        this.tickerText = this.templeService.flashNews();
    });
  }

  async checkConnection() {
      await this.templeService.checkConnection();
  }

  async handleLogin() {
      this.loginError = '';
      if (!this.email || !this.password) {
          this.loginError = 'Please enter email and password';
          return;
      }
      const result = await this.templeService.login(this.email, this.password);
      if (result.error) {
          this.loginError = result.error;
      } else if (result.requires2FA) {
          this.requires2FA = true;
      }
  }

  async verifyOTP() {
      const success = await this.templeService.verifyTwoFactor(this.otp);
      if (success) {
          this.requires2FA = false;
      } else {
          this.loginError = 'Invalid OTP code';
      }
  }

  setActiveTab(tab: any) {
      this.activeTab.set(tab);
      if (tab === 'bookings') {
          this.fetchAdminBookings();
      }
  }

  toggleMaintenanceMode(e: any) {
      this.configForm.maintenanceMode = e.target.checked;
      this.saveConfig();
  }

  toggleFestivalMode(e: any) {
      this.templeService.setFestivalMode(e.target.checked);
  }

  updateTicker() {
      this.templeService.updateFlashNews(this.tickerText);
      alert('Ticker updated!');
  }

  updateInsights() {
      this.templeService.updateInsights(this.insightsForm);
      alert('Insights updated live!');
  }

  saveConfig() {
      this.templeService.updateSiteConfig(this.configForm);
      alert('Configuration saved.');
  }

  savePanchangam() {
      this.templeService.updatePanchangam(this.panchangamForm);
      alert('Panchangam updated.');
  }

  applyPresetTheme(themeConfig: any) {
      this.configForm.theme = { ...this.configForm.theme, ...themeConfig };
  }

  generateReport(type: 'donations' | 'bookings') {
      if (!this.reportStartDate || !this.reportEndDate) {
          alert('Please select date range');
          return;
      }
      this.templeService.generateCSV(type, this.reportStartDate, this.reportEndDate);
  }

  // Bookings
  async fetchAdminBookings() {
      const bookings = await this.templeService.getBookingsForAdmin(this.bookingDate);
      this.adminBookings.set(bookings);
  }

  async handleCancelBooking(id: string) {
      if (confirm('Cancel this booking?')) {
          await this.templeService.cancelBooking(id);
          this.fetchAdminBookings();
      }
  }

  // News
  applyFormat(format: string) {
      const textarea = this.newsContentArea.nativeElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = this.newsForm.content || '';
      const before = text.substring(0, start);
      const selected = text.substring(start, end);
      const after = text.substring(end, text.length);

      let newText = '';
      switch(format) {
          case 'bold': newText = `<b>${selected}</b>`; break;
          case 'italic': newText = `<i>${selected}</i>`; break;
          case 'h3': newText = `<h3>${selected}</h3>`; break;
          case 'p': newText = `<p>${selected}</p>`; break;
          case 'list': newText = `<ul><li>${selected}</li></ul>`; break;
          case 'link': newText = `<a href="#">${selected}</a>`; break;
      }
      
      this.newsForm.content = before + newText + after;
  }

  async saveNews() {
      if (this.newsForm.id) {
          await this.templeService.updateNews(this.newsForm.id, this.newsForm);
      } else {
          await this.templeService.addNews(this.newsForm.title!, this.newsForm.content!, this.newsForm.attachmentUrl, this.newsForm.imageUrl);
      }
      this.newsForm = { title: '', content: '', imageUrl: '', attachmentUrl: '' };
      alert('News item saved');
  }

  editNews(item: NewsItem) {
      this.newsForm = { ...item };
  }

  cancelEdit() {
      this.newsForm = { title: '', content: '', imageUrl: '', attachmentUrl: '' };
  }

  deleteNews(id: string) {
      if (confirm('Delete this news item?')) {
          this.templeService.deleteNews(id);
      }
  }

  // Gallery
  async addGalleryItem() {
      if (this.galleryForm.url && this.galleryForm.caption) {
          await this.templeService.addMediaItem(this.galleryForm.url, this.galleryForm.caption, this.galleryForm.type);
          this.galleryForm = { url: '', caption: '', type: 'image' };
      }
  }

  deleteGalleryItem(id: string) {
      if (confirm('Delete this image?')) {
          this.templeService.deletePhoto(id);
      }
  }

  // Library
  async addLibraryItem() {
      if (this.libraryForm.title && this.libraryForm.url) {
          await this.templeService.addLibraryItem(this.libraryForm);
          this.libraryForm = { title: '', url: '', type: 'audio', description: '' };
      }
  }

  deleteLibraryItem(id: string) {
      if (confirm('Delete this item?')) {
          this.templeService.deleteLibraryItem(id);
      }
  }

  deleteFeedback(id: string) {
      if (confirm('Delete this feedback?')) {
          this.templeService.deleteFeedback(id);
      }
  }

  // Drag and Drop
  onDragStart(e: DragEvent, index: number) {
      this.draggedIdx.set(index);
      if (e.dataTransfer) {
          e.dataTransfer.effectAllowed = 'move';
      }
  }

  onDragOver(e: DragEvent, index: number) {
      e.preventDefault(); 
      if (this.draggedIdx() === index) return;
  }

  onDrop(e: DragEvent, index: number) {
      e.preventDefault();
      const draggedIndex = this.draggedIdx();
      if (draggedIndex !== null && draggedIndex !== index) {
          // Placeholder for reorder logic
          console.log(`Moved item from ${draggedIndex} to ${index}`);
      }
      this.draggedIdx.set(null);
  }
}
