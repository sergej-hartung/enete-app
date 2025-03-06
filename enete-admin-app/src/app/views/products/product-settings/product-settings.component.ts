import { Component } from '@angular/core';
import { MainNavbarService } from '../../../services/main-navbar.service';

@Component({
  selector: 'app-product-settings',
  templateUrl: './product-settings.component.html',
  styleUrl: './product-settings.component.scss'
})
export class ProductSettingsComponent {
  activeGroup = 1


  constructor(
      private mainNavbarService: MainNavbarService,

    ) {}

  ngOnInit() {
    // this.mainNavbarService.setIconState('save', true, true);
    // this.mainNavbarService.setIconState('new', true, true);
    // this.mainNavbarService.setIconState('back', false, true);
    // this.mainNavbarService.setIconState('edit', true, true);
    // this.mainNavbarService.setIconState('delete', true, true);
  }
}
