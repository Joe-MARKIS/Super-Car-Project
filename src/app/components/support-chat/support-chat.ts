import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { LanguageService } from '../../services/language';

interface ChatMessage {
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

@Component({
  selector: 'app-support-chat',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, MatIconModule],
  template: `
    <!-- Floating Support Chat Container -->
    <div class="fixed bottom-4 right-4 z-40">
      @if (isOpen()) {
        <!-- Chat Drawer -->
        <div class="bg-white rounded-xl shadow-2xl border border-zinc-300 w-80 sm:w-96 overflow-hidden flex flex-col mb-3 animate-fadeIn">
          <!-- Chat Header -->
          <div class="bg-gradient-to-r from-[#DC2626] to-[#1A1A1A] text-white p-3.5 flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-full bg-white text-red-600 flex items-center justify-center font-black">
                <mat-icon class="scale-90">support_agent</mat-icon>
              </div>
              <div>
                <div class="font-bold text-xs">Conseiller Export AutoForward</div>
                <div class="text-[10px] text-emerald-300 flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>En ligne (Tokyo & Kinshasa)</span>
                </div>
              </div>
            </div>

            <button
              (click)="isOpen.set(false)"
              class="text-zinc-300 hover:text-white cursor-pointer"
            >
              <mat-icon class="scale-90">close</mat-icon>
            </button>
          </div>

          <!-- Messages Stream -->
          <div class="p-3.5 space-y-3 h-64 overflow-y-auto bg-zinc-50 text-xs">
            @for (msg of messages(); track msg.time) {
              <div class="flex flex-col" [class.items-end]="msg.sender === 'user'" [class.items-start]="msg.sender === 'bot'">
                <div
                  class="max-w-[85%] rounded-lg p-2.5 shadow-2xs leading-relaxed"
                  [class.bg-[#DC2626]]="msg.sender === 'user'"
                  [class.text-white]="msg.sender === 'user'"
                  [class.bg-white]="msg.sender === 'bot'"
                  [class.text-zinc-800]="msg.sender === 'bot'"
                  [class.border]="msg.sender === 'bot'"
                  [class.border-zinc-200]="msg.sender === 'bot'"
                >
                  {{ msg.text }}
                </div>
                <span class="text-[9px] text-zinc-400 mt-0.5 px-1">{{ msg.time }}</span>
              </div>
            }
          </div>

          <!-- Input bar -->
          <div class="p-2.5 border-t border-zinc-200 bg-white flex items-center gap-1.5">
            <input
              type="text"
              [(ngModel)]="inputText"
              (keyup.enter)="sendMessage()"
              [placeholder]="lang.t('chatPlaceholder')"
              class="flex-1 text-xs border border-zinc-300 rounded-md px-2.5 py-1.5 outline-none focus:border-red-600"
            />
            <button
              (click)="sendMessage()"
              class="bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-md flex items-center justify-center transition-colors cursor-pointer"
            >
              <mat-icon class="scale-75">send</mat-icon>
            </button>
          </div>
        </div>
      }

      <!-- Trigger Button -->
      <button
        (click)="isOpen.set(!isOpen())"
        class="bg-[#DC2626] hover:bg-[#B91C1C] text-white shadow-lg rounded-full px-4 py-2.5 flex items-center gap-2.5 font-extrabold text-xs transition-transform active:scale-95 cursor-pointer border-2 border-white"
      >
        <div class="relative">
          <mat-icon class="text-white scale-110">chat</mat-icon>
        </div>
        <div class="text-left hidden sm:block">
          <div class="text-[10px] text-red-100 font-medium">Besoin d'aide ?</div>
          <div class="text-xs uppercase tracking-tight font-black">COMMENCER LE CHAT</div>
        </div>
      </button>
    </div>
  `,
})
export class SupportChatComponent {
  readonly lang = inject(LanguageService);

  readonly isOpen = signal<boolean>(false);
  readonly inputText = '';

  readonly messages = signal<ChatMessage[]>([
    {
      sender: 'bot',
      text: 'Bonjour ! Bienvenue chez AutoForward. Avez-vous une question sur un véhicule, les frais maritimes vers le port de Matadi / Dar es Salaam ou la réservation ?',
      time: '12:00',
    },
  ]);

  sendMessage() {
    if (!this.inputText.trim()) return;
    const userMsg = this.inputText;
    this.messages.update((list) => [
      ...list,
      {
        sender: 'user',
        text: userMsg,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    (this as { inputText: string }).inputText = '';

    // Auto reply
    setTimeout(() => {
      this.messages.update((list) => [
        ...list,
        {
          sender: 'bot',
          text: 'Merci pour votre message ! Un conseiller dédié à votre pays d\'expédition prend en charge votre demande. Vous pouvez également cliquer sur "Demander un devis" sur la fiche du véhicule.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 800);
  }
}
