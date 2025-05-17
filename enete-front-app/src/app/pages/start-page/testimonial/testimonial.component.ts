import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';

interface Testimonial {
  image: string;
  text: string;
  name: string;
  details: string;
}

@Component({
  selector: 'app-testimonial',
  standalone: true,
  imports: [CommonModule, CarouselModule],
  templateUrl: './testimonial.component.html',
  styleUrl: './testimonial.component.scss'
})
export class TestimonialComponent {
  private platformId = inject(PLATFORM_ID);
  isBrowser: boolean = isPlatformBrowser(this.platformId);

  testimonials: Testimonial[] = [
    {
      image: 'public/img/start-page-img/advisor-img/tes-1.jpg',
      text: 'Fantastisch – nie mehr Kündigungstermine verpassen. Funktioniert einfach und einwandfrei.',
      name: 'ERK VERONIKA',
      details: '26 JAHRE AUS OSNABRÜCK',
    },
    {
      image: 'public/img/start-page-img/advisor-img/tes-2.jpg',
      text: 'Durch die Vertragsoptimierung spare ich monatlich 30 Euro. Meine Kündigung aus dem Kündigungsautomat wurde mir schon in kürzester Zeit vom Anbieter bestätigt.',
      name: 'HERDT ILONA',
      details: '26 JAHRE AUS KEMPTEN',
    },
    {
      image: 'public/img/start-page-img/advisor-img/tes-3.jpg',
      text: 'Ich habe schon immer günstige Angebote gesucht. Allerdings gab es oft Probleme und ich war auf mich alleine gestellt. Seit 2013 bin ich enete-Kunde und habe sogar einen persönlichen Berater. Das kostet mich keine Cent. Weiter so!',
      name: 'MISIBAEVA ELLORA',
      details: '56 JAHRE AUS BELM',
    },
  ];

  testimonialCarouselOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    smartSpeed: 700,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplaySpeed: 700,
    autoplayHoverPause: true,
    items: 1,
    nav: false,
  };
}
