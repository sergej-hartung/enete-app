import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { NavigationService } from '../navigation/navigation-service/navigation.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private ngUnsubscribe = new Subject();

  logoSrc = 'public/img/logo.svg'
  logoSmallSrc = 'public/img/logo_klein.svg'
  logoAlt = 'Logo'


  constructor(private nav_service: NavigationService) {}

  MobileMenuToggle() {
    //this.nav_service.MobileMenuToggle.emit()
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    // this.ngUnsubscribe.next();
    // this.ngUnsubscribe.complete();
  }
}
