import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';


interface ListItem {
  text: string;
}

@Component({
  selector: 'app-shop-in-shop',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shop-in-shop.component.html',
  styleUrl: './shop-in-shop.component.scss'
})
export class ShopInShopComponent {

  imageUrl = 'public/img/start-page-img/bg-pattern/shop-in-shop.jpg';
  partnerRequirements: ListItem[] = [
    { text: 'Kunden begeistern können' },
    { text: 'lieber beim Kunden als im Büro sitzen' },
    { text: 'fleißig sind und professionell arbeiten' },
  ];
  advantages: ListItem[] = [
    { text: 'Kompetente Betreuung durch das Backoffice' },
    { text: 'Interessante Bonis und Incentives' },
    { text: 'Attraktive Provisionen' },
    { text: 'Modernes Vertriebspartnerportal' },
    { text: 'Zuverlässige Zahlung Ihrer Provision' },
    { text: 'Persönlichkeitsentwicklung' },
  ];
}
