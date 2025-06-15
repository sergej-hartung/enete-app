import { EventEmitter, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Navigation {
  id: number;
  icon: string;
  name: string;
  descript?: string;
  children?: Navigation[];
  sequence: number;
  src: string;
}

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  public MobileMenuToggle: EventEmitter<any> = new EventEmitter()

  NAV: Navigation[] = [
    { id: 1, icon: "fas fa-home", name: "Home", sequence: 1, src: "/main/dashboard" },
    {
      id: 2, icon: "fas fa-shopping-cart", name: "Produkte", sequence: 2, src: "/main/products", children: [
        { id: 10, icon: "fas fa-bolt", name: "Energie", descript: "Tarifrechner für Strom- und Gastarife", sequence: 1, src: "/main/products/energy" },
        { id: 11, icon: "fas fa-globe", name: "Internet & Festnetz", descript: "Telefon und Internet - DSL | Kabel | LTE", sequence: 2, src: "/main/products/internet" },
        { id: 12, icon: "fas fa-external-link-alt", name: "Zusatzprodukte", descript: "Reiseportal | Insel Rügen", sequence: 3, src: "/main/products/additional-products" },
        { id: 12, icon: "fas fa-mobile-alt", name: "Mobilfunk", descript: "Mobilfunktarife und Hardware-Deals", sequence: 4, src: "/main/products/cellular-tariffs" },
      ]
    },
    { id: 3, icon: "fas fa-user-friends", name: "Kundenportal", sequence: 3, src: "/main/customer-portal" },
    { id: 4, icon: "fas fa-sign-in-alt", name: "Vertriebsportal", sequence: 4, src: "/main/vertriebsportal" },
    { id: 5, icon: "fas fa-gift", name: "Incentives", sequence: 5, src: "/main/incentives" },
    { id: 6, icon: "fas fa-bookmark", name: "Bildung", sequence: 6, src: "/main/bildung" },
    { id: 7, icon: "fas fa-user-plus", name: "Vision Club", sequence: 7, src: "/main/vision-club" },
    { id: 8, icon: "fas fa-camera", name: "Galerie", sequence: 8, src: "/main/galerie" },
    { id: 9, icon: "fas fa-credit-card", name: "Abrechnungen", sequence: 9, src: "/main/abrechnungen" }
  ]


  //constructor(private http: HttpClient) { }


  getNavigation(): Observable<any> {
    //return this.http.get<any>(`${BASE_URL}/api/navigation`)

    // for Test
    const nav = of(this.NAV)
    return nav
  }
}
