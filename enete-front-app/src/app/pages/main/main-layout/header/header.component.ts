import { Component, DestroyRef, inject } from '@angular/core';
import { filter, Subject } from 'rxjs';
import { Navigation, NavigationService } from '../navigation/navigation-service/navigation.service';
import { NavigationEnd, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private destroyRef = inject(DestroyRef);
  
  logoSrc = 'img/logo.svg'
  logoSmallSrc = 'img/logo_klein.svg'
  logoAlt = 'Logo'

  title = ''

  navs: Navigation[] = []
  currentPath = '';


  constructor(
    private nav_service: NavigationService,
    private router: Router
  ) {
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(
      e => {
        this.currentPath = e.urlAfterRedirects.split('?')[0];
        this.setTitle();
      }
    );
  }

  MobileMenuToggle() {
    this.nav_service.MobileMenuToggle.emit()
  }

  ngOnInit() {
    this.getNavigation()
  }

  getNavigation() {
    this.nav_service.getNavigation().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(
      navs => {
        this.navs = navs
        this.navs.sort((a, b) => (a.sequence > b.sequence) ? 1 : -1)
        console.log(this.navs)
        this.setTitle()
      }
 
    )
  }


  setTitle(){
    // if (!this.currentPath || this.currentPath === '/') {
    //   this.title = 'Startseite';
    //   return;
    // }

    // Finde die passende Navigation basierend auf dem aktuellen Pfad
    const matchingNav = this.navs.find(nav => {
      return this.currentPath === nav.src || this.currentPath.startsWith(nav.src + '/');
    });

    if (matchingNav) {
      if (matchingNav.children) {
        const matchingChild = matchingNav.children.find(child => 
          this.currentPath === child.src || this.currentPath.startsWith(child.src + '/')
        );
        this.title = matchingChild ? matchingChild.name : matchingNav.name;
      } else {
        this.title = matchingNav.name;
      }
    } else {
      this.title = 'Unbekannte Seite';
    }
  }
  

  ngOnDestroy() {
    // this.ngUnsubscribe.next();
    // this.ngUnsubscribe.complete();
  }
}
