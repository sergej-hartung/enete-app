import { Component, SimpleChanges} from '@angular/core';
import { CdkDragDrop, moveItemInArray, copyArrayItem  } from '@angular/cdk/drag-drop';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {AttributeService} from '../../../../../services/product/tariff/attribute/attribute.service'
import { ProductService } from '../../../../../services/product/product.service';
import { Subject, delay, of, takeUntil } from 'rxjs';
import { Attribute } from '../../../../../models/tariff/attribute/attribute';
//import { ProviderService } from '../../../../services/product/tariff/provider/provider.service';


interface Group {
  name: string;
  attributes: any[];
  hidden?: boolean;
}



@Component({
  selector: 'app-tariff-attribute',
  templateUrl: './tariff-attribute.component.html',
  styleUrl: './tariff-attribute.component.scss'
})
export class TariffAttributeComponent {
  tariffAttributes:Attribute[] = [
    // {
    //   code:'highspeed_data',
    //   name:'Highspeed-Data(gesamt)',
    //   is_system: '',
    //   is_required: '',
    //   is_frontend_visible: 1,
    //   unit: 'Mbit/s',
    //   attribute_type: 'Ganzzahlen'
    //   // value_varchar: '',
    //   // value_text: ''
    // },
    // {
    //   code:'aktion_volumen',
    //   name: 'Aktion-Volumen',
    //   is_system: '',
    //   is_required: '',
    //   is_frontend_visible: 1,
    //   unit: 'GB',
    //   attribute_type: 'Ganzzahlen'
    //   // value_varchar: '',
    //   // value_text: ''
    // },
    // {
    //   code:'laufzeit',
    //   name: 'Tarif Laufzeit',
    //   is_system: '',
    //   is_required: '',
    //   is_frontend_visible: 1,
    //   unit: 'Monate',
    //   attribute_type: 'Ganzzahlen'
    //   // value_varchar: '',
    //   // value_text: ''
    // },
    // {
    //   code:'reg_basispreis',
    //   name: 'Regulärer Basispreis',
    //   is_system: '',
    //   is_required: '',
    //   is_frontend_visible: 1,
    //   unit: 'EUR',
    //   attribute_type: 'Dezimalzahlen'
    //   // value_varchar: '',
    //   // value_text: ''
    // },
    // {
    //   code:'telefonie_allnet_flat',
    //   name: 'Telefonie Allnet Flat',
    //   is_system: '',
    //   is_required: '',
    //   is_frontend_visible: 0,
    //   unit: '',
    //   attribute_type: 'Dropdown'
    //   // value_varchar: '',
    //   // value_text: ''
    // }
  ];
  groups: Group[] = [];
  
  tariffDropListId = 'tariffDropList';
  connectedDropLists: string[] = [this.tariffDropListId];

  addNewGroup = false;
  //isCollapsed = false;
  newGroupForm: FormGroup;
  editGroupIndex: number | null = null;
  editGroupForm: FormGroup;
  groupId: number | null = null

  private unsubscribe$ = new Subject<void>();

  constructor(
    private fb: FormBuilder, 
    private attributeService: AttributeService,
    private productService: ProductService,
  ) {
    this.newGroupForm = this.fb.group({
      groupName: ['', Validators.required]
    });

    this.editGroupForm = this.fb.group({
      groupName: ['', Validators.required]
    });
  }

  ngOnInit() { 
    this.productService.tariffGroupId$ 
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(id =>{
        if(id && this.groupId != id){
          this.groupId = id
          //this.attributeService.fetchDataByGroupId(this.groupId)
          // console.log('test')
          of(null).pipe(
            delay(1000)
          ).subscribe(() => {
            this.attributeService.fetchDataByGroupId(this.groupId);
          });
        }
      })

    this.attributeService.data$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {  
        if(data){ 
          if(data.entityType == 'tariffAttributesByGroup'){
            this.tariffAttributes = data.data
          }
          console.log('loaded Attributes')
          console.log(data)
        }    
      });
  }

  ngOnChanges(changes: SimpleChanges) {   
    this.updateConnectedDropLists();
  }

  addNewGroupName() {
    this.addNewGroup = true;
    this.newGroupForm.reset();
  }

  saveNewGroup() {
    if (this.newGroupForm.valid) {
      this.groups.push({ name: this.newGroupForm.value.groupName, attributes: [] });
      this.updateConnectedDropLists();
      this.addNewGroup = false;
      this.newGroupForm.reset();
    }
  }

  cancelNewGroup() {
    this.addNewGroup = false;
    this.newGroupForm.reset();
  }

  editGroup(index: number) {
    this.editGroupIndex = index;
    this.editGroupForm.setValue({ groupName: this.groups[index].name });
  }

  saveEditedGroup() {
    if (this.editGroupForm.valid && this.editGroupIndex !== null) {
      this.groups[this.editGroupIndex].name = this.editGroupForm.value.groupName;
      this.editGroupIndex = null;
      this.editGroupForm.reset();
    }
  }

  cancelEditGroup() {
    this.editGroupIndex = null;
    this.editGroupForm.reset();
  }

  removeGroup(index: number) {
    this.groups.splice(index, 1);
    this.updateConnectedDropLists();
  }

  toggleGroupAttributes(index: number) {
    this.groups[index].hidden = !this.groups[index].hidden;
  }

  getGroupDropListId(index: number): string {
    return `groupDropList-${index}`;
  }

  updateConnectedDropLists() {
    this.connectedDropLists = [this.tariffDropListId, ...this.groups.map((_, index) => this.getGroupDropListId(index))];
  }

  drop(event: CdkDragDrop<any[]>, group?: Group) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      if (group) {
        const attribute = event.previousContainer.data[event.previousIndex];
        if (!group.attributes.includes(attribute)) {
          copyArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
        }
      }
    }
  }

  removeAttribute(group: Group, attribute: string) {
    const index = group.attributes.indexOf(attribute);
    if (index >= 0) {
      group.attributes.splice(index, 1);
    }
  }

  canDropToTariffList = (drag: any) => {
    return drag.dropContainer.id === this.tariffDropListId;
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}