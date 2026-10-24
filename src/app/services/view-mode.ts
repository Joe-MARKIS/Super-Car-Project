import { Injectable, signal } from '@angular/core';

export type ViewMode = 'auto' | 'mobile' | 'pc';

@Injectable({
  providedIn: 'root',
})
export class ViewModeService {
  readonly mode = signal<ViewMode>('auto');

  setMode(newMode: ViewMode) {
    this.mode.set(newMode);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  toggleViewMode() {
    this.mode.update((current) => (current === 'mobile' ? 'pc' : 'mobile'));
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
