import { Component } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  adminUp = false
  cmsDown = false

  validate() {
    this.adminUp = true;
    this.cmsDown = true;
    
    //setTimeout(() => this.adminUp = false, 100); // Will add 'hide' class after 100ms
    //setTimeout(() => this.cmsDown = false, 150); 
  }

}
