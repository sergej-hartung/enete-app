import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainNavbarService {

  protected confirmActionSource = new Subject<{action: string, proceedCallback: () => void}>();
  public confirmAction$ = this.confirmActionSource.asObservable();
  
  // Состояние иконок
  private iconsState = new BehaviorSubject<{ [iconName: string]: { active: boolean, disabled: boolean } }>({});

  // Observable состояний иконок
  iconsState$ = this.iconsState.asObservable();

  // Объект для отслеживания нажатий
  private iconClicks = new Subject<string>();

  // Observable для нажатий
  iconClicks$ = this.iconClicks.asObservable();

  constructor() {}

  // Метод для установки состояния иконки
  setIconState(iconName: string, active: boolean, disabled: boolean) {
    const currentIcons = this.iconsState.getValue();
    currentIcons[iconName] = { active, disabled };
    this.iconsState.next(currentIcons);
  }

  // Метод для отслеживания нажатия на иконку
  onIconClick(iconName: string) {
    this.iconClicks.next(iconName);
  }


  confirmAction(action: string, proceedCallback: () => void) {
    this.confirmActionSource.next({action, proceedCallback});
  }
}