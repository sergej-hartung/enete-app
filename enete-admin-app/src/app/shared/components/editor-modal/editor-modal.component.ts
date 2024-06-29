import { Component, Input, Output, EventEmitter, ChangeDetectorRef, Inject, PLATFORM_ID, AfterViewInit, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import {
	AccessibilityHelp,
	Alignment,
	Autoformat,
	AutoImage,
	AutoLink,
	Autosave,
	Base64UploadAdapter,
	Bold,
	CloudServices,
	Code,
	CodeBlock,
	Essentials,
	FontBackgroundColor,
	FontColor,
	FontFamily,
	FontSize,
	GeneralHtmlSupport,
	Heading,
	HorizontalLine,
	ImageBlock,
	ImageCaption,
	ImageInline,
	ImageInsert,
	ImageInsertViaUrl,
	ImageResize,
	ImageStyle,
	ImageTextAlternative,
	ImageToolbar,
	ImageUpload,
	Indent,
	IndentBlock,
	Italic,
	Link,
	LinkImage,
	List,
	ListProperties,
	MediaEmbed,
	Mention,
	Paragraph,
	PasteFromOffice,
	RemoveFormat,
	SelectAll,
	ShowBlocks,
	SourceEditing,
	SpecialCharacters,
	SpecialCharactersArrows,
	SpecialCharactersCurrency,
	SpecialCharactersEssentials,
	SpecialCharactersLatin,
	SpecialCharactersMathematical,
	SpecialCharactersText,
	Strikethrough,
	Subscript,
	Superscript,
	Table,
	TableToolbar,
	TextTransformation,
	TodoList,
	Underline,
	Undo,
	type EditorConfig
} from 'ckeditor5';

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
      this.initializeEditor();
    }
  }

  async loadEditor() {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const { ClassicEditor } = await import('ckeditor5');
        this.Editor = ClassicEditor;
        this.isLayoutReady = true;
        this.changeDetector.detectChanges();
      } catch (error) {
        console.error('Error loading CKEditor:', error);
      }
    }
  }

  initializeEditor() {
    if (isPlatformBrowser(this.platformId)) {
      // this.config = {
      //   toolbar: {
      //     items: [
      //       'undo',
      //       'redo',
      //       '|',
      //       'sourceEditing',
      //       'showBlocks',
      //       'selectAll',
      //       '|',
      //       'heading',
      //       '|',
      //       'fontSize',
      //       'fontFamily',
      //       'fontColor',
      //       'fontBackgroundColor',
      //       '|',
      //       'bold',
      //       'italic',
      //       'underline',
      //       'strikethrough',
      //       'subscript',
      //       'superscript',
      //       'code',
      //       'removeFormat',
      //       '|',
      //       'specialCharacters',
      //       'horizontalLine',
      //       'link',
      //       'insertImage',
      //       'mediaEmbed',
      //       'insertTable',
      //       'htmlEmbed',
      //       '|',
      //       'alignment',
      //       '|',
      //       'bulletedList',
      //       'numberedList',
      //       'todoList',
      //       'indent',
      //       'outdent',
      //       '|',
      //       'accessibilityHelp'
      //     ],
      //     shouldNotGroupWhenFull: true
      //   },
      //   plugins: [
      //     CKEditor.AccessibilityHelp,
      //     CKEditor.Alignment,
      //     CKEditor.Autoformat,
      //     CKEditor.AutoImage,
      //     CKEditor.AutoLink,
      //     CKEditor.Autosave,
      //     CKEditor.Base64UploadAdapter,
      //     CKEditor.Bold,
      //     CKEditor.Code,
      //     CKEditor.Essentials,
      //     CKEditor.FontBackgroundColor,
      //     CKEditor.FontColor,
      //     CKEditor.FontFamily,
      //     CKEditor.FontSize,
      //     CKEditor.GeneralHtmlSupport,
      //     CKEditor.Heading,
      //     CKEditor.HorizontalLine,
      //     CKEditor.HtmlComment,
      //     CKEditor.HtmlEmbed,
      //     CKEditor.ImageBlock,
      //     CKEditor.ImageCaption,
      //     CKEditor.ImageInsert,
      //     CKEditor.ImageInsertViaUrl,
      //     CKEditor.ImageResize,
      //     CKEditor.ImageStyle,
      //     CKEditor.ImageTextAlternative,
      //     CKEditor.ImageToolbar,
      //     CKEditor.ImageUpload,
      //     CKEditor.Indent,
      //     CKEditor.IndentBlock,
      //     CKEditor.Italic,
      //     CKEditor.Link,
      //     CKEditor.LinkImage,
      //     CKEditor.List,
      //     CKEditor.ListProperties,
      //     CKEditor.MediaEmbed,
      //     CKEditor.Paragraph,
      //     CKEditor.RemoveFormat,
      //     CKEditor.SelectAll,
      //     CKEditor.ShowBlocks,
      //     CKEditor.SourceEditing,
      //     CKEditor.SpecialCharacters,
      //     CKEditor.SpecialCharactersArrows,
      //     CKEditor.SpecialCharactersCurrency,
      //     CKEditor.SpecialCharactersEssentials,
      //     CKEditor.SpecialCharactersLatin,
      //     CKEditor.SpecialCharactersMathematical,
      //     CKEditor.SpecialCharactersText,
      //     CKEditor.Strikethrough,
      //     CKEditor.Subscript,
      //     CKEditor.Superscript,
      //     CKEditor.Table,
      //     CKEditor.TableToolbar,
      //     CKEditor.TextTransformation,
      //     CKEditor.TodoList,
      //     CKEditor.Underline,
      //     CKEditor.Undo
      //   ],
      //   fontFamily: {
      //     supportAllValues: true
      //   },
      //   fontSize: {
      //     options: [10, 12, 14, 'default', 18, 20, 22],
      //     supportAllValues: true
      //   },
      //   heading: {
      //     options: [
      //       { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
      //       { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
      //       { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
      //       { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
      //       { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
      //       { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
      //       { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
      //     ]
      //   },
      //   htmlSupport: {
      //     allow: [
      //       { name: /^.*$/, styles: true, attributes: true, classes: true }
      //     ]
      //   },
      //   image: {
      //     toolbar: [
      //       'toggleImageCaption',
      //       'imageTextAlternative',
      //       '|',
      //       'imageStyle:alignBlockLeft',
      //       'imageStyle:block',
      //       'imageStyle:alignBlockRight',
      //       '|',
      //       'resizeImage'
      //     ],
      //     styles: {
      //       options: ['alignBlockLeft', 'block', 'alignBlockRight']
      //     }
      //   },
      //   initialData: '<h2>Congratulations on setting up CKEditor 5! 🎉</h2><p>You\'ve successfully created a CKEditor 5 project. This powerful text editor will enhance your application, enabling rich text editing capabilities that are customizable and easy to use.</p><h3>What\'s next?</h3><ol><li><strong>Integrate into your app</strong>: time to bring the editing into your application. Take the code you created and add to your application.</li><li><strong>Explore features:</strong> Experiment with different plugins and toolbar options to discover what works best for your needs.</li><li><strong>Customize your editor:</strong> Tailor the editor\'s configuration to match your application\'s style and requirements. Or even write your plugin!</li></ol><p>Keep experimenting, and don\'t hesitate to push the boundaries of what you can achieve with CKEditor 5. Your feedback is invaluable to us as we strive to improve and evolve. Happy editing!</p><h3>Helpful resources</h3><ul><li>📝 <a href="https://orders.ckeditor.com/trial/premium-features">Trial sign up</a>,</li><li>📕 <a href="https://ckeditor.com/docs/ckeditor5/latest/installation/index.html">Documentation</a>,</li><li>⭐️ <a href="https://github.com/ckeditor/ckeditor5">GitHub</a> (star us if you can!),</li><li>🏠 <a href="https://ckeditor.com">CKEditor Homepage</a>,</li><li>🧑‍💻 <a href="https://ckeditor.com/ckeditor-5/demo/">CKEditor 5 Demos</a>,</li></ul><h3>Need help?</h3><p>See this text, but the editor is not starting up? Check the browser\'s console for clues and guidance. It may be related to an incorrect license key if you use premium features or another feature-related requirement. If you cannot make it work, file a GitHub issue, and we will help as soon as possible!</p>',
      //   language: 'de',
      //   link: {
      //     addTargetToExternalLinks: true,
      //     defaultProtocol: 'https://',
      //     decorators: {
      //       toggleDownloadable: {
      //         mode: 'manual',
      //         label: 'Downloadable',
      //         attributes: {
      //           download: 'file'
      //         }
      //       }
      //     }
      //   },
      //   list: {
      //     properties: {
      //       styles: true,
      //       startIndex: true,
      //       reversed: true
      //     }
      //   },
      //   placeholder: 'Type or paste your content here!',
      //   table: {
      //     contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
      //   }
      // };
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
          AccessibilityHelp,
          Alignment,
          Autoformat,
          AutoImage,
          AutoLink,
          Autosave,
          Base64UploadAdapter,
          Bold,
          CloudServices,
          Code,
          CodeBlock,
          Essentials,
          FontBackgroundColor,
          FontColor,
          FontFamily,
          FontSize,
          GeneralHtmlSupport,
          Heading,
          HorizontalLine,
          ImageBlock,
          ImageCaption,
          ImageInline,
          ImageInsert,
          ImageInsertViaUrl,
          ImageResize,
          ImageStyle,
          ImageTextAlternative,
          ImageToolbar,
          ImageUpload,
          Indent,
          IndentBlock,
          Italic,
          Link,
          LinkImage,
          List,
          ListProperties,
          MediaEmbed,
          Mention,
          Paragraph,
          PasteFromOffice,
          RemoveFormat,
          SelectAll,
          ShowBlocks,
          SourceEditing,
          SpecialCharacters,
          SpecialCharactersArrows,
          SpecialCharactersCurrency,
          SpecialCharactersEssentials,
          SpecialCharactersLatin,
          SpecialCharactersMathematical,
          SpecialCharactersText,
          Strikethrough,
          Subscript,
          Superscript,
          Table,
          TableToolbar,
          TextTransformation,
          TodoList,
          Underline,
          Undo
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
  
      this.changeDetector.detectChanges();
    }
    
  }

  save() {
    if (this.editorForm.valid) {
      this.saveText.emit(this.editorForm.value.content);
    }
  }

  closeEditor() {
    this.close.emit();
  }
}
