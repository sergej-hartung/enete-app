import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormService } from '../../../../services/form.service';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Attribute } from '../../../../models/tariff/attribute/attribute';
import { combineLatest, debounceTime, Subject, takeUntil } from 'rxjs';
import { CalcMatrix, calcMatrixAttr, Tariff, Template } from '../../../../models/tariff/tariff';
import { AttributeGroup } from '../../../../models/tariff/attributeGroup/attributeGroup';
import { IfStmt } from '@angular/compiler';
import { ProductService } from '../../../../services/product/product.service';
import { MainNavbarService } from '../../../../services/main-navbar.service';
import { TariffService } from '../../../../services/product/tariff/tariff.service';
import { PreloaderService } from '../../../../services/preloader.service';
import { exit } from 'node:process';
import { ObjectDiffService } from '../../../../services/object-diff.service';
import { error } from 'node:console';

// interface ChangeResult {
//   updated: any;
//   added: any;
//   deleted: any;
// }

@Component({
  selector: 'app-tariff-add-edit',
  templateUrl: './tariff-add-edit.component.html',
  styleUrls: ['./tariff-add-edit.component.scss']
})
export class TariffAddEditComponent  implements OnInit, OnDestroy {

  active = 1
  tariffForm: FormGroup
  mode: string | null = null
  private unsubscribe$ = new Subject<void>();

  tariffLoaded = false
  copyTariffValue: any = null

  // diffResult: { added: any[], deleted: any[], updated: any[] } | null = null;
  
  constructor(
    private formService: FormService,
    private tariffService: TariffService,
    private productService: ProductService,
    private mainNavbarService: MainNavbarService,
    private preloaderService: PreloaderService,
    private objectDiffService: ObjectDiffService
  ) {
    this.tariffForm = this.formService.getTariffForm()
  }

  ngOnInit() {
    this.productService.productMode$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(mode => {
        this.mode = mode
        this.initializeSubscriptions(this.mode)
        //if (mode === 'edit') this.loadAttributeGroups();
      });

      this.mainNavbarService.iconClicks$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(button => {
          if(button == 'save' && this.mode == 'new'){
            this.preloaderService.show('Creating')
            const value = this.tariffForm.value
            this.tariffService.addItem(value)
            // this.addOrEditProducts = true
            // this.productService.setProductMode(button)
          }
          if(button == 'save' && this.mode == 'edit'){
            
            const tariff = this.tariffForm.get('tariff')
            if(tariff){
              const tariffId = tariff.get('id')?.value
              if(tariffId){
                this.preloaderService.show('Updating')
                const changes = this.objectDiffService.getChanges(this.copyTariffValue, this.tariffForm.value)
                console.log(changes)
                this.tariffService.updateItem(tariffId, changes)
              }
            }
          }
        })

      

    // отслеживаем подгрузку тарифа и его элементов
    combineLatest([
      this.productService.loadedTarif$,
      this.productService.initTariffDataLoaded$
    ])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(([tariffLoadedState, initDataLoadedState]) => {

        const tariffsLoaded = this.productService.areAllTariffsLoaded();
        const initDataLoaded = this.productService.areAllInitTariffDataLoaded();
    
        if (tariffsLoaded && initDataLoaded) {
          if (this.mode === 'edit') {
            this.tariffLoaded = true;
            this.copyTariffValue = JSON.parse(JSON.stringify(this.tariffForm.value));
            // Отключаем прелоадер
            setTimeout(() => {
              this.preloaderService.hide();
            }, 1000)
            
          }
        }else if(initDataLoaded){
          if (this.mode === 'new') {
            // Отключаем прелоадер
            setTimeout(() => {
              this.preloaderService.hide();
            }, 1000)
          }
        }
      });
  }

  private initializeSubscriptions(mode: string | null){
    this.tariffForm.valueChanges
        .pipe(
          debounceTime(300),
          takeUntil(this.unsubscribe$)
        )
        .subscribe(() => {
          if(mode === 'new'){
            if(this.tariffForm.valid && this.tariffForm.touched){
              this.mainNavbarService.setIconState('save', true, false);
            }else{
              this.mainNavbarService.setIconState('save', true, true);
            }
          }
          if(mode === 'edit'){        
            if(this.tariffForm.valid && this.tariffLoaded){
              
              const changes = this.objectDiffService.getChanges(this.copyTariffValue, this.tariffForm.value)
              //console.log(changes)
              if(changes.added.length > 0 || changes.deleted.length > 0 || changes.updated.length > 0){
                this.mainNavbarService.setIconState('save', true, false);
                //console.log(this.objectDiffService.getChanges(this.copyTariffValue, this.tariffForm.value))
                //console.log(this.copyTariffValue)
              }else{
                this.mainNavbarService.setIconState('save', true, true);
              }
            }else{
              this.mainNavbarService.setIconState('save', true, true);
            }
          }
        });

        
  }





  ngOnDestroy() {
    this.formService.resetTariffForm();
    this.copyTariffValue = null
    this.productService.updateInitTariffDataLoaded('attributes', false);
    this.productService.updateInitTariffDataLoaded('categories', false);
    this.productService.updateInitTariffDataLoaded('connectionStatuses', false);
    this.productService.updateInitTariffDataLoaded('sortings', false);

    this.productService.updateTariffLoadedState('attributeGroup', false);
    this.productService.updateTariffLoadedState('calcMatrix', false);
    this.productService.updateTariffLoadedState('tariff', false);
    this.productService.updateTariffLoadedState('tariffDetails', false);
    this.productService.updateTariffLoadedState('promos', false);
    this.productService.updateTariffLoadedState('tpl', false);

    this.tariffLoaded = false
    // console.log(this.formService.getTariffForm())
    // console.log('test')
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
