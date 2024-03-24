import { Component, inject, Input, SimpleChanges, TemplateRef} from "@angular/core";
import { NgbDatepickerModule, NgbOffcanvas, OffcanvasDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import { PartnerService } from "../../../../../services/partner/partner.service";

@Component({
    selector: 'app-preview-documents',
    templateUrl: './preview-documents.component.html',
    styleUrl: './preview-documents.component.scss'
})
export class PreviewDocumentsComponent {
    @Input() file: File | Blob | undefined;

    isImage: boolean = false;
    fileUrl: string = ''
    
    constructor(
        private partnerService: PartnerService,
    ) {
        pdfDefaultOptions.assetsFolder = 'bleeding-edge';
    }

    
    ngOnInit(): void {
      console.log(this.file)
      if (this.file) {
        const fileType = this.file.type;
        this.isImage = fileType.startsWith('image/');
        console.log(this.isImage);
        if(this.isImage){
          this.getImageSrc()
          console.log(this.fileUrl)
        }
      }
    }

    ngOnChanges(changes: SimpleChanges) {
      console.log(this.file)
      if (this.file) {
        const fileType = this.file.type;
        this.isImage = fileType.startsWith('image/');
        console.log(this.isImage);
        if(this.isImage){
          this.fileUrl = this.getImageSrc()
          console.log(this.fileUrl)
        }
      }
    }

    getImageSrc(): string {
      if(this.file instanceof File || this.file instanceof Blob){
        return URL.createObjectURL(this.file);
      }
      return ''
    }
}


