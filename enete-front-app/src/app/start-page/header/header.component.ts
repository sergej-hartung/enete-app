import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgbModal, NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { AuthService } from '../../core/service/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, NgbCollapse],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isSticky = false;
  isLoggedIn = false;
  isMenuOpen = false;
  activeSection: string = 'home';

  private sectionObserver: IntersectionObserver | null = null;

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    this.isSticky = window.scrollY > 50;
  }

  constructor(private modalService: NgbModal, private authService: AuthService) {
    this.isLoggedIn = this.authService.isAuthenticated();
  }

  ngAfterViewInit(): void {
    //if (!this.isBrowser) return; // Nur im Browser ausführen
    this.setupSectionObserver();
  }

  private setupSectionObserver(): void {
    const sections = document.querySelectorAll('section[id], div[id]');
    const options = {
      root: null, // Viewport als Root
      threshold: 0.3, // 30% des Abschnitts müssen sichtbar sein
    };

    this.sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Setze den aktiven Abschnitt basierend auf der ID
          console.log(entry.target.id)
          if(entry.target.id == 'sticky-sticky-wrapper'){
            this.activeSection = 'home'
          }else{
            this.activeSection = entry.target.id;
          }

          
          console.log(this.activeSection)
        }
      });
    }, options);

    sections.forEach((section) => {
      this.sectionObserver!.observe(section);
    });
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

}
