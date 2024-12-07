import { Component } from '@angular/core';
import { MainNavbarService } from '../../../../services/main-navbar.service';
import { TariffGroupService } from '../../../../services/product/tariff/tariff-group.service';
import { TariffService } from '../../../../services/product/tariff/tariff.service';
import { NotificationService } from '../../../../services/notification.service';
import { ProductService } from '../../../../services/product/product.service';
import { FormService } from '../../../../services/form.service';
import { PreloaderService } from '../../../../services/preloader.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Tariff } from '../../../../models/tariff/tariff';
import { Subject, takeUntil } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface AttributeCollapseState {
  attributeGroupId: number;
  attributeId: number;
  attributeIndex: number;
  isCollapsed: boolean;
}

interface PromoCollapseState {
  promoId: number | null;
  isCollapsed: boolean;
}

@Component({
  selector: 'app-tariff-details',
  templateUrl: './tariff-details.component.html',
  styleUrl: './tariff-details.component.scss'
})
export class TariffDetailsComponent {

  isAnimating = false;

  tariff: Tariff | null = null
  tariffAttributeCollapsed: boolean = false
  tariffMatrixCollapsed: boolean = false
  tariffPromoCollapsed: boolean = false
  tariffCharacteristicsCollapsed: boolean = false
  tariffNoteCollapsed: boolean = true
  collapseStates: AttributeCollapseState[] = []
  collapsePromoStates: PromoCollapseState[] = []

  private unsubscribe$ = new Subject<void>();

  constructor(
    // private mainNavbarService: MainNavbarService,
    // public tariffGroupService: TariffGroupService,
    public tariffService: TariffService,
    private sanitizer: DomSanitizer,
    // private notificationService: NotificationService,
    // private productService: ProductService,
    // private formService: FormService,
    // private preloaderService: PreloaderService,
    // private snackBar: MatSnackBar
  ) {}


  ngOnInit(): void {
    this.tariffService.detailedData$
      .pipe(takeUntil(this.unsubscribe$))
        .subscribe(response => {
          console.log(response)
          if(response && response?.data && response.entityType == 'Tariff' && (response.requestType == "get" || response.requestType == "patch")){
            this.tariff = response.data

            // Инициализация collapseStates для каждого атрибута, который соответствует условиям
            if (this.tariff && this.tariff?.attribute_groups) {
              this.collapseStates = [];
              this.tariff.attribute_groups.forEach((group, groupIndex) => {
                group.attributs.forEach((attribute, attributeIndex) => {
                  if (attribute?.input_type === 'Textbereich' && attribute?.pivot?.value_text) {
                    this.collapseStates.push({
                      attributeGroupId: group.id,
                      attributeId: attribute.id,
                      attributeIndex: attributeIndex,
                      isCollapsed: true
                    });
                  }
                });
              });
            }

            if(this.tariff && this.tariff?.promos){
              this.collapsePromoStates = [];
              this.tariff.promos.forEach((promo, promoIndex) => {
                if(promo?.end_date && this.isPromoExpired(promo?.end_date)){
                  this.collapsePromoStates.push({
                    promoId: promo.id,
                    isCollapsed: true
                  })
                }else{
                  this.collapsePromoStates.push({
                    promoId: promo.id,
                    isCollapsed: false
                  })
                }
              })
            }
          }
        })
  }

  toggleCollapse(attributeGroupId: number, attributeId: number, attributeIndex: number): void {
    const state = this.collapseStates.find(
      collapseState => collapseState.attributeGroupId === attributeGroupId && 
                       collapseState.attributeId === attributeId &&
                       collapseState.attributeIndex === attributeIndex
    );

    if (state) {
      requestAnimationFrame(() => {
        state.isCollapsed = !state.isCollapsed;
      });
    }
  }

  togglePromoCollapse(promoId: number | null): void {
    const state = this.collapsePromoStates.find(promoState => promoState.promoId === promoId );
    console.log(state)
    if (state) {
      requestAnimationFrame(() => {
        state.isCollapsed = !state.isCollapsed;
      });
    }
  }

  // Метод для проверки, свернут ли атрибут
  isAttributeCollapsed(attributeGroupId: number, attributeId: number, attributeIndex: number): boolean {
    const state = this.collapseStates.find(
      collapseState => collapseState.attributeGroupId === attributeGroupId &&
                       collapseState.attributeId === attributeId &&
                       collapseState.attributeIndex === attributeIndex
    );
    return state ? state.isCollapsed : true; // если не найдено состояние, по умолчанию возвращаем true
  }

  isPromoCollapsed(promoId: number | null): boolean {
    const state = this.collapsePromoStates.find(promoState => promoState.promoId == promoId)
    return state ? state.isCollapsed : true;
  }

  getSafeHtml(html: string | null): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html || '');
  }

  toggleCollapseTariffAttribute(){
    this.tariffAttributeCollapsed = !this.tariffAttributeCollapsed
  }

  toggleCollapseTariffMatrix(){
    this.tariffMatrixCollapsed = !this.tariffMatrixCollapsed
  }

  toggleCollapseTariffPromo(){
    this.tariffPromoCollapsed = !this.tariffPromoCollapsed
  }

  toggleCollapseTariffCharacteristics(){
    this.tariffCharacteristicsCollapsed = !this.tariffCharacteristicsCollapsed
  }

  toogleTariffNote(){
    this.tariffNoteCollapsed = !this.tariffNoteCollapsed
  }

  isNumeric(value: any): boolean {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  isPromoExpired(endDate: string): boolean {
    const currentDate = new Date();
    const promoEndDate = new Date(endDate);

    return promoEndDate.setHours(0, 0, 0, 0) < currentDate.setHours(0, 0, 0, 0);
  }


  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
