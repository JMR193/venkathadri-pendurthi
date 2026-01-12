
import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TempleService } from '../services/temple.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#fffbeb] flex items-center justify-center p-4 relative overflow-hidden">
      <!-- Background Ornamentation -->
      <div class="absolute inset-0 opacity-10" style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%2378350f\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>

      <div class="bg-white w-full max-w-md themed-rounded-xl shadow-2xl border border-amber-200 overflow-hidden animate-fade-in-up relative z-10">
        
        <!-- Header -->
        <div class="p-8 text-center border-b-4 border-[#800000] bg-gradient-to-b from-amber-50 to-white">
           <div class="w-20 h-20 mx-auto mb-3 rounded-full bg-white border-2 border-amber-500 flex items-center justify-center shadow-sm">
              <img [src]="templeService.siteConfig().logoUrl" class="h-16 w-auto opacity-90 drop-shadow-sm">
           </div>
           <h2 class="text-2xl font-serif font-bold text-[#800000] mb-1">Devotee Portal</h2>
           <p class="text-xs text-stone-500 font-bold uppercase tracking-wider">Shri Venkateswara Swamy Temple</p>
        </div>

        <!-- Auth Tabs -->
        <div class="flex border-b border-stone-200">
           <button (click)="isLogin.set(true); errorMsg.set('')" class="flex-1 py-4 text-sm font-bold transition-all" [class.text-[#800000]]="isLogin()" [class.bg-white]="isLogin()" [class.bg-stone-50]="!isLogin()" [class.text-stone-400]="!isLogin()" [class.border-b-2]="isLogin()" [class.border-[#800000]]="isLogin()">
              LOG IN
           </button>
           <button (click)="isLogin.set(false); errorMsg.set('')" class="flex-1 py-4 text-sm font-bold transition-all" [class.text-[#800000]]="!isLogin()" [class.bg-white]="!isLogin()" [class.bg-stone-50]="isLogin()" [class.text-stone-400]="isLogin()" [class.border-b-2]="!isLogin()" [class.border-[#800000]]="!isLogin()">
              REGISTER
           </button>
        </div>

        <div class="p-8">
           @if (errorMsg()) {
              <div class="bg-red-50 text-red-700 text-xs p-3 rounded mb-6 border border-red-200 flex items-center gap-2 animate-fade-in">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"><path fill-rule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clip-rule="evenodd" /></svg>
                 {{ errorMsg() }}
              </div>
           }

           @if (isLogin()) {
              <!-- Login Form -->
              <form (submit)="handleLogin($event)" class="space-y-5 animate-fade-in">
                 <div>
                    <label class="block text-stone-700 text-xs font-bold uppercase mb-1 ml-1">Email Address</label>
                    <div class="relative">
                        <span class="absolute left-3 top-3 text-stone-400"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path d="M3 4a2 2 0 0 0-2 2v1.161l8.441 4.221a1.25 1.25 0 0 0 1.118 0L19 7.162V6a2 2 0 0 0-2-2H3Z" /><path d="M19 8.839l-7.77 3.885a2.75 2.75 0 0 1-2.46 0L1 8.839V14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.839Z" /></svg></span>
                        <input type="email" [(ngModel)]="email" name="email" required class="w-full py-3 pl-10 pr-3 border border-stone-300 rounded-lg focus:border-[#800000] focus:ring-1 focus:ring-[#800000] outline-none transition-all bg-stone-50 focus:bg-white" placeholder="you@example.com">
                    </div>
                 </div>
                 <div>
                    <label class="block text-stone-700 text-xs font-bold uppercase mb-1 ml-1">Password</label>
                    <div class="relative">
                        <span class="absolute left-3 top-3 text-stone-400"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clip-rule="evenodd" /></svg></span>
                        <input type="password" [(ngModel)]="password" name="password" required class="w-full py-3 pl-10 pr-3 border border-stone-300 rounded-lg focus:border-[#800000] focus:ring-1 focus:ring-[#800000] outline-none transition-all bg-stone-50 focus:bg-white" placeholder="••••••••">
                    </div>
                 </div>
                 
                 <div class="flex justify-end">
                    <a href="#" class="text-xs text-amber-700 hover:text-[#800000] font-bold hover:underline">Forgot Password?</a>
                 </div>

                 <button type="submit" [disabled]="loading()" class="w-full bg-gradient-to-r from-[#800000] to-[#600000] text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all shadow-md disabled:opacity-70 flex justify-center items-center gap-2">
                    @if (loading()) {
                       <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    }
                    Sign In
                 </button>
              </form>
           } @else {
              <!-- Signup Form -->
              <form (submit)="handleSignUp($event)" class="space-y-5 animate-fade-in">
                 <div>
                    <label class="block text-stone-700 text-xs font-bold uppercase mb-1 ml-1">Full Name</label>
                    <div class="relative">
                        <span class="absolute left-3 top-3 text-stone-400"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" /></svg></span>
                        <input type="text" [(ngModel)]="fullName" name="fullName" required class="w-full py-3 pl-10 pr-3 border border-stone-300 rounded-lg focus:border-[#800000] focus:ring-1 focus:ring-[#800000] outline-none transition-all bg-stone-50 focus:bg-white" placeholder="Your Name">
                    </div>
                 </div>
                 <div>
                    <label class="block text-stone-700 text-xs font-bold uppercase mb-1 ml-1">Email Address</label>
                    <div class="relative">
                        <span class="absolute left-3 top-3 text-stone-400"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path d="M3 4a2 2 0 0 0-2 2v1.161l8.441 4.221a1.25 1.25 0 0 0 1.118 0L19 7.162V6a2 2 0 0 0-2-2H3Z" /><path d="M19 8.839l-7.77 3.885a2.75 2.75 0 0 1-2.46 0L1 8.839V14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.839Z" /></svg></span>
                        <input type="email" [(ngModel)]="email" name="email" required class="w-full py-3 pl-10 pr-3 border border-stone-300 rounded-lg focus:border-[#800000] focus:ring-1 focus:ring-[#800000] outline-none transition-all bg-stone-50 focus:bg-white" placeholder="you@example.com">
                    </div>
                 </div>
                 <div>
                    <label class="block text-stone-700 text-xs font-bold uppercase mb-1 ml-1">Create Password</label>
                    <div class="relative">
                        <span class="absolute left-3 top-3 text-stone-400"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clip-rule="evenodd" /></svg></span>
                        <input type="password" [(ngModel)]="password" name="password" required minlength="6" class="w-full py-3 pl-10 pr-3 border border-stone-300 rounded-lg focus:border-[#800000] focus:ring-1 focus:ring-[#800000] outline-none transition-all bg-stone-50 focus:bg-white" placeholder="Min 6 characters">
                    </div>
                 </div>

                 <button type="submit" [disabled]="loading()" class="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all shadow-md disabled:opacity-70 flex justify-center items-center gap-2">
                    @if (loading()) {
                       <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    }
                    Create Account
                 </button>
              </form>
           }
        </div>
        
        <div class="bg-stone-50 p-4 text-center border-t border-stone-200">
           <a routerLink="/" class="text-sm font-bold text-stone-500 hover:text-[#800000] flex items-center justify-center gap-1 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"><path fill-rule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clip-rule="evenodd" /></svg>
              Back to Home
           </a>
        </div>
      </div>
    </div>
  `
})
export class AuthComponent {
  templeService = inject(TempleService);
  router = inject(Router);

  isLogin = signal(true);
  loading = signal(false);
  errorMsg = signal('');

  email = '';
  password = '';
  fullName = '';

  async handleLogin(e: Event) {
    e.preventDefault();
    this.loading.set(true);
    this.errorMsg.set('');

    try {
      const { error } = await this.templeService.publicLogin(this.email, this.password);
      if (error) throw error;
      
      // Redirect based on role
      if (this.templeService.isAdmin()) {
          this.router.navigate(['/admin']);
      } else {
          this.router.navigate(['/']);
      }
    } catch (err: any) {
      this.errorMsg.set(err.message || 'Login failed. Please check credentials.');
    } finally {
      this.loading.set(false);
    }
  }

  async handleSignUp(e: Event) {
    e.preventDefault();
    this.loading.set(true);
    this.errorMsg.set('');

    try {
      const { error } = await this.templeService.publicSignUp(this.email, this.password, this.fullName);
      if (error) throw error;
      
      alert('Registration successful! Please check your email to verify your account.');
      this.isLogin.set(true);
    } catch (err: any) {
      this.errorMsg.set(err.message || 'Registration failed.');
    } finally {
      this.loading.set(false);
    }
  }
}
