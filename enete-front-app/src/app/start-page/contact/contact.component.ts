import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  private platformId = inject(PLATFORM_ID);
  isBrowser: boolean = isPlatformBrowser(this.platformId);

  contactForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    subject: new FormControl('', [Validators.required]),
    number: new FormControl('', [Validators.pattern(/^\+?\d+$/)]),
    message: new FormControl('', [Validators.required]),
  });

  constructor(private http: HttpClient) {}

  onContactSubmit(): void {
    // if (this.contactForm.invalid) return;
    // this.http.post('https://enete.de/contacts', this.contactForm.value).subscribe({
    //   next: () => {
    //     alert('Nachricht gesendet!');
    //     this.contactForm.reset();
    //   },
    //   error: () => alert('Fehler beim Senden.'),
    // });
  }
}
