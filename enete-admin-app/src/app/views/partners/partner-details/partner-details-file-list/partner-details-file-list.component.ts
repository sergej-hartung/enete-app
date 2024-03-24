import { Component, EventEmitter, Input, Output, inject, TemplateRef, Renderer2} from "@angular/core";

import { NgbOffcanvas, OffcanvasDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { PartnerService } from "../../../../services/partner/partner.service";
import { DocumentService } from "../../../../services/partner/documents/documents.service"

import { Subject, takeUntil } from "rxjs";

declare var require: any;

@Component({
    selector: 'app-partner-details-file-list',
    templateUrl: './partner-details-file-list.component.html',
    styleUrl: './partner-details-file-list.component.scss'
  })
  export class PartnerDetailsFileListComponent {
    @Input() userProfilesForm!: FormGroup;
    @Output() newDocuments = new EventEmitter<any>();
    private unsubscribe$ = new Subject<void>();

    private offcanvasService = inject(NgbOffcanvas);
    closeResult = '';

    selectedDokument: number|undefined
    selectedDocumentFile: File|Blob|undefined
    
    files: File[] = []

    isDownload: boolean = false;
    

    constructor(
      private partnerService: PartnerService,
      private documentService: DocumentService,
      private renderer: Renderer2
    ) {}

    ngOnInit() {

      this.partnerService.confirmAction$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(({action, proceedCallback}) => {
          if(action == 'selectRow'){
            this.selectedDokument = undefined
            this.selectedDocumentFile = undefined
            console.log('resetSelected')
          }     
      });

      this.documentService.file$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(file => {
          console.log(file)
          if(this.isDownload && file){
            const url = window.URL.createObjectURL(file);
            const anchor = document.createElement('a');
            anchor.download = 'document.pdf'; // Укажите здесь нужное имя файла
            //anchor.download
            anchor.href = url;
            anchor.click();
            
            window.URL.revokeObjectURL(url);
            this.isDownload = false
          }
          if(!this.isDownload && file){
            this.selectedDocumentFile = file
          }
        })
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

    toggleDocuments(document: any, index: number, content: TemplateRef<any>, event: any){
      event.stopPropagation()
      
      if(this.selectedDokument == (index + 1)){
        this.selectedDokument = undefined
        if(this.offcanvasService.hasOpenOffcanvas()){
          this.offcanvasService.dismiss(content)
          this.removeInputElement()
        } 
        this.selectedDocumentFile = undefined
      }else{
        this.selectedDokument = index + 1
       
        this.removeInputElement()
        let file = document.get('file')?.value
        let id = document.get('id')?.value
        if(file){
          this.selectedDocumentFile = file
        }else if(!file && id){
          this.documentService.downloadDocumentById(id)
        }  

        if(!this.offcanvasService.hasOpenOffcanvas()){
          this.openCustomPanelClass(content)
        }
      }

      
    }

    downloadFile(document: any, event: any){
      console.log('downloads')
      event.stopPropagation()
      let id = document.get('id')?.value
      if(id){
        this.isDownload = true
        this.documentService.downloadDocumentById(id)
      }     
    }

    deleteFile(document: any, index: number, event: any) {
      event.stopPropagation()
      console.log('delited')
      //console.log('Deleting file:', document.get('file').value.name);
    
      this.partnerService?.confirmAction('deletePartnerFile', () => {
        this.documents.removeAt(index);
    
        // Проверяем, если это был последний элемент в массиве, удаляем весь массив
        if (this.documents && this.documents.length === 0) {
          this.userProfilesForm.removeControl('documents');
        }
      });
      // Здесь может быть вызов сервиса для удаления файла с сервера
    }


    openCustomPanelClass(content: TemplateRef<any>) {
      this.offcanvasService.open(content, { panelClass: 'custom-canvas', backdrop: false });
    }

    removeInputElement() {
      // Используем querySelector для поиска элемента в DOM
      const inputElement = document.querySelector('input#fileInput');
  
      // Проверяем, найден ли элемент
      if (inputElement) {
        // Используем Renderer2 для безопасного удаления элемента из DOM
        this.renderer.removeChild(inputElement.parentNode, inputElement);
      }
    }

    ngOnDestroy() {
      console.log('test')  
      if(this.offcanvasService.hasOpenOffcanvas()){
        this.offcanvasService.dismiss()
        this.removeInputElement()
      } 
      this.selectedDokument = undefined
      this.selectedDocumentFile = undefined

      this.unsubscribe$.next();
      this.unsubscribe$.complete();
    }
  }