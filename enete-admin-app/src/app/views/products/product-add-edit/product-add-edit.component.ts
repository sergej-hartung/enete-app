import { Component, Input } from '@angular/core';
import { MainNavbarService } from '../../../services/main-navbar.service';
import { ProductService } from '../../../services/product/product.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-product-add-edit',
  templateUrl: './product-add-edit.component.html',
  styleUrl: './product-add-edit.component.scss'
})
export class ProductAddEditComponent {


  productType: string | null = null

  private unsubscribe$ = new Subject<void>();

  constructor(
    private mainNavbarService: MainNavbarService,
    private productService: ProductService
  ) {}


  ngOnInit() {

    this.productService.tariffOrHardwareTabActive$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(id =>{
        if(id == 1){
          this.productType = 'tariff'
        }
        if(id == 2){
          this.productType = 'hardware'
        }
      })
    console.log('test')
    this.initIconStates()
  }

  private initIconStates(): void {
    this.mainNavbarService.setIconState('save', true, true);
    this.mainNavbarService.setIconState('new', true, true);
    this.mainNavbarService.setIconState('back', true, false);
    this.mainNavbarService.setIconState('edit', true, true);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

    this.mainNavbarService.setIconState('back', true, true);
    //this.groupId = undefined
  }

}
