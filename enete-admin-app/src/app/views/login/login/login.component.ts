import { Component } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  adminUp = false
  cmsDown = false
  username: string = ''; // Добавлено для хранения имени пользователя
  password: string = ''; // Добавлено для хранения пароля

  constructor(private authService: AuthService, private router: Router){

  }

  validate() {
    this.adminUp = true;
    this.cmsDown = true;
    console.log(this.username)
    console.log(this.password)
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        console.log('Успешный вход', response);
        // Редирект или действия после успешного входа
        this.router.navigate(['/partner']); // Пример редиректа на страницу администратора
      },
      error: (error) => {
        console.error('Ошибка аутентификации', error);
        // Обработка ошибок аутентификации
      }
    }); 
  }


}
