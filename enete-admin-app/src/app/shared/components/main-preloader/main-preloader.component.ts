import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import {PreloaderService} from '../../../services/preloader.service'

@Component({
  selector: 'app-main-preloader',
  templateUrl: './main-preloader.component.html',
  styleUrl: './main-preloader.component.scss'
})
export class MainPreloaderComponent {
  isLoading: boolean = false;
  loadingMessage: string = 'Loading';

  private unsubscribe$ = new Subject<void>();

  constructor(private preloaderService: PreloaderService) {}

  ngOnInit() {
    // Подписка на события изменения состояния прелоадера
    this.preloaderService.isLoading$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((state) => {
      this.isLoading = state.isLoading;
      this.loadingMessage = state.message || 'Loading';
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
