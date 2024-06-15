import { Component, inject, Input, SimpleChanges, TemplateRef} from "@angular/core";
import { NgbDatepickerModule, NgbOffcanvas, OffcanvasDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import { PartnerService } from "../../../../../services/partner/partner.service";
import { DocumentService } from "../../../../../services/partner/documents/documents.service";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
    selector: 'app-preview-documents',
    templateUrl: './preview-documents.component.html',
    styleUrl: './preview-documents.component.scss'
})
export class PreviewDocumentsComponent {
    @Input() file: File | Blob | undefined;

    isImage: boolean = false;
    fileUrl: string = ''
    pdfSrc: any = null
    constructor(private sanitizer: DomSanitizer) {
        pdfDefaultOptions.assetsFolder = 'bleeding-edge';
    }

    
    ngOnInit(): void {
        
      if (this.file) {
        const fileType = this.file.type;
        this.isImage = fileType.startsWith('image/');
          
        if(this.isImage){
          this.fileUrl = this.getImageSrc()
            
        }else{
          this.pdfSrc = this.getPdfSrc()
          console.log(this.pdfSrc)
        }
      }
    }

    ngOnChanges(changes: SimpleChanges) {
        
      if (this.file) {
        const fileType = this.file.type;
        this.isImage = fileType.startsWith('image/');
          
        if(this.isImage){
          this.fileUrl = this.getImageSrc()
        }else{
          this.pdfSrc = this.getPdfSrc()
        }
      }
    }

    getPdfSrc(){
      if(this.file instanceof File || this.file instanceof Blob){
        const url = URL.createObjectURL(this.file) + '#view=FitV';
        return this.sanitizer.bypassSecurityTrustResourceUrl(url) 
      }
      return ''
    }

    getImageSrc(): string {
      if(this.file instanceof File || this.file instanceof Blob){
        return URL.createObjectURL(this.file);
      }
      return ''
    }

    ngOnDestroy() {
      this.fileUrl = ''
      this.isImage = false;
        
    }
}


