import { Component, inject, signal, ViewChild, ElementRef, AfterViewChecked, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { TempleService } from '../services/temple.service';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Floating Action Button -->
    <button *ngIf="!isOpen()" (click)="toggleChat()" 
      class="fixed bottom-6 right-6 w-16 h-16 bg-[#800000] text-amber-400 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-[100] border-2 border-amber-500 group animate-fade-in-up">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 group-hover:animate-pulse">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.159 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
      </svg>
    </button>

    <!-- Chat Window -->
    <div *ngIf="isOpen()" class="fixed bottom-6 right-6 w-[90vw] md:w-96 h-[500px] bg-white rounded-xl shadow-2xl flex flex-col z-[100] border border-amber-600 overflow-hidden animate-fade-in-up">
      <!-- Header -->
      <div class="bg-[#800000] p-4 flex justify-between items-center text-white shadow-md">
         <div class="flex items-center gap-3">
             <div class="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center border border-amber-500 overflow-hidden">
               <img src="https://opwncdejpaeltylplvhk.supabase.co/storage/v1/object/public/images/logo/cb3d423f-ec99-48a4-b070-adf5c21ddd76.png" class="w-8 h-8 opacity-90" alt="Deity">
             </div>
             <div>
               <h3 class="font-bold font-serif text-amber-400 leading-tight">Digital Sahayak</h3>
               <p class="text-[10px] text-amber-200 opacity-90">Official Temple Assistant</p>
             </div>
         </div>
         <button (click)="toggleChat()" class="hover:text-amber-400 transition-colors p-1">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
         </button>
      </div>

      <!-- Messages Area -->
      <div #scrollContainer class="flex-grow p-4 overflow-y-auto bg-stone-50 space-y-4">
         <div class="flex gap-2">
            <div class="w-8 h-8 rounded-full bg-[#800000] flex-shrink-0 flex items-center justify-center text-amber-400 text-xs font-bold border border-amber-500 shadow-sm">DS</div>
            <div class="bg-white p-3 rounded-tr-xl rounded-br-xl rounded-bl-xl shadow-sm text-sm text-stone-700 border border-stone-200">
               <p class="font-bold text-[#800000] mb-1 text-xs">Namaskaram! 🙏</p>
               I am the Digital Sahayak for {{ templeService.siteConfig().templeName }}. How may I help you today?
            </div>
         </div>

         @for (msg of messages(); track msg.id) {
            <div class="flex gap-2 animate-fade-in" [class.flex-row-reverse]="msg.role === 'user'">
               <div class="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold shadow-sm"
                    [class.bg-[#800000]]="msg.role === 'model'"
                    [class.text-amber-400]="msg.role === 'model'"
                    [class.border]="msg.role === 'model'"
                    [class.border-amber-500]="msg.role === 'model'"
                    [class.bg-amber-500]="msg.role === 'user'"
                    [class.text-white]="msg.role === 'user'">
                    {{ msg.role === 'user' ? 'U' : 'DS' }}
               </div>
               <div class="p-3 shadow-sm text-sm max-w-[80%]"
                    [class.rounded-tr-xl]="msg.role === 'model'"
                    [class.rounded-br-xl]="msg.role === 'model'"
                    [class.rounded-bl-xl]="msg.role === 'model'"
                    [class.bg-white]="msg.role === 'model'"
                    [class.text-stone-700]="msg.role === 'model'"
                    [class.border]="msg.role === 'model'"
                    [class.border-stone-200]="msg.role === 'model'"
                    
                    [class.rounded-tl-xl]="msg.role === 'user'"
                    [class.rounded-bl-xl]="msg.role === 'user'"
                    [class.rounded-br-xl]="msg.role === 'user'"
                    [class.bg-amber-100]="msg.role === 'user'"
                    [class.text-stone-900]="msg.role === 'user'"
                    [class.border]="msg.role === 'user'"
                    [class.border-amber-200]="msg.role === 'user'">
                    {{ msg.text }}
               </div>
            </div>
         }

         @if (isLoading()) {
            <div class="flex gap-2 animate-fade-in">
               <div class="w-8 h-8 rounded-full bg-[#800000] flex-shrink-0 flex items-center justify-center text-amber-400 text-xs font-bold border border-amber-500">DS</div>
               <div class="bg-white p-3 rounded-tr-xl rounded-br-xl rounded-bl-xl shadow-sm border border-stone-200 flex gap-1 items-center">
                  <div class="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></div>
                  <div class="w-2 h-2 bg-amber-500 rounded-full animate-bounce delay-100"></div>
                  <div class="w-2 h-2 bg-amber-500 rounded-full animate-bounce delay-200"></div>
               </div>
            </div>
         }
      </div>

      <!-- Input Area -->
      <div class="p-3 bg-white border-t border-stone-200 flex gap-2">
         <input [(ngModel)]="currentMessage" (keyup.enter)="sendMessage()" 
                placeholder="Ask about timings, booking..." 
                class="flex-grow p-2 pl-3 border border-stone-300 rounded-lg focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000] text-sm bg-stone-50">
         <button (click)="sendMessage()" [disabled]="!currentMessage.trim() || isLoading()" 
                 class="bg-[#800000] text-amber-400 p-2 px-3 rounded-lg hover:bg-red-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
         </button>
      </div>
    </div>
  `
})
export class ChatComponent implements AfterViewChecked {
  templeService = inject(TempleService);
  
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  isOpen = signal(false);
  isLoading = signal(false);
  messages = signal<ChatMessage[]>([]);
  currentMessage = '';
  
  private ai: GoogleGenAI;
  private chatSession: Chat | null = null;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  toggleChat() {
    this.isOpen.update(v => !v);
    if (this.isOpen() && !this.chatSession) {
      this.initChat();
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom() {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    }
  }

  private initChat() {
    const config = this.templeService.siteConfig();
    const systemInstruction = `
      You are 'Digital Sahayak', the official helpful AI assistant for ${config.templeName} located in Pendurthi, Visakhapatnam.
      
      KEY TEMPLE INFO:
      - Name: ${config.templeName}
      - Location: ${config.address}
      - Contact: ${config.contactPhone}, ${config.contactEmail}
      - Timings: 
        * Suprabhatam: 05:00 AM
        * Morning Darshan: 06:00 AM - 01:00 PM
        * Break: 01:00 PM - 04:00 PM
        * Evening Darshan: 04:00 PM - 08:30 PM
        * Ekantha Seva: 09:00 PM
      - Booking: Special Entry Darshan is available online. It is currently FREE. Pilgrims must carry ID proof.
      - Dress Code: Traditional dress is mandatory. Men: Dhoti/Pyjama with Upper Cloth. Women: Saree/Chudidhar with Dupatta.
      - Donations: E-Hundi is available for Srivari Kanuka, Annadanam, and Gosala.

      GUIDELINES:
      1. Always start your response with "Om Namo Venkatesaya" or "Namaskaram" when appropriate.
      2. Be polite, respectful, and concise.
      3. Do not invent false information. If you don't know, ask them to contact the Help Desk at ${config.contactPhone}.
      4. Use a divine and welcoming tone.
    `;

    this.chatSession = this.ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemInstruction,
      },
    });
  }

  async sendMessage() {
    if (!this.currentMessage.trim() || !this.chatSession) return;

    const userMsg = this.currentMessage;
    this.currentMessage = '';
    
    // Add user message
    this.messages.update(msgs => [...msgs, { id: Date.now().toString(), role: 'user', text: userMsg }]);
    this.isLoading.set(true);

    try {
      const response: GenerateContentResponse = await this.chatSession.sendMessage({ message: userMsg });
      const text = response.text;
      
      this.messages.update(msgs => [...msgs, { id: Date.now().toString(), role: 'model', text }]);
    } catch (error) {
      console.error('Chat error:', error);
      this.messages.update(msgs => [...msgs, { id: Date.now().toString(), role: 'model', text: 'Apologies, I am having trouble connecting to the divine network. Please try again later.' }]);
    } finally {
      this.isLoading.set(false);
    }
  }
}