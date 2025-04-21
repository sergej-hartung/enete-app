import { Component, HostListener, ElementRef, ViewChildren, QueryList, inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgbModal, NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { animate, style, transition, trigger } from '@angular/animations';
import { GoogleMapsModule } from '@angular/google-maps';

import { LoginModalComponent } from './login-modal/login-modal.component';

import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'; // Import für Web Components

// Swiper-Imports für Swiper Element
import { register } from 'swiper/element/bundle';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { AuthService } from '../core/service/auth.service';

interface Slide {
  image: string;
  title: string;
  subtitle: string;
  button?: { text: string; link: string };
}

interface Fact {
  number: number;
  suffix: string;
  title: string;
}

interface Feature {
  title: string;
  description: string;
}

@Component({
  selector: 'app-start-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    GoogleMapsModule,
    NgbCollapse,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Hinzufügen für Web Components
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.scss'],
  animations: [
    trigger('countUp', [
      transition(':increment', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('1s ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class StartPageComponent implements AfterViewInit {
  @ViewChildren('factElement') factElements!: QueryList<ElementRef>;
  @ViewChildren('animatedElement') animatedElements!: QueryList<ElementRef>;

  isSticky = false;
  isLoggedIn = false;
  isMenuOpen = false;
  private platformId = inject(PLATFORM_ID);
  isBrowser: boolean;

  slides: Slide[] = [
    {
      image: 'public/img/start-page-img/bg-pattern/bg-3.jpg',
      title: '<span class="slider-title-span">WIR SIND</span> ENETE',
      subtitle: 'Vertrieb für Energie und Telekommunikation.',
    },
    {
      image: 'public/img/start-page-img/bg-pattern/bg-4.jpg',
      title: 'WIR LIEBEN <span class="slider-title-span">TEAMWORK</span>',
      subtitle: 'Unser modernes und faires Konzept bietet auch Ihnen die Möglichkeit in unser Vertriebssystem einzusteigen.',
    },
    {
      image: 'public/img/start-page-img/bg-pattern/bg-5.jpg',
      title: 'ENERGIELÖSUNGEN FÜR <span class="slider-title-span">UNTERNEHMEN</span>',
      subtitle: 'Profitieren Sie exklusiv von unseren Lösungen für Unternehmen. Informationen für Unternehmer auf www.enete-energie.de.',
      button: { text: 'Besuchen', link: 'https://enete-energie.de' },
    },
  ];

  contactForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    subject: new FormControl('', [Validators.required]),
    number: new FormControl('', [Validators.pattern(/^\+?\d+$/)]),
    message: new FormControl('', [Validators.required]),
  });

  facts: Fact[] = [
    { number: 10, suffix: '+', title: 'Jahre Erfahrung und Kompetenz' },
    { number: 50, suffix: '+', title: 'Über 50 Anbieter' },
    { number: 3000, suffix: '+', title: 'Entschlossene und ehrgeizige Vertriebspartner' },
    { number: 25000, suffix: '+', title: 'Zufriedene Kunden' },
    { number: 70000, suffix: '+', title: 'Optimierte Verträge' },
  ];

  counters: number[] = this.facts.map(() => 0);
  animatedStates: string[] = [];

  mapCenter: google.maps.LatLngLiteral = { lat: 52.986375, lng: 8.616036 };
  mapZoom = 15;

  features: Feature[] = [
    { title: 'Energie', description: 'Optimierte Energielösungen für Privat und Unternehmen.' },
    { title: 'Telekommunikation', description: 'Moderne Kommunikationslösungen für alle.' },
    { title: 'Network-Marketing', description: 'Einzigartiges Konzept für Vertriebspartner.' },
    { title: 'Support', description: 'Rundum Betreuung und Unterstützung.' },
  ];

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isSticky = window.scrollY > 50;
    }
  }

  constructor(
    private modalService: NgbModal,
    private authService: AuthService,
    private http: HttpClient
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return; // Nur im Browser ausführen

    // Swiper Element nur im Browser registrieren
    register();

    // Swiper Element initialisieren
    const swiperEl = document.querySelector('swiper-container');
    if (swiperEl) {
      const swiperParams = {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        injectStyles: [
          `
            .swiper-button-prev,
            .swiper-button-next {
              color: #fff;
              background: rgba(0, 0, 0, 0.5);
              width: 50px;
              height: 50px;
              border-radius: 50%;
              transition: background 0.3s;
            }
            .swiper-button-prev:hover,
            .swiper-button-next:hover {
              background: rgba(0, 0, 0, 0.8);
            }
            .swiper-button-prev {
              left: 20px;
            }
            .swiper-button-next {
              right: 20px;
            }
            .swiper-button-prev::after,
            .swiper-button-next::after {
              font-size: 20px;
            }
            .swiper-pagination {
              bottom: 20px;
            }
            .swiper-pagination-bullet {
              background: #fff;
              opacity: 0.7;
              width: 10px;
              height: 10px;
            }
            .swiper-pagination-bullet-active {
              background: #7d1120;
              opacity: 1;
            }
          `,
        ],
      };
      Object.assign(swiperEl, swiperParams);
      (swiperEl as any).initialize();
    }

    // Counter-Animation
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = this.factElements.toArray().indexOf(entry.target as any);
            this.animateCounter(index);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    this.factElements.forEach((element) => observer.observe(element.nativeElement));

    // Fade-In-Animation für About und Features
    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = this.animatedElements.toArray().indexOf(entry.target as any);
            this.animatedStates[index] = 'visible';
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    // Initialisiere animatedStates basierend auf der Anzahl der animierten Elemente
    this.animatedElements.forEach((element, index) => {
      this.animatedStates[index] = 'hidden';
      fadeObserver.observe(element.nativeElement);
    });
  }

  animateCounter(index: number): void {
    const target = this.facts[index].number;
    const step = target / 50;
    let current = 0;

    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        this.counters[index] = target;
        clearInterval(interval);
      } else {
        this.counters[index] = Math.ceil(current);
      }
    }, 20);
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  openLoginModal(): void {
    this.modalService.open(LoginModalComponent).result.then(
      (result) => {
        if (result) {
          this.isLoggedIn = true;
        }
      },
      () => {}
    );
  }

  goToDashboard(): void {
    // Navigiere zum Dashboard (Platzhalter)
  }

  onContactSubmit(): void {
    if (this.contactForm.invalid) return;

    this.http.post('https://enete.de/contacts', this.contactForm.value).subscribe({
      next: () => {
        alert('Nachricht gesendet!');
        this.contactForm.reset();
      },
      error: () => alert('Fehler beim Senden.'),
    });
  }

  openImpressum(): void {
   // this.modalService.open(ImpressumModalComponent);
  }

  openDatenschutz(): void {
    //this.modalService.open(DatenschutzModalComponent);
  }
}
