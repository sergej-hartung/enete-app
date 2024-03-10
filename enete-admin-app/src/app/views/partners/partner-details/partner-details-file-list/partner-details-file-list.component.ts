import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { Subject, takeUntil } from "rxjs";
import { PartnerService } from "../../../../services/partner/partner.service";


@Component({
    selector: 'app-partner-details-file-list',
    templateUrl: './partner-details-file-list.component.html',
    styleUrl: './partner-details-file-list.component.scss'
  })
  export class PartnerDetailsFileListComponent {
    @Input() userProfilesForm!: FormGroup;
    @Output() newDocuments = new EventEmitter<any>();
    private unsubscribe$ = new Subject<void>();
    
    files: File[] = []

    constructor(
      private partnerService: PartnerService,
    ) {}

    ngOnInit() {
      this.partnerService.confirmAction$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(({action, proceedCallback}) => {
          if(action == 'selectRow'){
            
            console.log('resetSelected')
          }     
      });
    }
    
    get documents(): FormArray{
      return this.userProfilesForm.get('documents') as FormArray;
    }

    fileChangeEvent(event: any) {
      console.log(event)
      const filesToAdd = event.addedFiles as FileList;
      this.newDocuments.emit(filesToAdd)
    }

    onRemove(event: any){
      console.log(event);
      this.files.splice(this.files.indexOf(event), 1);

    }

    ngOnDestroy() {
      console.log('test')
      
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
    }

    downloadFile(document: any) {
      // Логика для скачивания файла
      console.log('Downloading file:', document.get('file').value.name);
      // Здесь должен быть ваш код для скачивания файла
    }

    deleteFile(document: any, index: number) {
      // Логика для удаления файла из FormArray и возможно с сервера
      console.log('Deleting file:', document.get('file').value.name);
    
      this.partnerService?.confirmAction('deletePartnerFile', () => {
        this.documents.removeAt(index);
    
        // Проверяем, если это был последний элемент в массиве, удаляем весь массив
        if (this.documents.length === 0) {
          this.userProfilesForm.removeControl('documents');
        }
      });
      // Здесь может быть вызов сервиса для удаления файла с сервера
    }
  }