import { Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";


@Component({
    selector: 'app-partner-details-note',
    templateUrl: './partner-details-note.component.html',
    styleUrl: './partner-details-note.component.scss'
})
export class PartnerDetailsNoteComponent {
    @Input() userProfilesForm!: FormGroup;

    
}