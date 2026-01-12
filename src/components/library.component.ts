
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { TempleService, LibraryItem } from '../services/temple.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-amber-50 min-h-screen py-12">
      <div class="container mx-auto px-4">
        
        <div class="text-center mb-12">
          <h2 class="text-4xl font-serif font-bold text-[#800000] mb-4">Spiritual Digital Library</h2>
          <div class="w-24 h-1 bg-amber-500 mx-auto themed-rounded"></div>
          <p class="mt-4 text-stone-600">Immerse yourself in divine knowledge, music, and literature.</p>
        </div>

        <!-- Audio Section -->
        <div class="mb-16">
          <h3 class="text-2xl font-bold text-stone-800 mb-6 flex items-center gap-2 border-b-2 border-amber-200 pb-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-amber-600"><path stroke-linecap="round" stroke-linejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Z" /></svg>
            Devotional Music & Pravachanams
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (item of templeService.library(); track item.id) {
              @if (item.type === 'audio') {
                <div class="bg-white themed-rounded-lg shadow p-6 border border-amber-100 flex flex-col hover:shadow-md transition-shadow">
                  <div class="flex-grow">
                     <div class="flex justify-between items-start">
                        <h4 class="font-bold text-lg text-stone-800 mb-2">{{ item.title }}</h4>
                        <button (click)="cacheAudio(item.url)" class="text-stone-400 hover:text-green-600" title="Download for Offline">
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M12 9.75V1.5m0 0 3 3m-3-3-3 3" /></svg>
                        </button>
                     </div>
                     <p class="text-sm text-stone-600 mb-4">{{ item.description }}</p>
                  </div>
                  <audio controls class="w-full mt-4">
                    <source [src]="item.url" type="audio/mpeg">
                    Your browser does not support the audio element.
                  </audio>
                </div>
              }
            }
          </div>
        </div>

        <!-- E-books Section -->
        <div class="mb-16">
           <h3 class="text-2xl font-bold text-stone-800 mb-6 flex items-center gap-2 border-b-2 border-amber-200 pb-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-amber-600"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
            E-Books & Literature
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             @for (item of templeService.library(); track item.id) {
              @if (item.type === 'ebook') {
                <div class="bg-white themed-rounded-lg shadow p-6 border border-amber-100 hover:shadow-lg transition-shadow">
                  <div class="h-40 bg-stone-100 themed-rounded mb-4 flex items-center justify-center text-stone-400">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                  </div>
                  <h4 class="font-bold text-lg text-stone-800 mb-2 truncate">{{ item.title }}</h4>
                  <p class="text-sm text-stone-600 mb-4 h-10 overflow-hidden">{{ item.description }}</p>
                  <a [href]="item.url" target="_blank" class="block text-center w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 themed-rounded transition-colors">
                    Download PDF
                  </a>
                </div>
              }
             }
          </div>
        </div>

      </div>
    </div>
  `
})
export class LibraryComponent {
  templeService = inject(TempleService);

  cacheAudio(url: string) {
    // By fetching it, the Service Worker will intercept and cache it
    fetch(url)
      .then(() => alert('Audio cached for offline listening!'))
      .catch(() => alert('Could not cache. Check internet connection.'));
  }
}
