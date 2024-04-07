import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Dimensions, ImageCroppedEvent, ImageTransform, LoadedImage } from 'ngx-image-cropper';
import { Subject, takeUntil } from 'rxjs';
import { PartnerService } from '../../../../services/partner/partner.service';

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

  private unsubscribe$ = new Subject<void>();
  
  file?: File

  imageChangedEvent: any;
  croppedImage: any;
  croppedImageBlob: any;
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

  private urlCache = new Map<Blob, string>();

  constructor(
    private sanitizer: DomSanitizer,
    private partnerService: PartnerService,
  ) {
    // if(this.userProfilesForm.controls['users']){
    //     
    // }
    //this.selectedUser = this.getLastUser() ? this.getLastUser() : false
    
  }

  ngOnInit() {
    // this.selectedUser = this.getLastUser() ? this.getLastUser() : false
    // this.selectedUserIndex = this.getLastUserIndex()
      

    // if(this.userProfilesForm){
    //   this.selectedUser = this.getLastUser()
    // }

    this.partnerService.confirmAction$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({action, proceedCallback}) => {
        if(action == 'selectRow'){
          this.resetSelectedUser()
            
        }     
    });

    if(this.partnerService){
      this.partnerService.detailedData$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(data => { 
            
          if(data){                       
            if(data.requestType == "get" && data.entityType == 'partner'){

            }
            if(data.requestType == "post" && data.entityType == 'partner'){

            }
            if(data.requestType == "patch" && data.entityType == 'partner'){
              this.resetSelectedUser()
            }
          } else if(data == null ){

          }      
 
        });
    }
  }

  getObjectUrl(userIndex: number): string | null {
    const usersArray = this.users;
    if (usersArray) {
      const avatar: Blob | null = usersArray.at(userIndex)?.get('avatar')?.value ?? null;
      //  
      if (avatar instanceof Blob) {
        //  
        if (this.urlCache.has(avatar)) {
          // Возвращаем кэшированный URL, если он уже был создан для этого blob
          return this.urlCache.get(avatar) || null;
        } else if (avatar instanceof Blob) {
          // Создаём и кэшируем новый URL, если это blob и для него ещё нет URL
          const objectUrl = URL.createObjectURL(avatar);
          this.urlCache.set(avatar, objectUrl);
          return objectUrl;
        }
      }else if(typeof avatar === 'string'){
        return avatar
      }
    }
    return null;
  }

  onSelectUser(i: number){
      
    if(this.selectedUserIndex == i){
      this.resetSelectedUser()
    }else{
      const usersArray = this.users
      if(usersArray){

        this.selectedUser = usersArray.at(i) as FormGroup
        this.selectedUserIndex = i
      }
    }
    
  }

  generateUserData(){
    let login = ''

    if(this.users && this.users.length > 1){
      //login = this.userProfilesForm.get('vp_nr')?.value + '-'+ ((this.selectedUserIndex ? this.selectedUserIndex + 1 : '') ?? '')
      login = this.userProfilesForm.get('employee_details.vp_nr')?.value + '-' + (this.selectedUserIndex ? this.selectedUserIndex + 1 : '');
    }else{
      login = this.userProfilesForm.get('employee_details.vp_nr')?.value ?? ''
    }
    const role_id = "2"
    const status = "1"
    const password = this.generatePassword(10)
      
    this.selectedUser.patchValue({
      login_name: login,
      role_id: role_id,
      status_id: status,
      password: password,
      password_confirmation: password
    })
    this.selectedUser.markAllAsTouched()
    this.selectedUser.markAsDirty()
  }

  fileChangeEvent(event: any): void {
    this.file = event.addedFiles[0] ? event.addedFiles[0] : null
      
  }


  imageCropped(event: ImageCroppedEvent) {
    if (event.objectUrl !== null && event.objectUrl !== undefined){
        
      if(event.blob && event.blob instanceof Blob)   
      
      this.croppedImageBlob = event.blob
      this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);
    }
    
    // event.blob can be used to upload the cropped image
  }


  imageLoaded(image: LoadedImage) {
    this.showCropper = true;
      
  }


  cropperReady(sourceImageDimensions: Dimensions) {
      
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
      
    this.transform = {
      ...this.transform,
      rotate: this.rotation
    };

      
  }

  get users(): FormArray{
    return this.userProfilesForm.get('users') as FormArray;
  }

  

  // onSelectF(event: any){
  //   this.file = event.addedFiles[0]
  //     
  // }

	onRemove() {
		//   
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
    this.newAccess.emit(true)
    this.selectedUser = this.getLastUser()
    this.selectedUserIndex = this.getLastUserIndex()
      
  }

  getLastUser(){
    const usersArray = this.users
    if(usersArray){
      const lastUserIndex = usersArray.length - 1
      const lastUser = usersArray.at(lastUserIndex) as FormGroup
        
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
      

    this.selectedUser.patchValue({
      avatar: this.croppedImageBlob
    })
    this.selectedUser['controls']['avatar']?.markAsDirty()
    this.onRemove()
  }

  private generatePassword(length: number): string {
    const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
    const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numberChars = '0123456789';
    const specialChars = '!@#$%&*+-=?';
  
    // Объединяем все наборы символов в одну строку
    const allChars = lowerChars + upperChars + numberChars + specialChars;
    let password = '';
  
    // Гарантируем, что пароль будет содержать хотя бы по одному символу из каждого набора
    password += lowerChars.charAt(Math.floor(Math.random() * lowerChars.length));
    password += upperChars.charAt(Math.floor(Math.random() * upperChars.length));
    password += numberChars.charAt(Math.floor(Math.random() * numberChars.length));
    password += specialChars.charAt(Math.floor(Math.random() * specialChars.length));
  
    // Добавляем оставшиеся символы случайным образом до достижения желаемой длины пароля
    for (let i = password.length; i < length; i++) {
      password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }
  
    // Перемешиваем символы пароля для увеличения случайности
    password = password.split('').sort(() => 0.5 - Math.random()).join('');
  
    return password;
  }

  private resetSelectedUser(){
    this.selectedUserIndex = undefined
    this.selectedUser = null
  }

  ngOnDestroy() {
    // Перебираем все кэшированные URL и освобождаем их
    this.urlCache.forEach((value: string, key: Blob) => {
        
      URL.revokeObjectURL(value); // Здесь value - это строка URL, а не Blob
    });
    this.urlCache.clear(); // Очищаем кэш после освобождения URL
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
