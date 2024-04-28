import { Component } from '@angular/core';
import { TariffService } from '../../../services/product/tariff/tariff.service';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {

  active = 1;

  private unsubscribe$ = new Subject<void>();

  constructor(public tariffService: TariffService,) {}

  ngOnInit() {    


  }



  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    console.log('destroy list')

    this.tariffService.resetData()
    //this.groupId = undefined
  }
  
}
