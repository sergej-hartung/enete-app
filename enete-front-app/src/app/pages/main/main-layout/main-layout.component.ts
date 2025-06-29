import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { NavigationMobilComponent } from './navigation/navigation-mobil/navigation-mobil.component';
import { NavigationMainComponent } from './navigation/navigation-main/navigation-main.component';
import { SecondNavigationMobilComponent } from './navigation/second-navigation-mobil/second-navigation-mobil.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, HeaderComponent, NavigationMobilComponent, NavigationMainComponent, SecondNavigationMobilComponent],
  template: `
    <div class="container-fluid" style="height: 100%;">
    <!-- Block Header -->
    <app-header class="row header"></app-header>
    <!-- Menu Mobil -->
    <app-navigation-mobil></app-navigation-mobil>


    <!-- cntent wrap-->
    <div class="row content_wrap overflow-hidden">
        <!-- ipad & desc Main menu -->
        <app-navigation-main class="nav_wrap d-none d-md-flex"></app-navigation-main>
        <!-- END ipad & desc Main menu -->
        <!-- content -->
        <div class="col ene_content" (scroll)="onContentScroll($event)">
          <router-outlet></router-outlet>
        </div>
        <!-- END content -->
      </div>
      <!-- END cntent wrap -->
      <app-second-navigation-mobil class="row secon_mobile_menu d-flex d-md-none"></app-second-navigation-mobil>
    </div>
  `,
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {

  onContentScroll(test: any){
    //console.log(test)
  }
}
