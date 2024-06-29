import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
//import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import SourceEditing from '@ckeditor/ckeditor5-source-editing/src/sourceediting';

import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Font from '@ckeditor/ckeditor5-font/src/font';
import List from '@ckeditor/ckeditor5-list/src/list';
import Link from '@ckeditor/ckeditor5-link/src/link';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
import Highlight from '@ckeditor/ckeditor5-highlight/src/highlight';
import RemoveFormat from '@ckeditor/ckeditor5-remove-format/src/removeformat';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import HorizontalLine from '@ckeditor/ckeditor5-horizontal-line/src/horizontalline';
import SpecialCharacters from '@ckeditor/ckeditor5-special-characters/src/specialcharacters';
import FindAndReplace from '@ckeditor/ckeditor5-find-and-replace/src/findandreplace';

export default class ClassicEditor extends ClassicEditorBase {}

ClassicEditor.builtinPlugins = [
    //Essentials,
    //Bold,
    //Italic,
    //Paragraph,
    SourceEditing,
    //Heading,
    //Font,
    //List,
    //Link,
    //Image,
    //ImageToolbar,
    //ImageCaption,
    //ImageStyle,
    //ImageUpload,
    //Table,
    //TableToolbar,
    //Alignment,
    //Highlight,
    //RemoveFormat,
    //PasteFromOffice,
    //HorizontalLine,
    //SpecialCharacters,
    //FindAndReplace
];

ClassicEditor.defaultConfig = {
    toolbar: {
        items: [
            'sourceEditing', '|',
            'bold', 'italic', '|',
            'heading', '|',
            'fontFamily', 'fontSize', 'fontColor', 'fontBackgroundColor', '|',
            'alignment', '|',
            'bulletedList', 'numberedList', 'outdent', 'indent', '|',
            'link', 'blockQuote', '|',
            'insertTable', 'tableColumn', 'tableRow', 'mergeTableCells', '|',
            'imageUpload', 'mediaEmbed', '|',
            'highlight', '|',
            'horizontalLine', '|',
            'specialCharacters', '|',
            'findAndReplace', '|',
            'removeFormat', '|',
            'undo', 'redo'
        ]
    },
    // image: {
    //     toolbar: [
    //         'imageTextAlternative', 'imageStyle:full', 'imageStyle:side'
    //     ]
    // },
    // table: {
    //     contentToolbar: [
    //         'tableColumn', 'tableRow', 'mergeTableCells'
    //     ]
    // },
    language: 'en'
};