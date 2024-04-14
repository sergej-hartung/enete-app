import { Component } from '@angular/core';
import { MainNavbarService } from '../../services/main-navbar.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {

  constructor(
    private mainNavbarService: MainNavbarService
  ) {}

  
  ngOnInit() {
    this.initIconStates();
  }

  private initIconStates(): void {
    this.mainNavbarService.setIconState('save', true, true);
    this.mainNavbarService.setIconState('new', true, false);
  }
}
