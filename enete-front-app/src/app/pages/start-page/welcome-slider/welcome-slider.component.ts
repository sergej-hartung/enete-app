import { Component, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { isPlatformBrowser } from '@angular/common';

interface Slide {
  image: string;
  title: string;
  subtitle: string;
  button?: { text: string; link: string };
}

@Component({
  selector: 'app-welcome-slider',
  standalone: true,
  imports: [CommonModule, CarouselModule],
  templateUrl: './welcome-slider.component.html',
  styleUrl: './welcome-slider.component.scss'
})
export class WelcomeSliderComponent {
  private platformId = inject(PLATFORM_ID);
  isBrowser: boolean = isPlatformBrowser(this.platformId);

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

  welcomeCarouselOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    smartSpeed: 700,
    navText: ['<', '>'],
    autoplay: true,
    autoplayTimeout: 5000,
    autoplaySpeed: 700,
    autoplayHoverPause: true,
    items: 1,
    nav: true,
  };
}
