import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface PreloaderState {
  isLoading: boolean;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PreloaderService {

  private preloaderState = new BehaviorSubject<PreloaderState>({ isLoading: false });
  isLoading$ = this.preloaderState.asObservable();

  // Метод включения прелоадера
  show(message: string = 'Loading') {
    this.preloaderState.next({ isLoading: true, message });
  }

  // Метод выключения прелоадера
  hide() {
    this.preloaderState.next({ isLoading: false });
  }
}
