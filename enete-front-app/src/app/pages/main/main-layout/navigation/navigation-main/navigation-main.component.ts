import { Component, DestroyRef, inject } from '@angular/core';
import { filter} from 'rxjs';
import { Navigation, NavigationService } from '../navigation-service/navigation.service';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navigation-main',
  imports: [CommonModule, RouterLink],
  templateUrl: './navigation-main.component.html',
  styleUrl: './navigation-main.component.scss'
})
export class NavigationMainComponent {
  
  private destroyRef = inject(DestroyRef);
  navs: Navigation[] = []
  currentPath = '';


  constructor(
    private nav_service: NavigationService, 
    private router: Router
  ) {

    // router.events.pipe(
    //   filter((e): e is NavigationEnd => e instanceof NavigationEnd),
    //   takeUntilDestroyed(this.destroyRef)
    // ).subscribe(
    //   e => {
    //     let url = e.url.split('?')[0]
        
    //     let mainPath = url.split('/')
    //     this.path = mainPath.length > 2 ? '/' + mainPath[2] : '/' + mainPath[1]
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
    this.getNavigation()

    //this.router.events.pipe(
    //  filter((e): e is NavigationEnd => e instanceof NavigationEnd)
    //).subscribe(
    //  e => {
    //    console.log(e)
    //  }
    //)


    //this.router.events.subscribe(
    //  event => {
    //    console.log(event)
    //  }
    //)
    
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
