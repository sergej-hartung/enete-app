import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-editor-modal',
  templateUrl: './editor-modal.component.html',
  styleUrls: ['./editor-modal.component.scss']
})
export class EditorModalComponent implements OnInit {
  public Editor: any;
  public editorLoaded = false; // Добавляем флаг для загрузки редактора
  editorForm: FormGroup;
  @Input() initialValue: string = '';
  @Output() saveText = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();

  constructor(private fb: FormBuilder) {
    this.editorForm = this.fb.group({
      content: [this.initialValue]
    });
  }

  async ngOnInit() {
    if (typeof window !== 'undefined') { // Проверка для браузерной среды
      try {
        const { default: ClassicEditor } = await import('@ckeditor/ckeditor5-build-classic');
        this.Editor = ClassicEditor;
        this.editorLoaded = true; // Устанавливаем флаг после успешной загрузки
      } catch (error) {
        console.error('Ошибка при импорте CKEditor:', error);
      }
    }
    this.editorForm.get('content')?.setValue(this.initialValue);
  }

  save() {
    //console.log(this.editorForm)
    if (this.editorForm.valid) {
      console.log(this.editorForm)
      this.saveText.emit(this.editorForm.value.content);
      //this.close.emit();
    }
  }

  closeEditor() {
    console.log('close')
    this.close.emit();
  }
}