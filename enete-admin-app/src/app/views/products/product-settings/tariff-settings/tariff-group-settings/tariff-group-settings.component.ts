import { Component } from '@angular/core';
import { Tablecolumn } from '../../../../../models/tablecolumn';
import { FilterOption } from '../../../../../shared/components/generic-table/generic-table.component';
import { TariffGroupService } from '../../../../../services/product/tariff/tariff-group.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MainNavbarService } from '../../../../../services/main-navbar.service';
import { Subject, takeUntil } from 'rxjs';
import { FormService } from '../../../../../services/form.service';
import { AbstractControl, FormGroup } from '@angular/forms';
import { ObjectDiffService } from '../../../../../services/object-diff.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PreloaderService } from '../../../../../services/preloader.service';

@Component({
  selector: 'app-tariff-group-settings',
  templateUrl: './tariff-group-settings.component.html',
  styleUrl: './tariff-group-settings.component.scss',
  animations: [
    trigger('slideIn', [
      state('void', style({ transform: 'translateX(100%)'})),
      state('*', style({ transform: 'translateX(0)'})),
      transition('void => *', [
        animate('300ms ease-out'),
      ]),
      transition('* => void', [
        animate('300ms ease-in', style({ transform: 'translateX(100%)'}))
      ])
    ]),
    // Animation für die linke Seite (Breitenwechsel)
    trigger('resizeLeft', [
      state('full', style({ width: '100%' })),
      state('partial', style({ width: '58.33%' })), // ca. 7 von 12 Spalten
      transition('full <=> partial', [
        animate('300ms ease-in-out')
      ])
    ]),
  ]
})
export class TariffGroupSettingsComponent {

  IsExpandable = false;

  groupEditOrNew = false

  groupColumns: Tablecolumn[] = [
    { key: 'id', title: '#', sortable: true },
    { key: 'name', title: 'Name', sortable: true }, 
    { key: 'icon', title: 'Icon', sortable: true, isIcon: true },
    { key: 'color', title: 'Farbe', sortable: true },
    { key: 'created_at', title: 'Erstellt am', sortable: true, isDate: true },
    { key: 'updated_at', title: 'Geändert am', sortable: true, isDate: true},
  ];

  filters: FilterOption[] = [
      { type: 'text', key: 'search', label: 'Search' }
    ];

  tariffGroupForm: FormGroup;


  private unsubscribe$ = new Subject<void>();
    
  selectedGroup: any = ''
  mode: any = ''
  
  constructor(
    public tariffGroupService: TariffGroupService,
    private mainNavbarService: MainNavbarService,
    private formService: FormService,
    private snackBar: MatSnackBar,
    private preloaderService: PreloaderService,
    ) {
      this.tariffGroupForm = this.formService.createTariffGroupFormGroup()
    }
  
