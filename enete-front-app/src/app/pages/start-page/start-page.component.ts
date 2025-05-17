import { Component} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { WelcomeSliderComponent } from './welcome-slider/welcome-slider.component';
import { SpecialFeaturesComponent } from './special-features/special-features.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { CoolFactsComponent } from './cool-facts/cool-facts.component';
import { OurSpecialityComponent } from './our-speciality/our-speciality.component';
import { TestimonialComponent } from './testimonial/testimonial.component';
import { ContactComponent } from './contact/contact.component';
import { ShopInShopComponent } from './shop-in-shop/shop-in-shop.component';
import { CallToActionComponent } from './call-to-action/call-to-action.component';
import { FooterComponent } from './footer/footer.component';



@Component({
  selector: 'app-start-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    HeaderComponent,
    WelcomeSliderComponent,
    SpecialFeaturesComponent,
    AboutUsComponent,
    CoolFactsComponent,
    OurSpecialityComponent,
    TestimonialComponent,
    ContactComponent,
    ShopInShopComponent,
    CallToActionComponent,
    FooterComponent
  ],
  templateUrl: './start-page.component.html',
  styleUrl: './start-page.component.scss'
})
export class StartPageComponent  {
 
}
