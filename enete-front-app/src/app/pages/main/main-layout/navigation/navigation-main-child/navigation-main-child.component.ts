import { Component, DestroyRef, inject } from '@angular/core';
import { Navigation, NavigationService } from '../navigation-service/navigation.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navigation-main-child',
  imports: [CommonModule, RouterLink],
  templateUrl: './navigation-main-child.component.html',
  styleUrl: './navigation-main-child.component.scss'
})
export class NavigationMainChildComponent {
  private destroyRef = inject(DestroyRef);
  navs: Navigation[] = []
  currentPath: string = '';

  constructor(
    private nav_service: NavigationService,
    //private route: ActivatedRoute,
    private router: Router
  ) {
    this.currentPath = this.router.url.split('?')[0];
    this.router.events.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      this.currentPath = this.router.url.split('?')[0];
    });
  }

  ngOnInit() {

    // this.route.queryParams.pipe(
    //   takeUntilDestroyed(this.destroyRef)
    // ).subscribe(params => {
    //   const id = params['id'] ? +params['id'] : null; // Konvertiere id zu Zahl, falls vorhanden
    //   this.getChildNavigation(id);
    // });
    this.loadNavigation();

  }

  private loadNavigation() {
    this.nav_service.getNavigation().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(navs => {
      // Finde die passende Hauptkategorie basierend auf dem aktuellen Pfad
      const parentPath = this.currentPath.split('/').slice(0, -1).join('/') || this.currentPath; // z. B. /main/products
      const navMainNode = navs.find((nav: Navigation) => 
        this.currentPath === nav.src || this.currentPath.startsWith(nav.src + '/')
      );

      if (navMainNode && navMainNode.children && navMainNode.children.length > 0) {
        this.navs = navMainNode.children;
        this.navs.sort((a, b) => (a.sequence > b.sequence) ? 1 : -1);
      } else {
        this.navs = []; // Keine Navigation anzeigen, wenn keine passende Kategorie gefunden wird
      }
    });
  }

  // getChildNavigation(id: number | null) {
  //   this.nav_service.getNavigation().pipe(
  //     takeUntilDestroyed(this.destroyRef)
  //   ).subscribe(navs => {
  //     let navMainNode: Navigation | undefined;

  //     // Finde die passende Hauptkategorie basierend auf der ID oder dem aktuellen Pfad
  //     if (id) {
  //       navMainNode = navs.find((nav: Navigation) => nav.id === id);
  //     } else {
  //       // Falls keine ID vorhanden ist, versuche, die Hauptkategorie aus dem Pfad zu ermitteln
  //       const parentPath = this.currentPath.split('/').slice(0, -1).join('/'); // z. B. /main/products aus /main/products/energy
  //       navMainNode = navs.find((nav: Navigation) => nav.src === parentPath || this.currentPath.startsWith(nav.src + '/'));
  //     }

  //     if (navMainNode && navMainNode.children && navMainNode.children.length > 0) {
  //       this.navs = navMainNode.children;
  //       this.navs.sort((a, b) => (a.sequence > b.sequence) ? 1 : -1);
  //     } else {
  //       // Weiterleitung nur, wenn keine passende Navigation gefunden wurde
  //       this.router.navigate(['/not-found']); // Bessere Alternative zu '/'
  //     }
  //   });
  // }

  ngOnDestroy() {

  }
}
