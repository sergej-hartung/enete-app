import { Component, inject, Input, SimpleChanges, TemplateRef} from "@angular/core";
import { NgbDatepickerModule, NgbOffcanvas, OffcanvasDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import { PartnerService } from "../../../../../services/partner/partner.service";
import { DocumentService } from "../../../../../services/partner/documents/documents.service";

@Component({
    selector: 'app-preview-documents',
    templateUrl: './preview-documents.component.html',
    styleUrl: './preview-documents.component.scss'
})
export class PreviewDocumentsComponent {
    @Input() file: File | Blob | undefined;

    isImage: boolean = false;
    fileUrl: string = ''
    
    constructor() {
        pdfDefaultOptions.assetsFolder = 'bleeding-edge';
    }

    
    ngOnInit(): void {
        
      if (this.file) {
        const fileType = this.file.type;
        this.isImage = fileType.startsWith('image/');
          
        if(this.isImage){
          this.getImageSrc()
            
        }
      }
    }

    ngOnChanges(changes: SimpleChanges) {
        
      if (this.file) {
        const fileType = this.file.type;
        this.isImage = fileType.startsWith('image/');
          
        if(this.isImage){
          this.fileUrl = this.getImageSrc()
            
        }
      }
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


