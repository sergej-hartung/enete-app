import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/service/auth.service';


@Component({
  selector: 'app-login-modal',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.scss'
})
export class LoginModalComponent {
  loginForm: FormGroup;
  twoFactorForm: FormGroup;
  showTwoFactor = false;
  errorMessage: string | null = null;


  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    public activeModal: NgbActiveModal,
    private router: Router
  ) {
    console.log('NgbActiveModal injiziert:', this.activeModal);
    // Login-Formular initialisieren
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // 2FA-Formular initialisieren
    this.twoFactorForm = this.fb.group({
      twoFactorCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      this.authService.login(username, password).subscribe({
        next: (response) => {
          console.log(response)
          if (this.activeModal) {
            this.activeModal.dismiss('Modal geschlossen');
            this.router.navigate(['main/dashboard']);
          } 
        },
        error: (err) => {
          this.errorMessage = 'Anmeldung fehlgeschlagen. Bitte überprüfe deine Eingaben.';
        }
      })
      // this.authService.login(username, password).subscribe({
      //   next: (response) => {
      //     if (response.twoFactorRequired) {
      //       this.showTwoFactor = true; // Zeige 2FA-Eingabe
      //       this.errorMessage = null;
      //     } else {
      //       // Erfolgreiche Anmeldung ohne 2FA
      //       alert('Anmeldung erfolgreich!');
      //     }
      //   },
      //   error: (err) => {
      //     this.errorMessage = 'Anmeldung fehlgeschlagen. Bitte überprüfe deine Eingaben.';
      //   }
      // });
    }

    // funktion für zweifaktor identifizirung
    //this.showTwoFactor = true
  }

  // 2FA-Bestätigung
  onTwoFactorSubmit() {
    // if (this.twoFactorForm.valid) {
    //   const { twoFactorCode } = this.twoFactorForm.value;
    //   this.authService.verifyTwoFactorCode(twoFactorCode).subscribe({
    //     next: () => {
    //       alert('2FA erfolgreich! Anmeldung abgeschlossen.');
    //       this.showTwoFactor = false;
    //     },
    //     error: (err) => {
    //       this.errorMessage = 'Ungültiger 2FA-Code. Bitte versuche es erneut.';
    //     }
    //   });
    // }
  }
  closeModal() {
    if (this.activeModal) {
      this.activeModal.dismiss('Modal geschlossen');
    } 
    
  }

  ngOnDestroy() {
    console.log('destroy')
    this.loginForm.reset();
    this.twoFactorForm.reset();
    this.showTwoFactor = false;
    this.errorMessage = null;
  }
}