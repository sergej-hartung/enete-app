import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';

interface Speciality {
  title: string;
  delay: string;
}

@Component({
  selector: 'app-our-speciality',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './our-speciality.component.html',
  styleUrl: './our-speciality.component.scss',
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class OurSpecialityComponent implements AfterViewInit{
  private platformId = inject(PLATFORM_ID);
  isBrowser: boolean = isPlatformBrowser(this.platformId);

  specialities: Speciality[] = [
    { title: 'Individuelle Produktanpassung an Kundenwünsche', delay: '.1s' },
    { title: 'Bessere Leistungen zu günstigeren Preisen', delay: '.2s' },
    { title: 'Verwaltung und Betreuung', delay: '.3s' },
    { title: 'Ein kompetenter Ansprechpartner', delay: '.4s' },
    { title: 'Vertragsmanager + Berater', delay: '.5s' },
    { title: 'Zeitersparnis', delay: '.6s' },
    { title: 'Sicherheit und Garantie', delay: '.7s' },
    { title: 'Seit 2008 auf dem Markt', delay: '.8s' },
  ];

  ngAfterViewInit(): void {
    // if (this.isBrowser) {
    //   // Initialisiere Stellar.js für Parallax-Effekt
    //   const $ = (window as any).jQuery;
    //   if ($) {
    //     $(window).stellar();
    //   } else {
    //     console.warn('jQuery oder Stellar.js nicht geladen');
    //   }
    // }
  }
}
