import { Component, Input, Output, EventEmitter, ChangeDetectorRef, Inject, PLATFORM_ID, AfterViewInit, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
// import {
// 	AccessibilityHelp,
// 	Alignment,
// 	Autoformat,
// 	AutoImage,
// 	AutoLink,
// 	Autosave,
// 	Base64UploadAdapter,
// 	Bold,
// 	CloudServices,
// 	Code,
// 	CodeBlock,
// 	Essentials,
// 	FontBackgroundColor,
// 	FontColor,
// 	FontFamily,
// 	FontSize,
// 	GeneralHtmlSupport,
// 	Heading,
// 	HorizontalLine,
// 	ImageBlock,
// 	ImageCaption,
// 	ImageInline,
// 	ImageInsert,
// 	ImageInsertViaUrl,
// 	ImageResize,
// 	ImageStyle,
// 	ImageTextAlternative,
// 	ImageToolbar,
// 	ImageUpload,
// 	Indent,
// 	IndentBlock,
// 	Italic,
// 	Link,
// 	LinkImage,
// 	List,
// 	ListProperties,
// 	MediaEmbed,
// 	Mention,
// 	Paragraph,
// 	PasteFromOffice,
// 	RemoveFormat,
// 	SelectAll,
// 	ShowBlocks,
// 	SourceEditing,
// 	SpecialCharacters,
// 	SpecialCharactersArrows,
// 	SpecialCharactersCurrency,
// 	SpecialCharactersEssentials,
// 	SpecialCharactersLatin,
// 	SpecialCharactersMathematical,
// 	SpecialCharactersText,
// 	Strikethrough,
// 	Subscript,
// 	Superscript,
// 	Table,
// 	TableToolbar,
// 	TextTransformation,
// 	TodoList,
// 	Underline,
// 	Undo,
// 	type EditorConfig
// } from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';

@Component({
  selector: 'app-editor-modal',
  standalone: true,
	imports: [CommonModule, CKEditorModule, FormsModule, ReactiveFormsModule],
  templateUrl: './editor-modal.component.html',
  styleUrls: ['./editor-modal.component.scss']
})
export class EditorModalComponent implements OnInit, AfterViewInit {
  public editorLoaded = false;
  editorForm: FormGroup;
  @Input() initialValue: string = '';
  @Output() saveText = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();

  public isLayoutReady = false;
  public Editor: any 
  public config: any = {};

  constructor(private fb: FormBuilder, private changeDetector: ChangeDetectorRef, @Inject(PLATFORM_ID) private platformId: Object) {
    this.editorForm = this.fb.group({
      content: [this.initialValue]
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadEditor();
      this.editorForm.get('content')?.setValue(this.initialValue);
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      //this.initializeEditor();
    }
  }

  async loadEditor() {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const { ClassicEditor } = await import('ckeditor5');
        this.Editor = ClassicEditor;
        //this.isLayoutReady = true;
        this.changeDetector.detectChanges();
        this.initializeEditor();
      } catch (error) {
        console.error('Error loading CKEditor:', error);
      }
    }
  }

  initializeEditor() {
    if (isPlatformBrowser(this.platformId)) {
      import('ckeditor5').then((ckeditor) => {
        this.config = {
          toolbar: {
            items: [
              'undo',
              'redo',
              '|',
              'sourceEditing',
              'showBlocks',
              'selectAll',
              '|',
              'heading',
              '|',
              'fontSize',
              'fontFamily',
              'fontColor',
              'fontBackgroundColor',
              '|',
              'bold',
              'italic',
              'underline',
              'strikethrough',
              'subscript',
              'superscript',
              'code',
              'removeFormat',
              '|',
              'specialCharacters',
              'horizontalLine',
              'link',
              'insertImage',
              'mediaEmbed',
              'insertTable',
              'codeBlock',
              '|',
              'alignment',
              '|',
              'bulletedList',
              'numberedList',
              'todoList',
              'indent',
              'outdent',
              '|',
              'accessibilityHelp'
            ],
            shouldNotGroupWhenFull: true
          },
          plugins: [
            ckeditor.AccessibilityHelp,
            ckeditor.Alignment,
            ckeditor.Autoformat,
            ckeditor.AutoImage,
            ckeditor.AutoLink,
            ckeditor.Autosave,
            ckeditor.Base64UploadAdapter,
            ckeditor.Bold,
            ckeditor.CloudServices,
            ckeditor.Code,
            ckeditor.CodeBlock,
            ckeditor.Essentials,
            ckeditor.FontBackgroundColor,
            ckeditor.FontColor,
            ckeditor.FontFamily,
            ckeditor.FontSize,
            ckeditor.GeneralHtmlSupport,
            ckeditor.Heading,
            ckeditor.HorizontalLine,
            ckeditor.ImageBlock,
            ckeditor.ImageCaption,
            ckeditor.ImageInline,
            ckeditor.ImageInsert,
            ckeditor.ImageInsertViaUrl,
            ckeditor.ImageResize,
            ckeditor.ImageStyle,
            ckeditor.ImageTextAlternative,
            ckeditor.ImageToolbar,
            ckeditor.ImageUpload,
            ckeditor.Indent,
            ckeditor.IndentBlock,
            ckeditor.Italic,
            ckeditor.Link,
            ckeditor.LinkImage,
            ckeditor.List,
            ckeditor.ListProperties,
            ckeditor.MediaEmbed,
            ckeditor.Mention,
            ckeditor.Paragraph,
            ckeditor.PasteFromOffice,
            ckeditor.RemoveFormat,
            ckeditor.SelectAll,
            ckeditor.ShowBlocks,
            ckeditor.SourceEditing,
            ckeditor.SpecialCharacters,
            ckeditor.SpecialCharactersArrows,
            ckeditor.SpecialCharactersCurrency,
            ckeditor.SpecialCharactersEssentials,
            ckeditor.SpecialCharactersLatin,
            ckeditor.SpecialCharactersMathematical,
            ckeditor.SpecialCharactersText,
            ckeditor.Strikethrough,
            ckeditor.Subscript,
            ckeditor.Superscript,
            ckeditor.Table,
            ckeditor.TableToolbar,
            ckeditor.TextTransformation,
            ckeditor.TodoList,
            ckeditor.Underline,
            ckeditor.Undo
          ],
          fontFamily: {
            supportAllValues: true
          },
          fontSize: {
            options: [10, 12, 14, 'default', 18, 20, 22],
            supportAllValues: true
          },
          heading: {
            options: [
              {
                model: 'paragraph',
                title: 'Paragraph',
                class: 'ck-heading_paragraph'
              },
              {
                model: 'heading1',
                view: 'h1',
                title: 'Heading 1',
                class: 'ck-heading_heading1'
              },
              {
                model: 'heading2',
                view: 'h2',
                title: 'Heading 2',
                class: 'ck-heading_heading2'
              },
              {
                model: 'heading3',
                view: 'h3',
                title: 'Heading 3',
                class: 'ck-heading_heading3'
              },
              {
                model: 'heading4',
                view: 'h4',
                title: 'Heading 4',
                class: 'ck-heading_heading4'
              },
              {
                model: 'heading5',
                view: 'h5',
                title: 'Heading 5',
                class: 'ck-heading_heading5'
              },
              {
                model: 'heading6',
                view: 'h6',
                title: 'Heading 6',
                class: 'ck-heading_heading6'
              }
            ]
          },
          htmlSupport: {
            allow: [
              {
                name: /.*/,
                styles: true,
                attributes: true,
                classes: true,
                
              }
            ],
            allowEmpty: [
              'i'
            ]
            // disallow: [
            //   {
            //     name: 'i',
            //     attributes: false,
            //     classes: false,
            //     styles: false
            //   }
            // ]
          },
          image: {
            toolbar: [
              'toggleImageCaption',
              'imageTextAlternative',
              '|',
              'imageStyle:inline',
              'imageStyle:wrapText',
              'imageStyle:breakText',
              '|',
              'resizeImage'
            ]
          },
          initialData:
           '',
           link: {
            addTargetToExternalLinks: true,
            defaultProtocol: 'https://',
            decorators: {
              toggleDownloadable: {
                mode: 'manual',
                label: 'Downloadable',
                attributes: {
                  download: 'file'
                }
              }
            }
          },
          list: {
            properties: {
              styles: true,
              startIndex: true,
              reversed: true
            }
          },
          mention: {
            feeds: [
              {
                marker: '@',
                feed: []
              }
            ]
          },
          placeholder: 'Type or paste your content here!',
          table: {
            contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
          }
        };

        this.isLayoutReady = true;
        this.changeDetector.detectChanges();
      }).catch((error) => {
        console.error('Error loading CKEditor plugins:', error);
      });
      
  
      // this.changeDetector.detectChanges();
      // console.log(this.config)
    }
    
  }

  // initializeEditor() {
  //   if (isPlatformBrowser(this.platformId)) {
  //     // Динамическая загрузка CKEditor плагинов
  //     import('ckeditor5').then((ckeditor) => {
  //       this.config = {
  //         plugins: [
  //           ckeditor.AccessibilityHelp,
  //           ckeditor.Alignment,
  //           ckeditor.Autoformat,
  //           ckeditor.AutoImage,
  //           ckeditor.AutoLink,
  //           ckeditor.Autosave,
  //           ckeditor.Base64UploadAdapter,
  //           ckeditor.Bold,
  //           ckeditor.CloudServices,
  //           ckeditor.Code,
  //           ckeditor.CodeBlock,
  //           ckeditor.Essentials,
  //           ckeditor.FontBackgroundColor,
  //           ckeditor.FontColor,
  //           ckeditor.FontFamily,
  //           ckeditor.FontSize,
  //           ckeditor.GeneralHtmlSupport,
  //           ckeditor.Heading,
  //           ckeditor.HorizontalLine,
  //           ckeditor.ImageBlock,
  //           ckeditor.ImageCaption,
  //           ckeditor.ImageInline,
  //           ckeditor.ImageInsert,
  //           ckeditor.ImageInsertViaUrl,
  //           ckeditor.ImageResize,
  //           ckeditor.ImageStyle,
  //           ckeditor.ImageTextAlternative,
  //           ckeditor.ImageToolbar,
  //           ckeditor.ImageUpload,
  //           ckeditor.Indent,
  //           ckeditor.IndentBlock,
  //           ckeditor.Italic,
  //           ckeditor.Link,
  //           ckeditor.LinkImage,
  //           ckeditor.List,
  //           ckeditor.ListProperties,
  //           ckeditor.MediaEmbed,
  //           ckeditor.Mention,
  //           ckeditor.Paragraph,
  //           ckeditor.PasteFromOffice,
  //           ckeditor.RemoveFormat,
  //           ckeditor.SelectAll,
  //           ckeditor.ShowBlocks,
  //           ckeditor.SourceEditing,
  //           ckeditor.SpecialCharacters,
  //           ckeditor.SpecialCharactersArrows,
  //           ckeditor.SpecialCharactersCurrency,
  //           ckeditor.SpecialCharactersEssentials,
  //           ckeditor.SpecialCharactersLatin,
  //           ckeditor.SpecialCharactersMathematical,
  //           ckeditor.SpecialCharactersText,
  //           ckeditor.Strikethrough,
  //           ckeditor.Subscript,
  //           ckeditor.Superscript,
  //           ckeditor.Table,
  //           ckeditor.TableToolbar,
  //           ckeditor.TextTransformation,
  //           ckeditor.TodoList,
  //           ckeditor.Underline,
  //           ckeditor.Undo
  //         ],
  //         toolbar: {
  //           items: [
  //             'undo',
  //             'redo',
  //             '|',
  //             'sourceEditing',
  //             'showBlocks',
  //             'selectAll',
  //             '|',
  //             'heading',
  //             '|',
  //             'fontSize',
  //             'fontFamily',
  //             'fontColor',
  //             'fontBackgroundColor',
  //             '|',
  //             'bold',
  //             'italic',
  //             'underline',
  //             'strikethrough',
  //             'subscript',
  //             'superscript',
  //             'code',
  //             'removeFormat',
  //             '|',
  //             'specialCharacters',
  //             'horizontalLine',
  //             'link',
  //             'insertImage',
  //             'mediaEmbed',
  //             'insertTable',
  //             'codeBlock',
  //             '|',
  //             'alignment',
  //             '|',
  //             'bulletedList',
  //             'numberedList',
  //             'todoList',
  //             'indent',
  //             'outdent',
  //             '|',
  //             'accessibilityHelp'
  //           ],
  //           shouldNotGroupWhenFull: true
  //         },
  //         fontFamily: {
  //           supportAllValues: true
  //         },
  //         fontSize: {
  //           options: [10, 12, 14, 'default', 18, 20, 22],
  //           supportAllValues: true
  //         },
  //         heading: {
  //           options: [
  //             {
  //               model: 'paragraph',
  //               title: 'Paragraph',
  //               class: 'ck-heading_paragraph'
  //             },
  //             {
  //               model: 'heading1',
  //               view: 'h1',
  //               title: 'Heading 1',
  //               class: 'ck-heading_heading1'
  //             },
  //             {
  //               model: 'heading2',
  //               view: 'h2',
  //               title: 'Heading 2',
  //               class: 'ck-heading_heading2'
  //             },
  //             {
  //               model: 'heading3',
  //               view: 'h3',
  //               title: 'Heading 3',
  //               class: 'ck-heading_heading3'
  //             },
  //             {
  //               model: 'heading4',
  //               view: 'h4',
  //               title: 'Heading 4',
  //               class: 'ck-heading_heading4'
  //             },
  //             {
  //               model: 'heading5',
  //               view: 'h5',
  //               title: 'Heading 5',
  //               class: 'ck-heading_heading5'
  //             },
  //             {
  //               model: 'heading6',
  //               view: 'h6',
  //               title: 'Heading 6',
  //               class: 'ck-heading_heading6'
  //             }
  //           ]
  //         },
  //         placeholder: 'Type or paste your content here!',
  //         table: {
  //           contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
  //         }
  //       };
  
  //       //this.Editor = ckeditor.ClassicEditor; // Инициализация редактора после загрузки плагинов
  //       this.isLayoutReady = true;
  //       this.changeDetector.detectChanges();
  //       console.log(this.config)
  //     }).catch((error) => {
  //       console.error('Error loading CKEditor plugins:', error);
  //     });
  //   }
  // }
  

  save() {
    if (this.editorForm.valid) {
      this.saveText.emit(this.editorForm.value.content);
    }
  }

  closeEditor() {
    this.close.emit();
  }
}