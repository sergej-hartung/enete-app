import { Component, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { NavigationMainChildComponent } from '../main-layout/navigation/navigation-main-child/navigation-main-child.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  imports: [CommonModule, NavigationMainChildComponent, RouterOutlet],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  
  isSubcategoryActive = false;
  private destroyRef = inject(DestroyRef);

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Setze die ID standardmäßig auf die "Produkte"-ID (z. B. 2), falls nicht vorhanden
    // this.route.queryParams.pipe(
    //   takeUntilDestroyed(this.destroyRef)
    // ).subscribe(params => {
    //   if (!params['id']) {
    //     this.router.navigate([], {
    //       relativeTo: this.route,
    //       queryParams: { id: 2 }, // ID von "Produkte" aus NavigationService
    //       queryParamsHandling: 'merge'
    //     });
    //   }
    // });
  }

  ngOnInit() {
    // Prüfe, ob eine Unterkategorie aktiv ist
    this.checkSubcategoryActive();

    // Reagiere auf Routenänderungen
    this.router.events.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      this.checkSubcategoryActive();
    });
  }

  private checkSubcategoryActive() {
    // Prüfe, ob eine Kindroute aktiv ist (z. B. /main/products/energy)
    const childRoute = this.route.snapshot.firstChild;
    this.isSubcategoryActive = !!childRoute; // True, wenn eine Unterkategorie aktiv ist
  }

}
