import { Component, DestroyRef, HostListener, inject } from '@angular/core';
import { Navigation, NavigationService } from '../navigation-service/navigation.service';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, pipe } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { NgbDropdown, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-second-navigation-mobil',
  imports: [CommonModule, RouterLink, NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownItem],
  templateUrl: './second-navigation-mobil.component.html',
  styleUrl: './second-navigation-mobil.component.scss'
})
export class SecondNavigationMobilComponent {

  private destroyRef = inject(DestroyRef);
  public innerWidth = 0
  navs: Navigation[] = []
  currentPath = '';

  public navMain:Navigation[] = []
  public navSecond:Navigation[] = []

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
    this.getNavigation()

  }

  constructor(private nav_service: NavigationService, private router: Router) {
    // router.events.pipe(
    //   filter((e): e is NavigationEnd => e instanceof NavigationEnd)
    // ).subscribe(
    //   e => {
    //     let url = e.url.split('?')[0]
    //     let mainPath = url.split('/')

    //     this.path = mainPath.length > 1 ? '/' + mainPath[1] : '/' + mainPath[0]

    //   }
    // )
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(
      e => {
        this.currentPath = e.urlAfterRedirects.split('?')[0];
      }
    );
  }

  ngOnInit() {
    this.innerWidth = window.innerWidth

    this.getNavigation()

  }

  getNavigation() {
    if (this.innerWidth < 768) {
      if (this.navs && this.navs.length > 0) {
        this.calcNav()
      } else {
        this.nav_service.getNavigation().pipe(
          takeUntilDestroyed(this.destroyRef)
        ).subscribe(
          navs => {
            this.navs = navs
            this.navs.sort((a, b) => (a.sequence > b.sequence) ? 1 : -1)
            this.calcNav()
          }
        )
      }
    }  
  }

  calcNav() {
    let width = this.innerWidth
    let count = this.navs.length

    let nav_count = Math.floor(width / 116)

    let res = nav_count > count ? count : nav_count

    this.navMain = this.navs.slice(0, res)
    this.navSecond = this.navs.slice(res)
  }

  isActive(nav: Navigation): boolean {
    // Prüfe, ob der aktuelle Pfad exakt mit nav.src übereinstimmt
    if (this.currentPath === nav.src) {
      return true;
    }
    // Prüfe, ob der aktuelle Pfad ein Unterpfad von nav.src ist
    if (this.currentPath.startsWith(nav.src + '/')) {
      return true;
    }
    return false;
  }

  ngOnDestroy() {

  }
}
