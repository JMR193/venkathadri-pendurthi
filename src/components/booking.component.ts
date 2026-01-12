
import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TempleService, SlotAvailability, Booking } from '../services/temple.service';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-amber-50 min-h-screen py-8">
      <div class="container mx-auto px-4">
        
        <div class="max-w-5xl mx-auto bg-white themed-rounded-lg shadow-xl overflow-hidden border-t-8 border-[#800000]">
          
          <!-- Header -->
          <div class="bg-white p-6 border-b border-stone-200 flex flex-col md:flex-row justify-between items-center gap-4">
             <div class="flex items-center gap-4">
                <img src="https://opwncdejpaeltylplvhk.supabase.co/storage/v1/object/public/images/logo/cb3d423f-ec99-48a4-b070-adf5c21ddd76.png" class="h-12 w-auto opacity-90" onerror="this.style.display='none'">
                <div>
                   <h2 class="text-2xl font-serif font-bold text-[#800000]">Special Entry Darshan</h2>
                   <p class="text-xs text-stone-500 font-bold uppercase tracking-wider">Online Booking Portal</p>
                </div>
             </div>
             
             <!-- Navigation Tabs for Logged In Users -->
             @if (templeService.currentUser()) {
               <div class="flex bg-stone-100 rounded-lg p-1">
                  <button (click)="viewMode.set('book')" [class.bg-white]="viewMode() === 'book'" [class.shadow-sm]="viewMode() === 'book'" class="px-4 py-2 rounded-md text-sm font-bold transition-all" [class.text-[#800000]]="viewMode() === 'book'" [class.text-stone-500]="viewMode() !== 'book'">Book Darshan</button>
                  <button (click)="loadUserBookings()" [class.bg-white]="viewMode() === 'history'" [class.shadow-sm]="viewMode() === 'history'" class="px-4 py-2 rounded-md text-sm font-bold transition-all" [class.text-[#800000]]="viewMode() === 'history'" [class.text-stone-500]="viewMode() !== 'history'">My Tickets</button>
               </div>
             } @else {
               <div class="text-right hidden md:block">
                  <p class="text-xs text-stone-500">Om Namo Venkatesaya</p>
                  <p class="text-sm font-bold text-stone-800">{{ currentDateDisplay | date:'fullDate' }}</p>
               </div>
             }
          </div>

          <div class="p-6 md:p-8 bg-stone-50/50">
            
            @if (viewMode() === 'history') {
               <!-- User Booking History -->
               <div class="animate-fade-in">
                  <h3 class="text-xl font-bold text-stone-700 mb-6 flex items-center gap-2">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-amber-600"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" /></svg>
                     My Booking History
                  </h3>
                  
                  @if (userBookings().length > 0) {
                     <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        @for (ticket of userBookings(); track ticket.ticketCode) {
                           <div class="bg-white p-6 border-l-4 rounded shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                                [class.border-green-500]="ticket.status === 'Booked'"
                                [class.border-red-500]="ticket.status === 'Cancelled'"
                                [class.opacity-70]="ticket.status === 'Cancelled'">
                              
                              <div class="flex justify-between items-start mb-4">
                                 <div>
                                    <span class="text-xs font-bold px-2 py-1 rounded bg-stone-100 text-stone-600 mb-2 inline-block">
                                       {{ ticket.date | date:'mediumDate' }} • {{ ticket.slot }}
                                    </span>
                                    <h4 class="font-bold text-lg text-[#800000]">{{ ticket.devoteeName }}</h4>
                                    <p class="text-sm text-stone-500">Mobile: {{ ticket.mobile }}</p>
                                 </div>
                                 <div class="text-right">
                                    <div class="text-xs text-stone-400">Ticket No</div>
                                    <div class="font-mono font-bold text-lg">{{ ticket.ticketCode }}</div>
                                 </div>
                              </div>
                              
                              <div class="flex justify-between items-center pt-4 border-t border-dashed border-stone-200">
                                 <span class="text-xs font-bold uppercase px-2 py-1 rounded" 
                                    [class.bg-green-100]="ticket.status === 'Booked'" [class.text-green-800]="ticket.status === 'Booked'"
                                    [class.bg-red-100]="ticket.status === 'Cancelled'" [class.text-red-800]="ticket.status === 'Cancelled'">
                                    {{ ticket.status }}
                                 </span>
                                 
                                 @if (ticket.status === 'Booked') {
                                    <button (click)="printTicket(ticket)" class="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center gap-1">
                                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.198-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" /></svg>
                                       Print
                                    </button>
                                 }
                              </div>
                           </div>
                        }
                     </div>
                  } @else {
                     <div class="text-center py-16 bg-white rounded-lg border border-stone-200">
                        <p class="text-stone-500">No booking history found.</p>
                        <button (click)="viewMode.set('book')" class="mt-4 text-[#800000] font-bold hover:underline">Book your first Darshan</button>
                     </div>
                  }
               </div>

            } @else {
               <!-- Booking Flow -->
               @if (templeService.siteConfig().enableBooking) {
                  @if (step() === 'date') {
                    <div class="animate-fade-in">
                       
                       <div class="bg-blue-50 border-l-4 border-blue-600 p-4 mb-8 text-sm text-blue-900 themed-rounded-r shadow-sm">
                          <p class="font-bold mb-1 flex items-center gap-2">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
                             Note to Pilgrims:
                          </p>
                          <ul class="list-disc list-inside space-y-1 opacity-90 ml-1">
                             <li>At the time of entry, all pilgrims shall produce the same original Photo ID used during booking.</li>
                             <li>Traditional dress code is mandatory (Dhoti/Pyjama for Men, Saree/Chudidhar for Women).</li>
                             <li>Pilgrims should report strictly at the time slot mentioned in the ticket.</li>
                          </ul>
                       </div>

                       <div class="flex flex-col lg:flex-row gap-8">
                          <!-- Date Selection Panel -->
                          <div class="lg:w-1/3 bg-white p-6 themed-rounded-lg shadow-sm border border-stone-200 h-fit">
                             <label class="block text-[#800000] font-bold mb-3 uppercase text-xs tracking-wider">Select Darshan Date</label>
                             <input type="date" [min]="minDate" [(ngModel)]="selectedDate" (change)="fetchSlots()" class="w-full p-3 border-2 border-stone-300 themed-rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-lg font-bold text-stone-700 cursor-pointer hover:bg-stone-50 transition-colors">
                             <p class="text-xs text-stone-500 mt-2">Booking allowed for next 30 days only.</p>
                          </div>
                          
                          <!-- Slot Selection Panel -->
                          <div class="lg:w-2/3">
                             <div class="flex justify-between items-end mb-4 border-b border-stone-200 pb-2">
                                <label class="block text-[#800000] font-bold uppercase text-xs tracking-wider">
                                   Select Time Slot @if(selectedDate) { <span class="text-stone-500 normal-case ml-2">for {{ selectedDate | date:'mediumDate' }}</span> }
                                </label>
                                
                                <!-- Legends -->
                                <div class="flex gap-3 text-[10px] font-bold uppercase">
                                   <span class="flex items-center gap-1"><span class="w-3 h-3 bg-green-500 themed-rounded"></span> Available</span>
                                   <span class="flex items-center gap-1"><span class="w-3 h-3 bg-red-500 themed-rounded"></span> Quota Full</span>
                                   <span class="flex items-center gap-1"><span class="w-3 h-3 bg-blue-600 themed-rounded"></span> Selected</span>
                                </div>
                             </div>
                             
                             @if (loadingSlots()) {
                                <div class="flex flex-col items-center justify-center py-12 bg-white themed-rounded-lg border border-stone-100">
                                   <div class="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                                   <p class="text-sm font-bold text-stone-500">Checking Live Availability...</p>
                                </div>
                             } @else if (slots().length > 0) {
                                <div class="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
                                   @for (slot of slots(); track slot.time) {
                                      <button (click)="selectSlot(slot)" [disabled]="slot.status === 'FULL'" 
                                         class="py-2 px-1 themed-rounded shadow-sm transition-all relative overflow-hidden group flex flex-col items-center justify-center h-16 border"
                                         [class.bg-green-500]="slot.status === 'AVAILABLE' && selectedSlot()?.time !== slot.time"
                                         [class.hover:bg-green-600]="slot.status === 'AVAILABLE' && selectedSlot()?.time !== slot.time"
                                         [class.text-white]="slot.status === 'AVAILABLE' || slot.status === 'FULL'"
                                         
                                         [class.bg-red-500]="slot.status === 'FULL'"
                                         [class.cursor-not-allowed]="slot.status === 'FULL'"
                                         [class.opacity-50]="slot.status === 'FULL'"
                                         
                                         [class.bg-blue-600]="selectedSlot()?.time === slot.time"
                                         [class.text-white]="selectedSlot()?.time === slot.time"
                                         [class.ring-2]="selectedSlot()?.time === slot.time"
                                         [class.ring-offset-2]="selectedSlot()?.time === slot.time"
                                         [class.scale-105]="selectedSlot()?.time === slot.time"
                                         >
                                         <div class="font-bold text-xs">{{ slot.time }}</div>
                                         @if (slot.status !== 'FULL') {
                                             <div class="text-[9px] mt-1 bg-black/20 px-1 themed-rounded">{{ slot.capacity - slot.booked }} Seats</div>
                                         } @else {
                                             <div class="text-[9px] mt-1 bg-black/20 px-1 themed-rounded">FULL</div>
                                         }
                                      </button>
                                   }
                                </div>
                                
                                <div class="mt-8 flex justify-end">
                                   <button (click)="nextStep()" [disabled]="!selectedSlot()" class="bg-gradient-to-r from-red-800 to-red-900 text-white px-8 py-3 themed-rounded-lg font-bold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed shadow transition-all flex items-center gap-2">
                                      Continue
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                                   </button>
                                </div>
                             } @else {
                                <div class="py-16 text-center text-stone-400 bg-white themed-rounded-lg border border-dashed border-stone-300">
                                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 mx-auto mb-2 opacity-50"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
                                   <span class="block text-sm">Select a date to view availability slots</span>
                                </div>
                             }
                          </div>
                       </div>
                    </div>
                  } @else if (step() === 'details') {
                     <div class="animate-fade-in max-w-3xl mx-auto">
                        <div class="flex items-center justify-between mb-6 pb-4 border-b border-stone-300">
                           <h3 class="text-xl font-bold text-[#800000]">Pilgrim Details</h3>
                           <button (click)="step.set('date')" class="text-xs font-bold text-stone-500 hover:text-red-800 flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg> Back to Slots
                           </button>
                        </div>
                        
                        <!-- Selected Slot Info -->
                        <div class="bg-amber-50 p-4 themed-rounded-lg border border-amber-200 mb-8 flex items-center gap-4 shadow-sm">
                           <div class="bg-amber-200 p-2 themed-rounded text-amber-800">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                           </div>
                           <div>
                              <p class="text-xs text-stone-500 font-bold uppercase tracking-wider">Booking For</p>
                              <p class="text-lg font-bold text-stone-800">
                                 {{ selectedDate | date:'fullDate' }} 
                                 <span class="mx-2 text-stone-300">|</span> 
                                 {{ selectedSlot()?.time }}
                              </p>
                           </div>
                        </div>

                        <form (submit)="confirmBooking($event)" class="bg-white p-6 themed-rounded-lg shadow-sm border border-stone-200">
                           <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                              <div class="md:col-span-2">
                                 <label class="block text-stone-700 font-bold mb-1 text-sm">Full Name (As per ID Proof) <span class="text-red-500">*</span></label>
                                 <input [(ngModel)]="bookingData.name" name="pName" required class="w-full p-3 border border-stone-300 themed-rounded focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none uppercase placeholder:normal-case" placeholder="Enter Pilgrim Name">
                              </div>
                              <div>
                                 <label class="block text-stone-700 font-bold mb-1 text-sm">Mobile Number <span class="text-red-500">*</span></label>
                                 <div class="relative">
                                    <span class="absolute left-3 top-3 text-stone-500 text-sm font-bold">+91</span>
                                    <input [(ngModel)]="bookingData.mobile" name="pMobile" required pattern="[0-9]{10}" maxlength="10" class="w-full p-3 pl-10 border border-stone-300 themed-rounded focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none" placeholder="9999999999">
                                 </div>
                              </div>
                              <div>
                                 <label class="block text-stone-700 font-bold mb-1 text-sm">Aadhar Number <span class="text-red-500">*</span></label>
                                 <input [(ngModel)]="bookingData.idProof" name="pId" required minlength="12" maxlength="12" pattern="[0-9]{12}" class="w-full p-3 border border-stone-300 themed-rounded focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none" placeholder="12 Digit Aadhar No">
                              </div>
                              <div>
                                 <label class="block text-stone-700 font-bold mb-1 text-sm">Age</label>
                                 <input type="number" name="pAge" class="w-full p-3 border border-stone-300 themed-rounded focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none" placeholder="Age">
                              </div>
                              <div>
                                 <label class="block text-stone-700 font-bold mb-1 text-sm">Gender</label>
                                 <select name="pGender" class="w-full p-3 border border-stone-300 themed-rounded focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none bg-white">
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>
                                 </select>
                              </div>
                           </div>

                           <div class="bg-yellow-50 p-4 themed-rounded text-xs text-yellow-800 mb-6 flex gap-2">
                              <input type="checkbox" required id="agree" class="mt-0.5">
                              <label for="agree">I hereby declare that the details furnished above are true to the best of my knowledge. I will produce the original ID proof at the time of entry.</label>
                           </div>

                           <div class="flex justify-end">
                              <button type="submit" [disabled]="isBooking()" class="bg-[#800000] text-white px-10 py-3 themed-rounded font-bold shadow-lg hover:bg-red-900 disabled:opacity-70 flex items-center gap-3 transition-all">
                                 @if (isBooking()) {
                                    <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle></svg>
                                    <span>Booking...</span>
                                 } @else {
                                    <span>
                                      Confirm Booking 
                                      @if(templeService.siteConfig().darshanPrice > 0) {
                                        (₹{{ templeService.siteConfig().darshanPrice }})
                                      } @else {
                                        (Free)
                                      }
                                    </span>
                                 }
                              </button>
                           </div>
                        </form>
                     </div>
                  } @else if (step() === 'success') {
                     <div class="animate-fade-in text-center max-w-2xl mx-auto py-8">
                        <div class="mb-6">
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-20 h-20 mx-auto text-green-500 bg-green-50 p-3 rounded-full">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0118 0z" />
                           </svg>
                        </div>
                        <h3 class="text-3xl font-bold font-serif text-green-800 mb-2">Booking Confirmed!</h3>
                        <p class="text-stone-600 mb-8">Your Special Entry Darshan has been successfully booked. Please find your ticket below.</p>

                        <!-- Ticket -->
                        <div #ticket class="bg-white p-6 themed-rounded-lg border-2 border-dashed border-amber-500 text-left shadow-lg relative overflow-hidden">
                            <div class="absolute top-4 right-4 opacity-10 pointer-events-none">
                                <img src="https://opwncdejpaeltylplvhk.supabase.co/storage/v1/object/public/images/logo/cb3d423f-ec99-48a4-b070-adf5c21ddd76.png" class="h-24 w-auto">
                            </div>
                            <div class="flex justify-between items-start border-b border-stone-200 pb-4 mb-4">
                                <div>
                                    <p class="text-xs text-stone-500 uppercase font-bold">Darshan E-Ticket</p>
                                    <p class="font-bold text-[#800000]">{{ templeService.siteConfig().templeName }}</p>
                                </div>
                                <div>
                                    <p class="text-xs text-stone-500 text-right">Ticket No.</p>
                                    <p class="font-mono font-bold text-lg text-stone-800">{{ ticketData()?.ticketCode }}</p>
                                </div>
                            </div>
                            <div class="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                                <div class="col-span-2">
                                    <p class="text-xs text-stone-500">Pilgrim Name</p>
                                    <p class="font-bold text-lg text-stone-800">{{ ticketData()?.name }}</p>
                                </div>
                                <div>
                                    <p class="text-xs text-stone-500">Date</p>
                                    <p class="font-bold text-stone-800">{{ ticketData()?.date | date:'fullDate' }}</p>
                                </div>
                                <div>
                                    <p class="text-xs text-stone-500">Slot</p>
                                    <p class="font-bold text-stone-800">{{ ticketData()?.slot }}</p>
                                </div>
                                <div>
                                    <p class="text-xs text-stone-500">Mobile</p>
                                    <p class="font-bold text-stone-800">{{ ticketData()?.mobile }}</p>
                                </div>
                                <div>
                                    <p class="text-xs text-stone-500">Status</p>
                                    <p class="font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full inline-block">CONFIRMED</p>
                                </div>
                            </div>
                            <div class="mt-6 border-t border-dashed border-stone-300 pt-4 text-xs text-stone-500">
                                Please carry a valid photo ID. Entry is subject to verification.
                            </div>
                        </div>

                        <div class="mt-8 flex justify-center gap-4">
                            <button (click)="printTicket(null)" class="bg-stone-800 text-white px-6 py-2 themed-rounded font-bold hover:bg-stone-900 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.198-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z"></path></svg>
                                Print Ticket
                            </button>
                            <button (click)="resetBooking()" class="border border-[#800000] text-[#800000] px-6 py-2 themed-rounded font-bold hover:bg-red-50">Book Another Slot</button>
                        </div>
                     </div>
                  }
               } @else {
                  <!-- Disabled State -->
                  <div class="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
                      <div class="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mb-6">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 text-stone-400"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                      </div>
                      <h3 class="text-2xl font-bold text-stone-700 font-serif">Booking System Unavailable</h3>
                      <p class="text-stone-500 max-w-md mt-2">The online booking portal is temporarily closed for maintenance. Please check back later.</p>
                  </div>
               }
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class BookingComponent {
  templeService = inject(TempleService);

  viewMode = signal<'book' | 'history'>('book');
  step = signal<'date' | 'details' | 'success'>('date');
  
  currentDateDisplay = new Date();
  
  // Use service helper for consistent local date
  minDate = this.templeService.getTodayDate();
  selectedDate = this.templeService.getTodayDate();
  
  slots = signal<SlotAvailability[]>([]);
  selectedSlot = signal<SlotAvailability | null>(null);
  loadingSlots = signal(false);
  
  bookingData = { name: '', mobile: '', idProof: '' };
  isBooking = signal(false);
  
  ticketData = signal<{
    ticketCode: string;
    name: string;
    date: string;
    slot: string;
    mobile: string;
  } | null>(null);

  userBookings = signal<Booking[]>([]);

  constructor() {
    this.fetchSlots();
  }

  async fetchSlots() {
    this.loadingSlots.set(true);
    this.selectedSlot.set(null);
    const availableSlots = await this.templeService.getSlotAvailability(this.selectedDate);
    this.slots.set(availableSlots);
    this.loadingSlots.set(false);
  }
  
  selectSlot(slot: SlotAvailability) {
    if (slot.status !== 'FULL') {
      this.selectedSlot.set(slot);
    }
  }

  nextStep() {
    if (this.selectedSlot()) {
      this.step.set('details');
    }
  }

  async loadUserBookings() {
      this.viewMode.set('history');
      const bookings = await this.templeService.getUserBookings();
      this.userBookings.set(bookings);
  }

  async confirmBooking(event: Event) {
    event.preventDefault();
    if (!this.selectedSlot() || !this.bookingData.name || !this.bookingData.mobile || !this.bookingData.idProof) {
      alert('Please fill all required fields.');
      return;
    }
    
    this.isBooking.set(true);
    const booking = {
      date: this.selectedDate,
      slot: this.selectedSlot()!.time,
      devoteeName: this.bookingData.name,
      mobile: this.bookingData.mobile,
      ticketCode: '', 
      status: 'Booked' as const
    };

    const result = await this.templeService.bookDarshanSlot(booking);

    if (result.success && result.ticketCode) {
      this.ticketData.set({
        ticketCode: result.ticketCode,
        name: this.bookingData.name,
        date: this.selectedDate,
        slot: this.selectedSlot()!.time,
        mobile: this.bookingData.mobile
      });
      this.step.set('success');
    } else {
      alert(result.message || 'Booking failed. Please try again.');
    }
    this.isBooking.set(false);
  }

  printTicket(ticket?: any) {
    // In a real app, this would generate a PDF or open a specific print view.
    // For now, we rely on browser print and CSS to hide non-ticket elements.
    // Ideally we would set a 'printData' signal and show a modal, then print that.
    window.print();
  }
  
  resetBooking() {
    this.step.set('date');
    this.selectedSlot.set(null);
    this.bookingData = { name: '', mobile: '', idProof: '' };
    this.ticketData.set(null);
    this.selectedDate = this.templeService.getTodayDate();
    this.fetchSlots();
  }
}
