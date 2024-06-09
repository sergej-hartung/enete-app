import { Component } from '@angular/core';
import { MainNavbarService } from '../../../services/main-navbar.service';

@Component({
  selector: 'app-product-add-edit',
  templateUrl: './product-add-edit.component.html',
  styleUrl: './product-add-edit.component.scss'
})
export class ProductAddEditComponent {

  constructor(
    private mainNavbarService: MainNavbarService,
  ) {}


  ngOnInit() {
    this.mainNavbarService.setIconState('back', true, false);
    console.log('test')
  }

  ngOnDestroy() {
    this.mainNavbarService.setIconState('back', true, true);
    //this.groupId = undefined
  }

}
