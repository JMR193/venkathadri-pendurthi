
import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TempleService, Donation } from '../services/temple.service';

@Component({
  selector: 'app-ehundi',
  standalone: true,
  imports: [FormsModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-amber-50 min-h-screen py-12">
      <div class="container mx-auto px-4">
        
        <!-- Main Card -->
        <div class="max-w-4xl mx-auto bg-white themed-rounded-2xl shadow-2xl overflow-hidden print:shadow-none print:max-w-full relative">
          
          <div class="bg-red-900 text-white p-6 flex flex-col md:flex-row justify-between items-center relative z-20">
            <div class="text-center md:text-left mb-4 md:mb-0">
                <h2 class="text-3xl font-serif font-bold">Srivari E-Hundi</h2>
                <p class="opacity-80">Kanuka to Lord Venkateswara</p>
            </div>
            @if (templeService.currentUser()) {
                <button (click)="toggleViewMode()" class="bg-amber-500 hover:bg-amber-400 text-red-900 font-bold px-4 py-2 rounded-full text-sm transition-colors shadow-md">
                    {{ viewMode() === 'donate' ? 'My Contributions' : 'Make Donation' }}
                </button>
            }
          </div>

          <div class="p-8 relative bg-stone-50/50">
            <!-- Secure Background Pattern -->
            <div class="absolute inset-0 pointer-events-none opacity-[0.03] z-0" 
                 style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 24 24\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath fill=\'%23000000\' d=\'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 6c1.4 0 2.8 1.1 2.8 2.5V11h-6V9.5C8.8 8.1 10.2 7 12 7zm4 11H8v-5h8v5zm1-7h-1V9.5C14.2 8.3 13.1 7.5 12 7.5s-2.2.8-2.2 2V11H8v7h8v-7z\'/%3E%3C/svg%3E');">
            </div>

            <div class="relative z-10">
              @if (viewMode() === 'history') {
                  <div class="animate-fade-in">
                      <h3 class="text-xl font-bold text-stone-700 mb-6 border-b border-stone-300 pb-2">My Donation History</h3>
                      
                      @if (userDonations().length > 0) {
                          <div class="overflow-x-auto">
                              <table class="w-full text-sm text-left">
                                  <thead class="bg-amber-100 text-amber-900 uppercase font-bold">
                                      <tr>
                                          <th class="p-3 rounded-tl-lg">Date</th>
                                          <th class="p-3">Category</th>
                                          <th class="p-3 text-right">Amount</th>
                                          <th class="p-3">Ref ID</th>
                                          <th class="p-3 rounded-tr-lg">Action</th>
                                      </tr>
                                  </thead>
                                  <tbody class="divide-y divide-stone-200 bg-white">
                                      @for (d of userDonations(); track d.transactionId) {
                                          <tr>
                                              <td class="p-3">{{ d.date | date:'mediumDate' }}</td>
                                              <td class="p-3">{{ d.category }}</td>
                                              <td class="p-3 text-right font-bold">₹ {{ d.amount }}</td>
                                              <td class="p-3 font-mono text-xs">{{ d.transactionId }}</td>
                                              <td class="p-3">
                                                  <button (click)="viewReceipt(d)" class="text-blue-600 hover:underline text-xs font-bold">Receipt</button>
                                              </td>
                                          </tr>
                                      }
                                  </tbody>
                              </table>
                          </div>
                      } @else {
                          <div class="text-center py-12 bg-white rounded-lg border border-dashed border-stone-300">
                              <p class="text-stone-500">No donations recorded yet.</p>
                          </div>
                      }
                  </div>
              } @else {
                  <!-- Donation Flow -->
                  @if (templeService.siteConfig().enableHundi) {
                    <!-- Payment Method Selection -->
                    @if (step() === 'form') {
                      <div class="flex justify-center gap-4 mb-8">
                         <button (click)="paymentMode = 'online'" [class]="paymentMode === 'online' ? 'bg-amber-600 text-white shadow-md' : 'bg-stone-100 text-stone-600'" class="px-6 py-3 themed-rounded-lg font-bold transition-all border border-transparent hover:border-amber-300">
                            Online Payment Gateway
                         </button>
                         <button (click)="paymentMode = 'bank'" [class]="paymentMode === 'bank' ? 'bg-amber-600 text-white shadow-md' : 'bg-stone-100 text-stone-600'" class="px-6 py-3 themed-rounded-lg font-bold transition-all border border-transparent hover:border-amber-300">
                            Direct Bank Transfer / QR
                         </button>
                      </div>

                      <!-- Bank Transfer Info -->
                      @if (paymentMode === 'bank') {
                         <div class="bg-white/80 backdrop-blur-sm p-6 themed-rounded-xl border border-stone-200 mb-8 animate-fade-in shadow-sm">
                            <h3 class="text-xl font-bold text-red-900 mb-4 border-b border-stone-300 pb-2">Direct Temple Account</h3>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <!-- Bank Text Details -->
                                <div class="space-y-3 text-sm">
                                   @if (templeService.siteConfig().bankInfo?.accountNumber) {
                                     <div class="flex flex-col">
                                        <span class="text-stone-500 font-semibold">Account Name</span>
                                        <span class="text-stone-800 font-bold text-lg">{{ templeService.siteConfig().bankInfo?.accountName }}</span>
                                     </div>
                                     <div class="flex flex-col">
                                        <span class="text-stone-500 font-semibold">Account Number</span>
                                        <span class="text-stone-800 font-mono font-bold text-lg select-all">{{ templeService.siteConfig().bankInfo?.accountNumber }}</span>
                                     </div>
                                     <div class="flex flex-col">
                                        <span class="text-stone-500 font-semibold">Bank & Branch</span>
                                        <span class="text-stone-800">{{ templeService.siteConfig().bankInfo?.bankName }}, {{ templeService.siteConfig().bankInfo?.branch }}</span>
                                     </div>
                                     <div class="flex flex-col">
                                        <span class="text-stone-500 font-semibold">IFSC Code</span>
                                        <span class="text-stone-800 font-mono font-bold select-all">{{ templeService.siteConfig().bankInfo?.ifsc }}</span>
                                     </div>
                                   } @else {
                                     <p class="text-stone-500 italic">Bank details are currently being updated. Please use the Online Gateway.</p>
                                   }
                                </div>

                                <!-- QR Code -->
                                <div class="flex flex-col items-center justify-center border-l border-stone-200 pl-4">
                                   @if (templeService.siteConfig().bankInfo?.qrCodeUrl) {
                                      <img [src]="templeService.siteConfig().bankInfo?.qrCodeUrl" class="w-48 h-48 object-contain border border-stone-300 p-2 bg-white themed-rounded-lg shadow-sm">
                                      <p class="text-xs text-stone-500 mt-2 font-bold uppercase tracking-wider">Scan to Pay via UPI</p>
                                   } @else {
                                      <div class="w-48 h-48 bg-stone-200 themed-rounded flex items-center justify-center text-stone-400 text-xs">No QR Code Available</div>
                                   }
                                </div>
                            </div>
                            
                            <div class="mt-6 p-4 bg-amber-100 themed-rounded text-amber-900 text-sm">
                               <strong>Note:</strong> After making a direct transfer, please contact the temple office with your transaction ID to receive a receipt.
                            </div>
                         </div>
                      }

                      <form (submit)="processPayment($event)" class="bg-white/90 backdrop-blur-sm p-6 themed-rounded-xl border border-stone-200 shadow-sm">
                        <!-- Secure Badge -->
                        @if (paymentMode === 'online') {
                            <div class="flex items-center justify-center gap-2 mb-6 text-green-700 bg-green-50 p-2 themed-rounded-lg border border-green-200">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                                  <path fill-rule="evenodd" d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Zm3.094 8.016a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" /></svg>
                                <span class="text-xs font-bold uppercase tracking-wide">256-Bit SSL Secured Payment</span>
                            </div>
                        }

                        <div class="mb-6">
                          <label class="block text-stone-700 font-bold mb-2">Contribution Category</label>
                          <select [(ngModel)]="category" name="category" class="w-full p-3 border border-stone-300 themed-rounded focus:ring-2 focus:ring-amber-500 outline-none">
                            @for(cat of templeService.siteConfig().donationCategories; track cat) {
                              <option [value]="cat">{{cat}}</option>
                            }
                          </select>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <label class="block text-stone-700 font-bold mb-2">Devotee Name</label>
                            <input type="text" [(ngModel)]="donorName" name="donorName" required class="w-full p-3 border border-stone-300 themed-rounded focus:ring-2 focus:ring-amber-500 outline-none" placeholder="Enter Full Name">
                          </div>
                          <div>
                            <label class="block text-stone-700 font-bold mb-2">Gothram</label>
                            <input type="text" [(ngModel)]="gothram" name="gothram" class="w-full p-3 border border-stone-300 themed-rounded focus:ring-2 focus:ring-amber-500 outline-none" placeholder="Optional">
                          </div>
                        </div>

                         <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <label class="block text-stone-700 font-bold mb-2">Email ID</label>
                            <input type="email" required class="w-full p-3 border border-stone-300 themed-rounded focus:ring-2 focus:ring-amber-500 outline-none" placeholder="For receipt">
                          </div>
                           <div>
                            <label class="block text-stone-700 font-bold mb-2">PAN Number (Optional)</label>
                            <input type="text" [(ngModel)]="pan" name="pan" class="w-full p-3 border border-stone-300 themed-rounded focus:ring-2 focus:ring-amber-500 outline-none uppercase" placeholder="For Tax Exemption">
                          </div>
                        </div>

                        <div class="mb-8">
                          <label class="block text-stone-700 font-bold mb-2">Amount (INR)</label>
                          <div class="flex gap-4 mb-4 flex-wrap">
                            @for(amt of templeService.siteConfig().donationAmounts; track amt) {
                              <button type="button" (click)="amount = amt" class="px-4 py-2 themed-rounded border border-amber-300 hover:bg-amber-100 text-amber-800 font-bold transition-colors">₹ {{ amt | number }}</button>
                            }
                          </div>
                          <input type="number" [(ngModel)]="amount" name="amount" required min="1" class="w-full p-3 border border-stone-300 themed-rounded focus:ring-2 focus:ring-amber-500 outline-none text-xl font-bold text-stone-800">
                        </div>

                        <button *ngIf="paymentMode === 'online'" type="submit" class="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold py-4 themed-rounded-xl shadow-lg hover:from-amber-700 hover:to-amber-800 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
                          Proceed to Secure Payment ₹{{ amount }}
                        </button>
                        <button *ngIf="paymentMode === 'bank'" type="button" (click)="recordOfflineDonation()" class="w-full bg-stone-800 text-white font-bold py-4 themed-rounded-xl shadow-lg hover:bg-stone-900 transform hover:-translate-y-1 transition-all">
                          I have made the transfer - Record Donation
                        </button>
                        
                        <p class="text-center text-xs text-stone-500 mt-4 flex items-center justify-center gap-1">
                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3"><path fill-rule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clip-rule="evenodd" /></svg>
                           {{ paymentMode === 'online' ? 'Encrypted & Secure Payment Processing' : 'Please ensure transfer is complete before recording' }}
                        </p>
                      </form>
                    } @else if (step() === 'success') {
                      <!-- Receipt View -->
                      <div class="text-center py-4 animate-fade-in print:text-left bg-white/95 backdrop-blur-sm themed-rounded-xl p-6">
                        
                        <div class="border-4 border-double border-amber-600 p-6 themed-rounded-lg relative overflow-hidden bg-amber-50">
                          <div class="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-48 h-48"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" /></svg>
                          </div>

                          <h3 class="text-2xl font-serif font-bold text-red-900 mb-1">Uttarandhra Tirupati</h3>
                          <p class="text-sm font-bold text-stone-600 uppercase mb-4">Shri Venkateswara Swamy Temple</p>
                          
                          <div class="w-full h-px bg-amber-300 my-4"></div>
                          
                          <h4 class="text-xl font-bold text-stone-800 mb-6 uppercase tracking-widest">Donation Receipt</h4>

                          <div class="grid grid-cols-2 gap-y-4 text-left text-sm mb-6 max-w-md mx-auto print:max-w-full">
                            <span class="text-stone-500">Receipt No:</span> <span class="font-mono font-bold">{{ transactionId }}</span>
                            <span class="text-stone-500">Date:</span> <span class="font-bold">{{ currentDate }}</span>
                            <span class="text-stone-500">Donor Name:</span> <span class="font-bold">{{ donorName }}</span>
                            <span class="text-stone-500">Gothram:</span> <span class="font-bold">{{ gothram || '-' }}</span>
                            <span class="text-stone-500">Category:</span> <span class="font-bold">{{ category }}</span>
                            <span class="text-stone-500">PAN:</span> <span class="font-bold">{{ pan || '-' }}</span>
                            <span class="text-stone-500">Mode:</span> <span class="font-bold uppercase">{{ paymentMode }}</span>
                          </div>

                          <div class="bg-white p-4 themed-rounded border border-amber-200 inline-block w-full max-w-md print:max-w-full">
                             <p class="text-sm text-stone-500 mb-1">Total Amount Received</p>
                             <p class="text-3xl font-bold text-emerald-700">₹ {{ amount }}</p>
                          </div>

                          <p class="mt-6 text-xs text-stone-500 italic">May Lord Venkateswara bless you and your family.</p>
                          <p class="text-xs text-stone-400 mt-1">This is a computer generated receipt.</p>

                        </div>

                        <div class="mt-8 flex justify-center gap-4 print:hidden">
                           <button (click)="printReceipt()" class="bg-stone-800 text-white px-6 py-2 themed-rounded hover:bg-stone-700 flex items-center gap-2">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.198-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" /></svg>
                             Print
                           </button>
                           <button (click)="reset()" class="border border-amber-600 text-amber-700 font-bold px-6 py-2 themed-rounded hover:bg-amber-50">Back</button>
                        </div>
                      </div>
                    }
                  } @else {
                   <!-- Hundi Disabled State -->
                   <div class="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
                      <div class="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mb-6">
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 text-stone-400"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                      </div>
                      <h3 class="text-2xl font-bold text-stone-700 font-serif">E-Hundi Maintenance</h3>
                      <p class="text-stone-500 max-w-md mt-2">Online donation services are currently paused for maintenance. Please visit the temple office.</p>
                   </div>
                  }
              }
            </div>
          </div>
        </div>
      </div>

      <!-- Realistic Payment Gateway Modal Simulation -->
      @if (showPaymentModal()) {
        <div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
           <div class="bg-white w-full max-w-md themed-rounded-lg shadow-2xl overflow-hidden animate-fade-in-up">
              <!-- Gateway Header -->
              <div class="bg-stone-50 p-4 border-b border-stone-200 flex justify-between items-center">
                 <div class="flex items-center gap-2">
                    <div class="font-bold text-stone-700 italic text-lg tracking-tighter">SECURE<span class="text-blue-600">PAY</span></div>
                    <span class="text-[10px] bg-green-100 text-green-700 px-1 themed-rounded border border-green-200">Trusted</span>
                 </div>
                 <div class="text-right">
                    <p class="text-[10px] text-stone-500 uppercase font-bold">Amount to Pay</p>
                    <p class="font-bold text-stone-800">INR {{ amount }}.00</p>
                 </div>
              </div>

              <!-- Gateway Body -->
              <div class="p-6">
                 @if (gatewayState() === 'input') {
                    <p class="text-sm font-bold text-stone-600 mb-4">Select Payment Method</p>
                    
                    <!-- Tabs -->
                    <div class="flex border-b border-stone-200 mb-4">
                       <button (click)="pgMethod = 'card'" [class.border-blue-600]="pgMethod === 'card'" [class.text-blue-600]="pgMethod === 'card'" class="w-1/2 py-2 text-sm font-bold text-stone-500 border-b-2 border-transparent transition-colors">Card</button>
                       <button (click)="pgMethod = 'upi'" [class.border-blue-600]="pgMethod === 'upi'" [class.text-blue-600]="pgMethod === 'upi'" class="w-1/2 py-2 text-sm font-bold text-stone-500 border-b-2 border-transparent transition-colors">UPI / QR</button>
                    </div>

                    @if (pgMethod === 'card') {
                       <div class="space-y-3 animate-fade-in">
                          <input type="text" placeholder="Card Number" class="w-full p-3 border border-stone-300 themed-rounded text-sm bg-stone-50 focus:bg-white focus:border-blue-500 outline-none">
                          <div class="flex gap-3">
                             <input type="text" placeholder="MM / YY" class="w-1/2 p-3 border border-stone-300 themed-rounded text-sm bg-stone-50 focus:bg-white focus:border-blue-500 outline-none">
                             <input type="password" placeholder="CVV" maxlength="3" class="w-1/2 p-3 border border-stone-300 themed-rounded text-sm bg-stone-50 focus:bg-white focus:border-blue-500 outline-none">
                          </div>
                          <input type="text" placeholder="Card Holder Name" class="w-full p-3 border border-stone-300 themed-rounded text-sm bg-stone-50 focus:bg-white focus:border-blue-500 outline-none">
                       </div>
                    } @else {
                       <div class="space-y-4 animate-fade-in text-center py-4">
                          <p class="text-xs text-stone-500">Enter UPI ID (e.g. mobile@upi)</p>
                          <input type="text" placeholder="username@bank" class="w-full p-3 border border-stone-300 themed-rounded text-sm bg-stone-50 focus:bg-white focus:border-blue-500 outline-none text-center">
                          <div class="text-xs font-bold text-stone-400 uppercase">OR</div>
                          <div class="w-32 h-32 bg-stone-100 mx-auto themed-rounded border border-stone-200 flex items-center justify-center text-xs text-stone-400">
                             Simulated QR Code
                          </div>
                       </div>
                    }

                    <button (click)="payNow()" class="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 themed-rounded shadow-md transition-colors flex justify-center items-center gap-2">
                       Pay ₹ {{ amount }}
                    </button>
                    <button (click)="cancelPayment()" class="w-full mt-2 text-stone-400 hover:text-stone-600 text-xs py-2 font-bold">Cancel Transaction</button>

                 } @else if (gatewayState() === 'processing') {
                    <div class="py-12 flex flex-col items-center animate-fade-in">
                       <div class="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                       <p class="font-bold text-stone-700">Contacting Bank...</p>
                       <p class="text-xs text-stone-400 mt-1">Please do not refresh the page</p>
                    </div>
                 }
              </div>
              
              <!-- Gateway Footer -->
              <div class="bg-stone-50 p-3 border-t border-stone-200 flex justify-center gap-4 opacity-50 grayscale">
                 <div class="h-4 w-8 bg-stone-300 themed-rounded"></div>
                 <div class="h-4 w-8 bg-stone-300 themed-rounded"></div>
                 <div class="h-4 w-8 bg-stone-300 themed-rounded"></div>
              </div>
           </div>
        </div>
      }
    </div>
  `
})
export class EHundiComponent {
  templeService = inject(TempleService);
  
  amount = this.templeService.siteConfig().donationAmounts[0] || 101;
  donorName = '';
  gothram = '';
  category = this.templeService.siteConfig().donationCategories[0] || 'General Hundi';
  pan = '';
  paymentMode: 'online' | 'bank' = 'online';
  
  viewMode = signal<'donate' | 'history'>('donate');
  step = signal<'form' | 'success'>('form');
  transactionId = '';
  currentDate = '';

  // User History
  userDonations = signal<Donation[]>([]);

  // Payment Gateway State
  showPaymentModal = signal(false);
  gatewayState = signal<'input' | 'processing'>('input');
  pgMethod: 'card' | 'upi' = 'card';

  async toggleViewMode() {
      if (this.viewMode() === 'donate') {
          this.viewMode.set('history');
          const donations = await this.templeService.getUserDonations();
          this.userDonations.set(donations);
      } else {
          this.viewMode.set('donate');
      }
  }

  processPayment(e: Event) {
    e.preventDefault();
    if (this.paymentMode === 'online') {
        this.showPaymentModal.set(true);
        this.gatewayState.set('input');
    } else {
        // Direct bank recording
        this.completeTransaction();
    }
  }

  recordOfflineDonation() {
    this.completeTransaction();
  }

  // Gateway Simulation Logic
  payNow() {
      this.gatewayState.set('processing');
      // Simulate network delay
      setTimeout(() => {
          this.showPaymentModal.set(false);
          this.completeTransaction();
      }, 3000);
  }

  cancelPayment() {
      this.showPaymentModal.set(false);
  }

  private async completeTransaction() {
    // Generate a temporary ID for tracking
    const prefix = this.paymentMode === 'online' ? 'TXN' : 'OFF';
    const tempTxnId = prefix + Math.floor(Math.random() * 10000000).toString();
    this.currentDate = new Date().toISOString().split('T')[0];

    // Call Service which hits Edge Function
    const verification = await this.templeService.verifyPayment(tempTxnId, this.amount, this.category);
    
    if (verification.success) {
       this.transactionId = tempTxnId;
       
       this.templeService.addDonation({
         id: Date.now().toString(),
         donorName: this.donorName,
         gothram: this.gothram,
         category: this.category,
         amount: this.amount,
         date: this.currentDate,
         transactionId: this.transactionId,
         pan: this.pan
       });

       this.step.set('success');
    } else {
       alert('Verification Failed: ' + verification.message);
       this.step.set('form');
    }
  }

  printReceipt() {
    window.print();
  }

  viewReceipt(donation: Donation) {
      this.transactionId = donation.transactionId;
      this.currentDate = donation.date;
      this.donorName = donation.donorName;
      this.gothram = donation.gothram || '';
      this.category = donation.category;
      this.pan = donation.pan || '';
      this.amount = donation.amount;
      this.step.set('success');
      this.viewMode.set('donate'); // Switch to view
  }

  reset() {
    this.step.set('form');
    this.amount = this.templeService.siteConfig().donationAmounts[0] || 101;
    this.donorName = '';
    this.gothram = '';
    this.pan = '';
    this.category = this.templeService.siteConfig().donationCategories[0] || 'General Hundi';
    this.paymentMode = 'online';
  }
}
