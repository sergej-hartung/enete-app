import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

interface Feature {
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-special-features',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './special-features.component.html',
  styleUrl: './special-features.component.scss',
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class SpecialFeaturesComponent {
  features: Feature[] = [
    { title: 'Strom', description: 'Wir vermitteln faire und günstige Preise für Privat- und Gewerbekunden.', icon: 'lightbulb' },
    { title: 'Gas', description: 'Wir arbeiten nur mit seriösen und von uns geprüften Anbietern deutschlandweit.', icon: 'lifesaver' },
    { title: 'Internet & Phone', description: 'Wir suchen die besten Angebote aus einer Vielzahl von DSL-Tarifen für Sie raus.', icon: 'laptop' },
    { title: 'Mobilfunk', description: 'Zahlreiche Anbieter und monatliche Aktionen mit den neusten Smartphones.', icon: 'mobile' },
  ];
}
