import { Component, HostListener, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgbModal, NgbCollapse, NgbModalModule, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { AuthService } from '../../core/service/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, NgbCollapse, NgbModalModule, LoginModalComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isSticky = false;
  isLoggedIn = false;
  isMenuOpen = false;
  activeSection: string = 'home';

  closeResult: WritableSignal<string> = signal('');

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

  // openLoginModal(): void {
  //   this.modalService.open(LoginModalComponent).result.then(
  //     (result) => {
  //       if (result) {
  //         this.isLoggedIn = true;
  //       }
  //     },
  //     () => {}
  //   );
  // }
  openLoginModal(): void {
    this.modalService.open(LoginModalComponent, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
				this.closeResult.set(`Closed with: ${result}`);
			},
			(reason) => {
				this.closeResult.set(`Dismissed ${this.getDismissReason(reason)}`);
			},
		);
  }

  // openLoginModal(): void {
  //   console.log('Öffne Modal mit NgbModal');
  //   // Setze inert auf den Hauptinhalt
  //   document.querySelector('app-root')?.setAttribute('inert', '');
  //   const modalRef = this.modalService.open(LoginModalComponent, {
  //     ariaLabelledBy: 'login-modal-title',
  //     centered: true
  //   });
  
  //   modalRef.result.then(
  //     (result) => {
  //       console.log(`Modal geschlossen mit: ${result}`);
  //       document.querySelector('app-root')?.removeAttribute('inert');
  //       if (result) {
  //         this.isLoggedIn = true;
  //       }
  //     },
  //     (reason) => {
  //       console.log(`Modal verworfen mit: ${reason}`);
  //       document.querySelector('app-root')?.removeAttribute('inert');
  //     }
  //   );
  // }

  private getDismissReason(reason: any): string {
		switch (reason) {
			case ModalDismissReasons.ESC:
				return 'by pressing ESC';
			// case ModalDismissReasons.BACKDROP_CLICK:
			// 	return 'by clicking on a backdrop';
			default:
				return `with: ${reason}`;
		}
	}

  goToDashboard(): void {
    // Navigiere zum Dashboard (Platzhalter)
  }

}
