import { Component, inject, Input } from '@angular/core';
import { EnergyService, Offer } from '../service/energy-service.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { EnergyOfferModalComponent } from './energy-offer-modal/energy-offer-modal.component';

@Component({
  selector: 'app-energy-offer-creator',
  imports: [CommonModule, EnergyOfferModalComponent],
  templateUrl: './energy-offer-creator.component.html',
  styleUrl: './energy-offer-creator.component.scss'
})
export class EnergyOfferCreatorComponent {
  @Input() offers: Offer[] = []

  private sanitizer = inject(DomSanitizer);
  private energyService = inject(EnergyService);
  private modalService = inject(NgbModal);

  constructor() {}

  ngOnInit(): void {

  }

  getLogo(offer: Offer) {
    let logoHtml: any = ''
    if ('providerSVG' in offer && offer.providerSVG) {
      const rawSvg = offer.providerSVG;
      const cleaned = rawSvg
        .replace(/(width|height)\s*=\s*("[^"]*"|'[^']*')/gi, '') // Entfernt width und height (mit ' oder ")
        //.replace(/viewBox\s*=\s*("[^"]*"|'[^']*')/i, 'viewBox="0 200 652 300"') // Ersetzt viewBox (mit ' oder ")
        .replace(/enable-background\s*=\s*("[^"]*"|'[^']*')/g, ''); // Entfernt enable-background
      // console.log('Cleaned SVG:', cleaned);
      logoHtml = this.sanitizer.bypassSecurityTrustHtml(cleaned);
    }
    return logoHtml
  }

  deleteOffer(offer:Offer) {
    this.energyService.deleteOffer(offer)
  }


  openOfferModal() {
     this.modalService.open(EnergyOfferModalComponent, { modalDialogClass: 'energie-offer-modal modal-xl' })
  }
}
