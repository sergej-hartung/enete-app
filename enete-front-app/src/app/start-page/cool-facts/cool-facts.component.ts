import { Component, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';

interface Fact {
  number: number;
  suffix: string;
  title: string;
}

@Component({
  selector: 'app-cool-facts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cool-facts.component.html',
  styleUrl: './cool-facts.component.scss'
})
export class CoolFactsComponent implements AfterViewInit {
  @ViewChildren('factElement') factElements!: QueryList<ElementRef>;
  private platformId = inject(PLATFORM_ID);
  isBrowser: boolean = isPlatformBrowser(this.platformId);

  facts: Fact[] = [
    { number: 15, suffix: '+', title: 'Jahre Erfahrung und Kompetenz' },
    { number: 50, suffix: '+', title: 'Über 50 Anbieter' },
    { number: 4500, suffix: '+', title: 'Entschlossene und ehrgeizige Vertriebspartner' },
    { number: 35000, suffix: '+', title: 'Zufriedene Kunden' },
    { number: 100000, suffix: '+', title: 'Optimierte Verträge' },
  ];

  counters: number[] = this.facts.map(() => 0);

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    if (!this.facts || this.facts.length === 0) {
      console.error('Facts array is empty or undefined');
      return;
    }

    setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const index = parseInt((entry.target as HTMLElement).dataset["factIndex"] || '-1', 10);
              this.animateCounter(index);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );
  
      this.factElements.forEach((element, i) => {
        observer.observe(element.nativeElement);
      });
    }, 0);
  }

  animateCounter(index: number): void {
    if (index < 0 || index >= this.facts.length) {
      return;
    }

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
}
