import { Component, EventEmitter, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductDocumentService } from '../../../services/product/product-document.service';
import { Subject, takeUntil } from 'rxjs';
import { Tablecolumn } from '../../../models/tablecolumn';
import { FilterOption } from '../generic-table/generic-table.component';

export interface FileData {
  id: number;
  name: string;
  path: string;
  type: 'file';
  size: number;
  mime_type: string;
  selected?: boolean
  icon?: string;
  isEditing?: boolean;
  formatedType?: string;
  formattedSize?: string;
}

interface FolderData {
  name: string;
  path: string;
  type: 'folder';
  children: (FolderData | FileData)[];
  isSelected?: boolean;
  isEditing?: boolean;
  isNew?: boolean;
  isOpen?: boolean;
}

@Component({
  selector: 'app-file-manager-modal',
  templateUrl: './file-manager-modal.component.html',
  styleUrl: './file-manager-modal.component.scss'
})
export class FileManagerModalComponent {
  @Output() fileSelected = new EventEmitter<FileData>();

  tree: FolderData[] = [];
  selectedNode: FolderData | null = null;
  selectedFiles: FileData[] = [];
  selectedFile: FileData | null = null;
  searchTerm: string = '';
  mimeType: string = '';
  isFileLoading = false

  isLoaded= true;
  private openPaths: string[] = [];
  private unsubscribe$ = new Subject<void>();

  fileColumns: Tablecolumn[] = [
    { key: 'icon', title: '', sortable: false, isIcon: true },
    { key: 'name', title: 'Name', sortable: false, isEditable: true },
    { key: 'formatedType', title: 'Dateityp', sortable: false },
    { key: 'formattedSize', title: 'Größe', sortable: false },
  ];

  filters: FilterOption[] = [
    { type: 'text', key: 'search', label: 'Search' },
  ];

  constructor(
    private modalService: NgbModal,
    private productDocumentService: ProductDocumentService,
  ) {}

  ngOnInit(): void {
    this.loadTree();
  }

  loadTree(): void {
    this.productDocumentService.getTree()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((tree: FolderData[]) => {
        this.tree = this.restoreOpenState(tree.map(folder => this.addSelectionFlag(folder)));
      });
  }

  restoreOpenState(tree: FolderData[]): FolderData[] {
    tree.forEach(folder => {
      if (this.openPaths.includes(folder.path)) {
        folder.isOpen = true;
      }
      if (folder.children) {
        this.restoreOpenState(folder.children as FolderData[]);
      }
    });
    return tree;
  }

  addSelectionFlag(folder: FolderData): FolderData {
    return {
      ...folder,
      isSelected: false,
      isEditing: false,
      isOpen: false,
      children: folder.children.map(child =>
        child.type === 'folder' ? this.addSelectionFlag(child) : child
      )
    };
  }

  onFileSelected(file: FileData): void {
    this.selectedFile = file;
  }

  searchEvent(event: any){

    this.searchTerm = event?.search ? event?.search : ''
    this.searchFiles()

  }

  searchFiles(): void {  // Добавлен метод для поиска
    if (this.selectedNode) {
      this.loadFiles(this.selectedNode.path);
    }
  }

  open(content: any) {
    this.modalService.open(
      content, 
      { 
        ariaLabelledBy: 'modal-basic-title', 
      });
  }

  close(){
    this.modalService.dismissAll()
  }

  save(){
    if (this.selectedFile) {
      this.fileSelected.emit(this.selectedFile); // Emit the selected file
      this.close();
    }
  }

  selectNode(node: FolderData | null): void {
    this.deselectNode(this.tree);
    if (node && node.type === 'folder') {
      this.selectedNode = node;
      this.loadFiles(node.path);
      node.isSelected = true;
      this.selectedFile = null
      //this.fileContent = null
      //this.setStatusButton('file', false)
      //this.setStatusButton('folder', true)
      //node.isOpen = true;  // Открываем папку при выборе
    } else {
      
      this.selectedNode = null;
      this.selectedFiles = [];
      //this.fileContent = null

      //this.setStatusButton('all', false)
    }
  }

  deselectNode(tree: FolderData[]): void {
    for (const folder of tree) {
      folder.isSelected = false;
      folder.isEditing = false;
      if (folder.children) {
        this.deselectNode(folder.children as FolderData[]);
      }
    }
  }

  loadFiles(folder: string): void {
    this.isLoaded = false;
    this.productDocumentService.getFiles(folder, this.searchTerm, this.mimeType) // Обновление для использования строки поиска
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((files: FileData[]) => {
        this.selectedFiles = files.filter((file: FileData) => file.type === 'file');
        this.updateFileData();
      });
  }

  updateFileData(): void {
    this.selectedFiles = this.selectedFiles.map(file => ({
      ...file,
      icon: this.getFileIcon(file.mime_type),
      formattedSize: this.getFileSize(file.size),
      formatedType: this.getFileType(file.mime_type),
    }));

    this.isLoaded = true
  }

  getFileType(mimeType: string): string {
    if (mimeType === 'application/pdf') {
      return 'PDF';
    } else if (mimeType.startsWith('image/svg+xml')) {
      return 'SVG';
    }else if (mimeType.startsWith('image/')) {
      return 'Image';
    }
    return 'Unknown';
  }

  getFileIcon(mimeType: string): string {
    if (mimeType === 'application/pdf') {
      return 'fa-regular fa-file-pdf';
    } else if (mimeType.startsWith('image/')) {
      return 'fa-regular fa-file-image';
    }
    return 'fa-regular fa-file';
  }

  getFileSize(size: number): string {
    if (size < 1024) return `${size} B`;
    size /= 1024;
    if (size < 1024) return `${size.toFixed(2)} KB`;
    size /= 1024;
    if (size < 1024) return `${size.toFixed(2)} MB`;
    size /= 1024;
    return `${size.toFixed(2)} GB`;
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
