import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ProductDocumentService } from '../../../services/product/product-document.service';
import { Subject, takeUntil } from 'rxjs';
import { Tablecolumn } from '../../../models/tablecolumn';
import { Buttons, FilterOption } from '../../../shared/components/generic-table/generic-table.component';

interface FileData {
  id: number;
  name: string;
  path: string;
  type: 'file';
  size: number;
  mime_type: string;
  icon?: string;
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
  selector: 'app-file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.scss']
})
export class FileManagerComponent implements OnInit {

  tree: FolderData[] = [];
  selectedNode: FolderData | null = null;
  files: any[] = [];
  fileContent: SafeResourceUrl | null = null;
  isFileLoading = false
  isImage = false;
  isLoading = false;
  isLoaded= true;
  selectedFiles: FileData[] = [];
  private unsubscribe$ = new Subject<void>();

  originalFolderName: string | null = null;
  newFolderName: string | null = null;
  editingFolder: FolderData | null = null;
  creatingFolder: FolderData | null = null;

  private openPaths: string[] = [];

  @ViewChild('newFolderInput') newFolderInput!: ElementRef<HTMLInputElement>;
  @ViewChild('editFolderInput') editFolderInput!: ElementRef<HTMLInputElement>;

  fileColumns: Tablecolumn[] = [
    { key: 'icon', title: '', sortable: true, isIcon: true },
    { key: 'name', title: 'Name', sortable: true },
    { key: 'formatedType', title: 'Dateityp', sortable: true },
    { key: 'formattedSize', title: 'Größe', sortable: true },
  ];

  filters: FilterOption[] = [
    { type: 'text', key: 'search', label: 'Search' },
  ];

  buttons: Buttons[] = [
    { name: '', icon:'fa-solid fa-upload', value: 'upload', status: false},
    { name: '', icon:'fa-solid fa-download', value: 'download', status: false},
    { name: 'Neu', icon:'fa-solid fa-plus', value: 'new', status: false},
    { name: 'Bearbeiten', icon:'far fa-edit', value: 'edit', status: false},
    { name: 'Löschen', icon:'fa-solid fa-xmark', value: 'remove', status: false},
  ]

  constructor(
    private productDocumentService: ProductDocumentService,
    private sanitizer: DomSanitizer,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.loadTree();
  }

  focusNewFolderInput(): void {
    if (this.newFolderInput) {
      this.newFolderInput.nativeElement.focus();
    }
  }

