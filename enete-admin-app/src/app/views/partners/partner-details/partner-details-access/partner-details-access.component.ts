import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Dimensions, ImageCroppedEvent, ImageTransform, LoadedImage } from 'ngx-image-cropper';

class RequiredStatus {
  [key: string]: boolean;
}

@Component({
  selector: 'app-partner-details-access',
  templateUrl: './partner-details-access.component.html',
  styleUrl: './partner-details-access.component.scss'
})
export class PartnerDetailsAccessComponent {
  @Input() userProfilesForm!: FormGroup;
  @Input() requiredStatus!: RequiredStatus; 
  @Output() newAccess = new EventEmitter<any>();

  file?: File

  imageChangedEvent: any;
  croppedImage: any;
  showCropper = false;
  loading = false;
  canvasRotation = 0;
  rotation?: number;
  transform: ImageTransform = {
    translateUnit: 'px'
  };
  translateH = 0;
  translateV = 0;

  selectedUser:any 
  selectedUserIndex: number|undefined

  constructor(
    private sanitizer: DomSanitizer
  ) {
    // if(this.userProfilesForm.controls['users']){
    //   console.log(this.userProfilesForm.get('users'))
    // }
    //this.selectedUser = this.getLastUser() ? this.getLastUser() : false
    
  }

  ngOnInit() {
    this.selectedUser = this.getLastUser() ? this.getLastUser() : false
    this.selectedUserIndex = this.getLastUserIndex()
    console.log(this.selectedUser)

    // if(this.userProfilesForm){
    //   this.selectedUser = this.getLastUser()
    // }
  }

  fileChangeEvent(event: any): void {
    this.file = event.addedFiles[0] ? event.addedFiles[0] : null
    console.log(this.file)
  }
  imageCropped(event: ImageCroppedEvent) {
    if (event.objectUrl !== null && event.objectUrl !== undefined){
      console.log(event)
      this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);
    }
    
    // event.blob can be used to upload the cropped image
  }
  imageLoaded(image: LoadedImage) {
    this.showCropper = true;
    console.log('Image loaded');
  }
  cropperReady(sourceImageDimensions: Dimensions) {
    console.log('Cropper ready', sourceImageDimensions);
    this.loading = false;
  }
  loadImageFailed() {
    console.error('Load image failed');
  }

  rotateLeft() {
    this.loading = true;
    setTimeout(() => { // Use timeout because rotating image is a heavy operation and will block the ui thread
      this.canvasRotation--;
      this.flipAfterRotate();
    });
  }

  rotateRight() {
    this.loading = true;
    setTimeout(() => {
      this.canvasRotation++;
      this.flipAfterRotate();
    });
  }

  updateRotation() {
    console.log('rotate')
    this.transform = {
      ...this.transform,
      rotate: this.rotation
    };

    console.log(this.transform)
  }

  get users(): FormArray{
    return this.userProfilesForm.get('users') as FormArray;
  }

  

  // onSelectF(event: any){
  //   this.file = event.addedFiles[0]
  //   console.log(this.file)
  // }

	onRemove(event: any) {
		// console.log(event);
		// this.files.splice(this.files.indexOf(event), 1);
    this.file = undefined
    this.croppedImage = undefined
	}

  private flipAfterRotate() {
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
      ...this.transform,
      flipH: flippedV,
      flipV: flippedH
    };
    this.translateH = 0;
    this.translateV = 0;
  }

  setNewAccess(){
    this.newAccess.emit()
    this.selectedUser = this.getLastUser()
    this.selectedUserIndex = this.getLastUserIndex()
    console.log(this.requiredStatus)
  }

  getLastUser(){
    const usersArray = this.users
    if(usersArray){
      const lastUserIndex = usersArray.length - 1
      const lastUser = usersArray.at(lastUserIndex)
      console.log(lastUser)
      return lastUser
    }
    return false
  }

  getLastUserIndex(){
    const usersArray = this.users
    if(usersArray){
      return usersArray.length - 1
    }
    return undefined
  }

  imgConfirmed(){

  }



  //users : new FormArray([this.createUserFormGroup()])
  // private createUserFormGroup(): FormGroup {
  //   return new FormGroup({
  //     id: new FormControl(),
  //     login_name: new FormControl('', [Validators.required, Validators.minLength(2)]),
  //     password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  //     password_confirmation: new FormControl('', [Validators.required, Validators.minLength(6)]),
  //     role_id: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
  //     avatar: new FormControl(null),
  //     status_id: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
  //   });
  // }
}
