import { Component, EventEmitter, Input, Output, inject, TemplateRef, PLATFORM_ID, Inject} from "@angular/core";
import { isPlatformBrowser } from '@angular/common';
import { NgbOffcanvas, OffcanvasDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { PartnerService } from "../../../../services/partner/partner.service";
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
    pdfSrc!: string
    
    files: File[] = []

    isBrowser: boolean = false;
    

    constructor(
      @Inject(PLATFORM_ID) private platformId: Object,
      private partnerService: PartnerService,
    ) {
      this.isBrowser = isPlatformBrowser(this.platformId);
    }

    ngOnInit() {
      if (this.isBrowser) {
        // Динамический импорт ng2-pdf-viewer
        import('ng2-pdf-viewer').then(module => {
          const PDFViewerModule = module.PdfViewerModule;
          // Теперь PDFViewerModule доступен для использования
        });
      }

      this.partnerService.confirmAction$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(({action, proceedCallback}) => {
          if(action == 'selectRow'){
            this.selectedDokument = undefined
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

    toggleDocuments(document: any, index: number, content: TemplateRef<any>){
      if(this.selectedDokument == (index + 1)){
        this.selectedDokument = undefined
        if(this.offcanvasService.hasOpenOffcanvas()){
          this.offcanvasService.dismiss(content)
        } 
      }else{
        this.selectedDokument = index + 1
        if(!this.offcanvasService.hasOpenOffcanvas()){
          this.openCustomPanelClass(content)
        }     
      }
    }

    downloadFile(document: any) {
      // Логика для скачивания файла
      console.log('Downloading file:', document.get('file').value.name);
      // Здесь должен быть ваш код для скачивания файла
    }

    deleteFile(document: any, index: number) {
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


    ngOnDestroy() {
      console.log('test')
      
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
    }
  }