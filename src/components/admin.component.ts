import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { TempleService } from '../services/temple.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-stone-100 font-sans flex flex-col">
      <!-- "Backend Disabled" Overlay -->
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-red-900/95 backdrop-blur-sm p-4">
        <div class="w-full max-w-md bg-white p-8 themed-rounded-xl shadow-2xl border-2 border-amber-400 animate-fade-in text-center">
           <div class="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-800">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-red-900">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
           </div>
           <h2 class="text-3xl font-serif font-bold text-red-900">Backend Disabled</h2>
           <p class="text-stone-600 mt-2">The Admin Portal requires a backend connection. This feature is disabled in the current demonstration version of the application.</p>
           <a routerLink="/" class="mt-6 inline-block bg-stone-800 text-white px-6 py-2 themed-rounded hover:bg-stone-700 font-bold transition-colors">Back to Website</a>
        </div>
      </div>
    </div>
  `
})
export class AdminComponent {
  templeService = inject(TempleService);
}