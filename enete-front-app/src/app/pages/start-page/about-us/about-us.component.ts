import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

interface AboutSection {
  title: string;
  content: string;
}

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss',
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
    trigger('fadeInRight', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
    ]),
  ],
})
export class AboutUsComponent {
  aboutSections: AboutSection[] = [
    {
      title: 'Philosophie',
      content: '<strong>"Network für alle"</strong><br>Jedem Menschen die Chance geben und auf dem Weg zum Erfolg und Glück zu helfen.',
    },
    {
      title: 'Vision',
      content: '<strong>"Europas Marktführer im Network-Marketing"</strong><br>Die Nummer eins im Bereich Energie & Telekommunikation.',
    },
    {
      title: 'Positionierung',
      content: '<strong>"Innovativer und einzigartiger Spezialist für Network-Marketing"</strong>',
    },
  ];

  imageUrl: string = 'public/img/start-page-img/bg-pattern/about-us.jpg';
}
