import { Component } from '@angular/core';
import { TariffService } from '../../../../../services/product/tariff/tariff.service';
import { Subject, takeUntil } from 'rxjs';
import { Promo, Tariff, TariffDetail } from '../../../../../models/tariff/tariff';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
import { ProductDocumentService } from '../../../../../services/product/product-document.service';
import { ProductService } from '../../../../../services/product/product.service';

interface CollapseState {
  isCollapseTariffDetails: boolean;
  isCollapseTariffPromo: boolean;
  isCollapseTariffCommission: boolean;
}

@Component({
  selector: 'app-tariff-view',
  templateUrl: './tariff-view.component.html',
  styleUrl: './tariff-view.component.scss'
})
export class TariffViewComponent {
  active = 1;

  tariff: Tariff | null = null

  logoNetworkOperatorContent: SafeResourceUrl | null = null;
  logoProviderContent: SafeResourceUrl | null = null;


  collapseStates: CollapseState = {
    isCollapseTariffDetails: false,
    isCollapseTariffPromo: false,
    isCollapseTariffCommission: false
  }

  private unsubscribe$ = new Subject<void>();

  constructor(
    public tariffService: TariffService,
    private sanitizer: DomSanitizer,
    private productDocumentService: ProductDocumentService,

    private productService: ProductService,

  ) {}

  ngOnInit() { 
    
    this.productService.tariffId$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(response => {
        if(!response){
          this.resetState()
        }
        console.log(response)
      })

    this.tariffService.detailedData$
      .pipe(takeUntil(this.unsubscribe$))
        .subscribe(response => {
          console.log(response)
          if(response && response?.data && response.entityType == 'Tariff' && (response.requestType == "get" || response.requestType == "patch")){
            this.tariff = response.data
            if(this.tariff?.network_operator?.logo_id){
              this.getLogoNetworkOperator(this.tariff.network_operator.logo_id)
            }
            if(this.tariff?.provider?.logo_id){
              this.getLogoProvider(this.tariff.provider.logo_id)
            }
          }
        })
    
  } 


  get tariffDetails(): TariffDetail[]{
    return this.tariff?.tariffdetails ? this.tariff.tariffdetails : []
  }

  get promos(): Promo[]{
    return this.tariff?.promos ? this.tariff.promos : []
  }

  get tariffTpls(){
    return this.tariff?.tpl ? this.tariff?.tpl : []
  }

  resetState(){
    this.tariff = null
    this.logoNetworkOperatorContent = null
    this.logoProviderContent = null
    this.collapseStates = {
      isCollapseTariffCommission: false,
      isCollapseTariffDetails: false,
      isCollapseTariffPromo: false
    }
  }

  getSafeHtml(html: string | null): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html || '');
  }

  // isNumeric(value: any): boolean {
  //   return !isNaN(parseFloat(value)) && isFinite(value);
  // }

  

  getLogoNetworkOperator(id:number){
    this.productDocumentService.getFileContentById(id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(content => {
        const url = window.URL.createObjectURL(content);
        this.logoNetworkOperatorContent = this.sanitizer.bypassSecurityTrustResourceUrl(url+'#view=FitH');
      });
  }

  getLogoProvider(id:number){
    this.productDocumentService.getFileContentById(id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(content => {
        const url = window.URL.createObjectURL(content);
        this.logoProviderContent = this.sanitizer.bypassSecurityTrustResourceUrl(url+'#view=FitH');
      });
  }


  toggleCollapse(collapseAtr: string){
    if(collapseAtr === 'TariffDetails'){
      this.collapseStates.isCollapseTariffDetails = !this.collapseStates.isCollapseTariffDetails
      this.collapseStates.isCollapseTariffPromo = false
      this.collapseStates.isCollapseTariffCommission = false
    }
    if(collapseAtr === 'TariffPromo'){
      this.collapseStates.isCollapseTariffDetails = false
      this.collapseStates.isCollapseTariffPromo = !this.collapseStates.isCollapseTariffPromo
      this.collapseStates.isCollapseTariffCommission = false
    }
    if(collapseAtr === 'TariffCommission'){
      this.collapseStates.isCollapseTariffDetails = false
      this.collapseStates.isCollapseTariffPromo = false
      this.collapseStates.isCollapseTariffCommission = !this.collapseStates.isCollapseTariffCommission
    }
  }

  // resetCollapseStates(){
  //   this.
  // }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
