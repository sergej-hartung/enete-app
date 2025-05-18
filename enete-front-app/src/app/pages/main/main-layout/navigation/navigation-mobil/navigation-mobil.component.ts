import { Component, DestroyRef, HostListener, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Navigation, NavigationService } from '../navigation-service/navigation.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-navigation-mobil',
  imports: [CommonModule, RouterLink, NgbCollapse],
  templateUrl: './navigation-mobil.component.html',
  styleUrl: './navigation-mobil.component.scss'
})
export class NavigationMobilComponent {
  public isMenuCollapsed = true

  private destroyRef = inject(DestroyRef);
  navs: Navigation[] = []
  currentPath = '';

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMenuCollapsed = true
  }

  constructor(private nav_service: NavigationService, private router: Router) {
    // router.events.pipe(
    //   filter((e): e is NavigationEnd => e instanceof NavigationEnd),
    //   takeUntilDestroyed(this.destroyRef)
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
    this.nav_service.MobileMenuToggle.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(
      event => {
        this.isMenuCollapsed = !this.isMenuCollapsed
      }
    )

    this.getNavigation()
  }

  getNavigation() {
    this.nav_service.getNavigation().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(
      navs => {
        this.navs = navs
        this.navs.sort((a, b) => (a.sequence > b.sequence) ? 1 : -1)
      }

    )
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
