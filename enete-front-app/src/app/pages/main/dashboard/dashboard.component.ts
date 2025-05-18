import { Component } from '@angular/core';
import { BreadcrumbsComponent } from '../main-layout/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-dashboard',
  imports: [BreadcrumbsComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  
}
