import { Component, inject, TemplateRef} from "@angular/core";
import { NgbDatepickerModule, NgbOffcanvas, OffcanvasDismissReasons } from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'app-preview-documents',
    templateUrl: './preview-documents.component.html',
    styleUrl: './preview-documents.component.scss'
})
export class PreviewDocumentsComponent {

    pdfSrc!: string
}