    ngOnInit() {
      this.tariffGroupService.fetchData()
      this.mainNavbarService.setIconState('new', true, false);

      this.tariffGroupService.errors$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(errors => {
          console.log(errors)
          this.preloaderService.hide();
          this.snackBar.open('Speichern der Tarifgruppe fehlgeschlagen', '', {
            duration: 3000, // Уведомление исчезнет через 3 секунды
            horizontalPosition: 'right', // Позиция по горизонтали
            verticalPosition: 'bottom', // Позиция по вертикали
            panelClass: ['error-snackbar']
          });
        })

      this.tariffGroupService.detailedData$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(response => {
          if(response?.entityType == "tariffGroup" && response.requestType == "post"){
            this.tariffGroupService.fetchData()
            setTimeout(() => {
              this.preloaderService.hide();
              this.snackBar.open('Tarifgruppe wurde erfolgreich gespeichert!', '', {
                duration: 3000, // Уведомление исчезнет через 3 секунды
                horizontalPosition: 'right', // Позиция по горизонтали
                verticalPosition: 'bottom', // Позиция по вертикали
                panelClass: ['success-snackbar']
              });
            }, 1000)
          }
          if(response?.entityType == "tariffGroup" && response.requestType == "patch"){
            if(response.data){
              const value = response.data
              this.selectedGroup = {
                id: value?.id,
                name: value?.name,
                icon: value?.icon,
                color: value?.color
              }
            }
            setTimeout(() => {
              console.log(response)
              this.preloaderService.hide();
              this.snackBar.open('Tarifgruppe wurde erfolgreich geändert!', '', {
                duration: 3000, // Уведомление исчезнет через 3 секунды
                horizontalPosition: 'right', // Позиция по горизонтали
                verticalPosition: 'bottom', // Позиция по вертикали
                panelClass: ['success-snackbar']
              });
            }, 1000)
          }
        })


      this.tariffGroupForm.valueChanges
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(event => {
          if(this.tariffGroupForm.valid && this.mode == 'new'){
            this.mainNavbarService.setIconState('save', true, false);
          }
          if(this.tariffGroupForm.valid && this.mode == 'edit'){
            if(!this.areObjectsEqual(this.selectedGroup, this.tariffGroupForm.value)){
              this.mainNavbarService.setIconState('save', true, false);
            }else{
              this.mainNavbarService.setIconState('save', true, true);
            }
          }
        })

      this.mainNavbarService.confirmAction$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(action => {
        action.proceedCallback();
      })

      this.mainNavbarService.iconClicks$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(button => {
          console.log(button)
          if(button == 'new'){
            this.mode = 'new'
            this.newGroup()
          }

          if(button == 'edit'){
            this.mode = 'edit'
            this.editGroup()
          }

          if(button == 'save'){
            this.closeGroup()
            
            if(this.mode == 'new'){
              setTimeout(() => {
                this.tariffGroupService.addItem(this.tariffGroupForm.value)
                this.preloaderService.show('Creating')
                this.reset()
              }, 350)
            }
            if(this.mode == 'edit'){
              const id = this.tariffGroupForm.get('id')?.value
              if(id){
                setTimeout(() => {
                  this.tariffGroupService.updateItem(id, this.tariffGroupForm.value)
                  this.preloaderService.show('Updating')
                  this.reset()
                }, 350)
              }
              console.log(this.tariffGroupForm.value)
            }
            
          }
        })
    }


    newGroup(){
      this.groupEditOrNew = true
    }
  
    editGroup() {
      this.tariffGroupForm.patchValue({
        id: this.selectedGroup.id,
        name: this.selectedGroup.name,
        icon: this.selectedGroup.icon,
        color: this.selectedGroup.color
      })
      this.groupEditOrNew = true
    }
  
    closeGroup() {
      //console.log(this.tariffGroupForm)
      this.groupEditOrNew = false;
    }


    sort(event: any){

      console.log(event)
    }

    filter(event: any){
      
      console.log(event)
    }
  
    selectedRow(event: any){
      this.selectedGroup = {
        id: event?.id,
        name: event?.name,
        icon: event?.icon,
        color: event?.color
      }
      this.mainNavbarService.setIconState('edit', true, false);
      console.log(event)
    }

    isRequired(control: AbstractControl | null): boolean {
      if (control && control.validator) {
        const validator = control.validator({} as AbstractControl);
        return validator && validator["required"];
      }
      return false;
    }

    reset(){
      this.mode = ''
      this.tariffGroupForm.reset()
      this.mainNavbarService.setIconState('save', true, true);
      //this.mainNavbarService.setIconState('edit', true, true);
    }

    areObjectsEqual(obj1: any, obj2: any): boolean {
      // Gleiche Anzahl an Schlüsseln?
      const keys1 = Object.keys(obj1);
      const keys2 = Object.keys(obj2);
    
      if (keys1.length !== keys2.length) {
        return false;
      }
    
      // Gleiche Werte für jeden Schlüssel?
      for (const key of keys1) {
        if (obj1[key] !== obj2[key]) {
          return false;
        }
      }
    
      return true;
    }


    ngOnDestroy() {
      console.log('destroy Tariff-group')
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
    }
}
