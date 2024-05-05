import { Component } from '@angular/core';
import { TariffService } from '../../../services/product/tariff/tariff.service';
import { Subject, takeUntil } from 'rxjs';
import { ProductService } from '../../../services/product/product.service';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {

  active = 1;

  tariffOrHardware: number | null = 1

  private unsubscribe$ = new Subject<void>();

  constructor(public tariffService: TariffService, private productService: ProductService) {}

  ngOnInit() {    
    this.productService.tariffOrHardwareTabActive$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(id =>{
        this.tariffOrHardware = id
      })

  }



  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    console.log('destroy list')

    this.tariffService.resetData()
    //this.groupId = undefined
  }
  
}