  focusEditFolderInput(): void {
    if (this.editFolderInput) {
      this.editFolderInput.nativeElement.focus();
    }
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

  saveOpenState(tree: FolderData[]): void {
    this.openPaths = [];
    this.collectOpenPaths(tree);
  }

  collectOpenPaths(tree: FolderData[]): void {
    for (const folder of tree) {
      if (folder.isOpen) {
        this.openPaths.push(folder.path);
      }
      if (folder.children) {
        this.collectOpenPaths(folder.children as FolderData[]);
      }
    }
  }

  selectNode(node: FolderData | null): void {
    this.deselectNode(this.tree);
    if (node && node.type === 'folder') {
      this.selectedNode = node;
      this.loadFiles(node.path);
      node.isSelected = true;
      this.fileContent = null
      this.setStatusButton('file', false)
      this.setStatusButton('folder', true)
      //node.isOpen = true;  // Открываем папку при выборе
    } else {
      
      this.selectedNode = null;
      this.selectedFiles = [];
      this.fileContent = null

      this.setStatusButton('all', false)
    }
  }

  setStatusButton(type:any, status: boolean){
    if(type == 'all'){
      this.buttons.forEach(item => {
        item.status = status
      })
    }
    if(type == 'folder'){
      this.buttons.forEach(item => {
        
        if(item.value == 'upload'){
          item.status = status
        }
        if(item.value == 'new'){
          item.status = status
        }
        
      })
      console.log(this.buttons)
    }
    if(type == 'file'){
      this.buttons.forEach(item => {
        
        if(item.value == 'download'){
          item.status = status
        }
        if(item.value == 'edit'){
          item.status = status
        }
        if(item.value == 'remove'){
          item.status = status
        }
      })
      console.log(this.buttons)
    }
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
    this.isLoaded = false
    this.productDocumentService.getFiles(folder)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((files: FileData[]) => {
        this.selectedFiles = files.filter((file: FileData) => file.type === 'file');
        this.updateFileData();
      });
  }

  viewFileById(fileId: number): void {
    this.productDocumentService.getFileContentById(fileId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(content => {
        const url = window.URL.createObjectURL(content);
        this.fileContent = this.sanitizer.bypassSecurityTrustResourceUrl(url)
      });
  }

  onFileSelected(file: FileData): void {
    this.fileContent = null
    this.isFileLoading = true
    this.isImage = file.mime_type.startsWith('image/');
    this.productDocumentService.getFileContentById(file.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(content => {
        const url = window.URL.createObjectURL(content);
        this.fileContent = this.sanitizer.bypassSecurityTrustResourceUrl(url+'#view=FitH') ;
        this.isFileLoading = false
      });
    
      this.setStatusButton('file', true)
  }

  createFolder(): void {
    
    const newFolder: FolderData = {
      name: '',
      path: this.selectedNode ? `${this.selectedNode.path}/new-folder` : 'new-folder',
      type: 'folder',
      children: [],
      isSelected: false,
      isNew: true,
      isOpen: false
    };
    if (this.selectedNode) {
      this.selectedNode.children.push(newFolder);
      this.selectedNode.isOpen = true;
      this.expandParentFolders(newFolder.path);  // Открываем родительские папки
    } else {
      
      this.tree.push(newFolder);
    }
    this.creatingFolder = newFolder;
    console.log(this.selectedNode)
    console.log(this.tree)
    console.log(this.creatingFolder)
  }

  expandParentFolders(path: string): void {
    const segments = path.split('/');
    let currentPath = '';
    segments.forEach((segment, index) => {
      if (index === segments.length - 1) return;
      currentPath += segment + (index < segments.length - 1 ? '/' : '');
      this.openPaths.push(currentPath);
    });
  }

  saveNewFolder(folder: FolderData): void {
    const parentPath = folder.path.split('/').slice(0, -1).join('/') || '';
    const folderName = folder.name.trim();
    if (folderName) {
      this.productDocumentService.createFolder({ path: parentPath, folder_name: folderName })
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(() => {
          this.saveOpenState(this.tree);
          this.loadTree();
          this.creatingFolder = null;
        });
    } else {
      this.cancelCreateNewFolder();
    }
  }

  cancelCreateNewFolder(): void {
    if (this.creatingFolder) {
      if (this.selectedNode) {
        this.selectedNode.children = this.selectedNode.children.filter(child => child !== this.creatingFolder);
      } else {
        this.tree = this.tree.filter(child => child !== this.creatingFolder);
      }
      this.creatingFolder = null;
      this.saveOpenState(this.tree);
      this.loadTree();
    }
  }

  createNewFolder(parentPath: string): void {
    if (this.newFolderName) {
      this.productDocumentService.createFolder({ path: parentPath, folder_name: this.newFolderName })
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(() => {
          this.saveOpenState(this.tree);
          this.loadTree();
          this.newFolderName = null;
        });
    }
  }

  onNewFolderBlur(folder: FolderData): void {
    setTimeout(() => {
      if (folder.isEditing) {
        this.saveNewFolder(folder);
      }
    }, 200);
  }

  onNewFolderKeydown(event: KeyboardEvent, folder: FolderData): void {
    if (event.key === 'Enter') {
      this.onNewFolderBlur(folder);
    } else if (event.key === 'Escape') {
      this.cancelCreateNewFolder();
    }
  }

  editFolder(): void {
    if (this.selectedNode) {
      this.originalFolderName = this.selectedNode.name;
      this.selectedNode.isEditing = true;
      this.editingFolder = this.selectedNode;
      setTimeout(() => {
        this.focusEditFolderInput();
      }, 0);
    }
  }

  saveEditedFolder(folder: FolderData): void {
    if (folder.name.trim() && this.editingFolder) {
      const oldPath = this.editingFolder.path;
      const newFolderName = folder.name;
      const newPath = this.getNewFolderPath(oldPath, newFolderName);
      this.productDocumentService.renameFolder({ old_path: oldPath, new_path: newPath })
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(() => {
          this.saveOpenState(this.tree);
          this.loadTree();
          this.editingFolder = null;
        });
    } else {
      folder.name = this.originalFolderName ?? folder.name;
      this.originalFolderName = null;
      folder.isEditing = false;
      this.saveOpenState(this.tree);
      this.loadTree();
    }
  }

  onEditFolderBlur(folder: FolderData): void {
    setTimeout(() => {
      if (folder.isEditing) {
        if (this.creatingFolder === folder) {
          this.saveNewFolder(folder);
        } else {
          this.saveEditedFolder(folder);
        }
      }
    }, 200);
  }

  onEditFolderKeydown(event: KeyboardEvent, folder: FolderData): void {
    if (event.key === 'Enter') {
      this.onEditFolderBlur(folder);
    } else if (event.key === 'Escape') {
      if (this.creatingFolder === folder) {
        this.cancelCreateNewFolder();
      } else {
        folder.name = this.originalFolderName ?? folder.name;
        this.originalFolderName = null;
        folder.isEditing = false;
        this.saveOpenState(this.tree);
        this.loadTree();
      }
    }
  }

  uploadFile(parentPath: string, event: any): void {
    const file: File = event.target.files[0];
    if (parentPath && file) {
      this.productDocumentService.uploadFile({ path: parentPath, file: file })
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(() => {
          this.loadFiles(parentPath);
        });
    }
  }

  deleteFolder(path: string | undefined): void {
    if (path) {
      this.productDocumentService.deleteFolder(path)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: () => {
            this.selectedNode = null
            this.saveOpenState(this.tree);
            this.loadTree();
          },
          error: (error) => {
            if (error.status === 403) {
              alert('Folder cannot be deleted because it is linked to a tariff or hardware.');
            } else {
              alert('An error occurred while deleting the folder.');
            }
          }
        });
    }
  }

  deleteFile(file: FileData): void {
    if (file.path) {
      this.productDocumentService.deleteFile(file.path)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: () => {
            if (this.selectedNode) {
              this.loadFiles(this.selectedNode.path);
            }
          },
          error: (error) => {
            if (error.status === 403) {
              alert('File cannot be deleted because it is linked to a tariff or hardware.');
            } else {
              alert('An error occurred while deleting the file.');
            }
          }
        });
    }
  }

  renameFolder(oldPath: string | undefined, newFolderName: string): void {
    if (oldPath) {
      const newPath = this.getNewFolderPath(oldPath, newFolderName);
      this.productDocumentService.renameFolder({ old_path: oldPath, new_path: newPath })
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: () => {
            this.saveOpenState(this.tree);
            this.loadTree();
          },
          error: () => alert('An error occurred while renaming the folder.')
        });
    }
  }

  getNewFolderPath(oldPath: string, newFolderName: string): string {
    const segments = oldPath.split('/');
    segments.pop();
    segments.push(newFolderName);
    return segments.join('/');
  }

  renameFile(oldPath: string | undefined, newFileName: string): void {
    if (oldPath) {
      const newPath = this.getNewFilePath(oldPath, newFileName);
      this.productDocumentService.renameFile({ old_path: oldPath, new_path: newPath })
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: () => {
            if (this.selectedNode) {
              this.loadFiles(this.selectedNode.path);
            }
          },
          error: () => alert('An error occurred while renaming the file.')
        });
    }
  }

  getNewFilePath(oldPath: string, newFileName: string): string {
    const segments = oldPath.split('/');
    segments.pop();
    segments.push(newFileName);
    return segments.join('/');
  }

  getFileType(mimeType: string): string {
    if (mimeType === 'application/pdf') {
      return 'PDF';
    } else if (mimeType.startsWith('image/')) {
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

  updateFileData(): void {
    this.selectedFiles = this.selectedFiles.map(file => ({
      ...file,
      icon: this.getFileIcon(file.mime_type),
      formattedSize: this.getFileSize(file.size),
      formatedType: this.getFileType(file.mime_type),
    }));

    this.isLoaded = true
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
