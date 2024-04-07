import { Component, EventEmitter, Input, Output, inject, TemplateRef, Renderer2} from "@angular/core";

import { NgbOffcanvas, OffcanvasDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { PartnerService } from "../../../../services/partner/partner.service";
import { DocumentService } from "../../../../services/partner/documents/documents.service"

import { Subject, takeUntil } from "rxjs";
import { FormService } from "../../../../services/form.service";

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
    removeDockumentFileIndex: number|undefined

    archive = false
    loadingData = false
    archiveForm: FormGroup

    constructor(
      private partnerService: PartnerService,
      private documentService: DocumentService,
      private renderer: Renderer2,
      private formService: FormService
    ) {
      this.archiveForm = this.formService.initArchiveDocuments()
    }

    ngOnInit() {

      this.partnerService.confirmAction$.pipe(takeUntil(this.unsubscribe$)).subscribe(({action, proceedCallback}) => {
          if(action == 'selectRow'){
            this.selectedDokument = undefined
            this.selectedDocumentFile = undefined
            this.archive = false
            this.resetArchivForm()
              
          }     
      });

      this.documentService.file$.pipe(takeUntil(this.unsubscribe$)).subscribe(file => {
            
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

      this.documentService.data$.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
          
          
        if(data?.entityType == "documents" && data?.requestType == 'delete'){
          if(this.removeDockumentFileIndex !== undefined){
            this.documents.removeAt(this.removeDockumentFileIndex);
            this.removeDockumentFileIndex = undefined

            if (this.documents && this.documents.length === 0) {
              this.userProfilesForm.removeControl('documents');
            }
            if(this.offcanvasService.hasOpenOffcanvas()){
              this.offcanvasService.dismiss()
              this.removeInputElement()
            } 
          } 
        }

        if(data?.entityType == "documents" && data?.requestType == 'get'){
          if(data['data'] && Array.isArray(data['data'])){
            this.patchArchiveForm(data['data'])
          }      
        }

        if(data?.entityType == "documentRestore" && data?.requestType == 'get'){
          if(this.archive){
            const userProfileId = this.userProfilesForm.get('id')?.value
            if(userProfileId){
              this.documentService.fetchData({'user_profile_id': userProfileId, 'type': 'deleted'})
              this.partnerService.fetchDetailedDataById(userProfileId)
            }     
          }
        }
      })
    }
    
    get documents(): FormArray{
      return this.userProfilesForm.get('documents') as FormArray;
    }

    get archiveDocuments(): FormArray{
      return this.archiveForm?.get('documents') as FormArray
    }

    fileChangeEvent(event: any) {
        
      const filesToAdd = event.addedFiles as FileList;
      this.newDocuments.emit(filesToAdd)
    }

    onRemove(event: any){
        
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
        
      event.stopPropagation()
      let id = document.get('id')?.value
      if(id){
        this.isDownload = true
        this.documentService.downloadDocumentById(id)
      }     
    }

    deleteFile(document: any, index: number, event: any) {
      event.stopPropagation()
        
      //  

      this.selectedDokument = undefined
      this.selectedDocumentFile = undefined
    
      this.partnerService?.confirmAction('deletePartnerFile', () => {
        //console.log()
        let id = this.documents['controls'][index].get('id')?.value
        if(id){
          this.documentService.deleteDocumentById(id)
          this.removeDockumentFileIndex = index
        }else{
          this.documents.removeAt(index);
        }
        
    
        // Проверяем, если это был последний элемент в массиве, удаляем весь массив
        if (this.documents && this.documents.length === 0) {
          this.userProfilesForm.removeControl('documents');
        }
        if(this.offcanvasService.hasOpenOffcanvas()){
          this.offcanvasService.dismiss()
          this.removeInputElement()
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

    toggleArchive(){
        

      this.selectedDokument = undefined
      this.selectedDocumentFile = undefined
      if(this.offcanvasService.hasOpenOffcanvas()){
        this.offcanvasService.dismiss()
        this.removeInputElement()
      } 

      this.archive = !this.archive

      if(this.archive){
        const userProfileId = this.userProfilesForm.get('id')?.value
        if(userProfileId){
          this.documentService.fetchData({'user_profile_id': userProfileId, 'type': 'deleted'})
        }     
      }
    }

    restoreDockumentArchive(document: any, event: any){
      event.stopPropagation()
      this.selectedDokument = undefined
      this.selectedDocumentFile = undefined

      let id = document.get('id')?.value
      if(id){
        this.documentService.restoreDocumentById(id)
        if(this.offcanvasService.hasOpenOffcanvas()){
          this.offcanvasService.dismiss()
          this.removeInputElement()
        } 
        // this.selectedDokument = undefined
        // this.selectedDocumentFile = undefined

        // if(this.archive){
        //   const userProfileId = this.userProfilesForm.get('id')?.value
        //   if(userProfileId){
        //     this.documentService.fetchData({'user_profile_id': userProfileId, 'type': 'deleted'})
        //   }     
        // }
      }  
      //this.documentService.restoreDocumentById()
    }

    patchArchiveForm(data: any[]){
      this.resetArchivForm()
      data.forEach(document => {
        this.formService.addDocuments(this.archiveForm, document)
      })
      this.archiveForm.get('documents')?.patchValue(data)
    }

    resetArchivForm(){
      this.archiveForm.reset()
      this.archiveForm.removeControl('documents')
    }


    ngOnDestroy() {
        
      if(this.offcanvasService.hasOpenOffcanvas()){
        this.offcanvasService.dismiss()
        this.removeInputElement()
      } 
      this.selectedDokument = undefined
      this.selectedDocumentFile = undefined

      this.archive = false
      this.resetArchivForm()
      this.documentService.resetData()
      this.documentService.resetFile()
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
    }
  }