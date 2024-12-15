import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ProductDocumentService } from '../../../services/product/product-document.service';
import { Subject, takeUntil } from 'rxjs';
import { Tablecolumn } from '../../../models/tablecolumn';
import { Buttons, FilterOption } from '../../../shared/components/generic-table/generic-table.component';
import { MainNavbarService } from '../../../services/main-navbar.service';

interface FileData {
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
  selectedFile: FileData | null = null;
  searchTerm: string = '';
  private unsubscribe$ = new Subject<void>();

  originalFolderName: string | null = null;
  originalFile: any = null;
  newFolderName: string | null = null;
  editingFolder: FolderData | null = null;
  creatingFolder: FolderData | null = null;

  private openPaths: string[] = [];

  @ViewChild('newFolderInput') newFolderInput!: ElementRef<HTMLInputElement>;
  @ViewChild('editFolderInput') editFolderInput!: ElementRef<HTMLInputElement>;

  fileColumns: Tablecolumn[] = [
    { key: 'icon', title: '', sortable: false, isIcon: true },
    { key: 'name', title: 'Name', sortable: false, isEditable: true },
    { key: 'formatedType', title: 'Dateityp', sortable: false },
    { key: 'formattedSize', title: 'Größe', sortable: false },
  ];

  filters: FilterOption[] = [
    { type: 'text', key: 'search', label: 'Search' },
  ];

  buttons: Buttons[] = [
    { name: '', icon:'fa-solid fa-upload', value: 'upload', status: false},
    { name: '', icon:'fa-solid fa-download', value: 'download', status: false},
    { name: 'Bearbeiten', icon:'far fa-edit', value: 'edit', status: false},
    { name: 'Löschen', icon:'fa-solid fa-xmark', value: 'remove', status: false},
  ]

  constructor(
    private productDocumentService: ProductDocumentService,
    private sanitizer: DomSanitizer,
    private renderer: Renderer2,
    private mainNavbarService: MainNavbarService,
  ) {}

  ngOnInit(): void {
    this.initIconStates();
    this.loadTree();
  }

  private initIconStates(): void {
    this.mainNavbarService.setIconState('save', true, true);
    this.mainNavbarService.setIconState('new', true, true);
    this.mainNavbarService.setIconState('back', false, true);
    this.mainNavbarService.setIconState('edit', false, true);
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

  onClickFileEvent(event: any): void {
    switch (event) {
      case 'upload':
        this.uploadFile();
        break;
      case 'download':
        this.downloadFile();
        break;
      case 'edit':
        this.onEditFile();
        break;
      case 'remove':
        this.deleteFile();
        break;
    }
  }

  uploadFile(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = () => {
      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        if (this.selectedNode) {
          this.productDocumentService.uploadFile({ path: this.selectedNode.path, file: file })
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(() => {
              this.loadFiles(this.selectedNode!.path);
            });
        }
      }
    };
    input.click();
  }

  downloadFile(): void {
    if (this.selectedFile) {  // Проверяем конкретно выбранный файл
      this.productDocumentService.getFileContentById(this.selectedFile.id)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(content => {
          const url = window.URL.createObjectURL(content);
          const a = document.createElement('a');
          a.href = url;
          a.download = this.selectedFile!.name;  // Используем имя конкретно выбранного файла
          a.click();
          window.URL.revokeObjectURL(url);
        });
    } else {
      console.warn('No file selected for download');
    }
  }

  editFile(file: FileData): void {
    if (file) {
      this.renameFile(this.selectedFile?.path, file.name);
      this.setStatusButton('file', false)
      this.fileContent = null
    }
  }

  onEditFile(): void{
    console.log(this.selectedFile)
    if (this.selectedFile) {
      console.log(this.selectedFiles)
      this.originalFile = {...this.selectedFile}
      this.selectedFile.isEditing = true
    }
  }

  cancelEditFile(file: FileData | null){
    let FileIndex = this.selectedFiles.findIndex(item => item.id == this.originalFile.id)
    this.selectedFiles[FileIndex] = {...this.originalFile}
    this.selectedFiles = [...this.selectedFiles]
    this.selectedFiles[FileIndex].selected = false
    this.selectedFile = null
    this.setStatusButton('file', false)
    this.fileContent = null
  }

  deleteFile(): void {
    if (this.selectedFile && this.selectedFile.path) {
      if (confirm(`Are you sure you want to delete file ${this.selectedFile.name}?`)) {
        this.productDocumentService.deleteFile(this.selectedFile.path)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe({
            next: () => {
              if (this.selectedNode) {
                this.loadFiles(this.selectedNode.path);
                this.selectedFile = null;
                this.fileContent = null;
                this.setStatusButton('file', false);
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
    } else {
      alert('No file selected for deletion.');
    }
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
    this.isLoaded = false;
    this.productDocumentService.getFiles(folder, this.searchTerm) // Обновление для использования строки поиска
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
    console.log(file)
    this.selectedFile = file;
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

    if (!folderName) {
      this.cancelCreateNewFolder();
      return;
    }
  
    // Check if a folder with the same name already exists in the parent path
    const siblings = this.getFolderSiblings(parentPath);

    const siblingsWithoutCurrent = siblings.filter(sibling => sibling !== folder);
    
    const nameAlreadyExists = siblingsWithoutCurrent.some(
      sibling => sibling.type === 'folder' && sibling.name.toLowerCase() === folderName.toLowerCase()
    );

    if (nameAlreadyExists) {
      // alert('A folder with this name already exists.');
      this.cancelCreateNewFolder();
      return;
    }

    this.productDocumentService.createFolder({ path: parentPath, folder_name: folderName })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.saveOpenState(this.tree);
        this.loadTree();
        this.creatingFolder = null;
      });
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
      const newFolderName = folder.name.trim();
      const parentPath = oldPath.split('/').slice(0, -1).join('/');
      const newPath = this.getNewFolderPath(oldPath, newFolderName);

      if(oldPath == newPath) return;
      // Проверка наличия папки с таким же именем на текущем уровне, исключая саму папку
      const siblings = this.getFolderSiblings(parentPath).filter(
        sibling => sibling.path !== oldPath
      );
      const nameAlreadyExists = siblings.some(
        sibling => sibling.type === 'folder' && sibling.name.toLowerCase() === newFolderName.toLowerCase()
      );

      if (nameAlreadyExists) {
        //alert('Папка с таким именем уже существует на этом уровне.');
        folder.name = this.originalFolderName ?? folder.name;
        folder.isEditing = false;
        this.editingFolder = null; // Сброс текущей редактируемой папки
        return;
      }

      this.productDocumentService.renameFolder({ old_path: oldPath, new_path: newPath })
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: () => {
            this.saveOpenState(this.tree);
            this.loadTree();
            this.editingFolder = null;
          },
          error: () => alert('Произошла ошибка при переименовании папки.')
        });
    } else {
      folder.name = this.originalFolderName ?? folder.name;
      this.originalFolderName = null;
      folder.isEditing = false;
      this.saveOpenState(this.tree);
      this.loadTree();
    }
  }

  getFolderSiblings(parentPath: string): (FolderData | FileData)[] {
    if (parentPath === '') {
      // Если родительский путь пуст, значит это корневая папка
      return this.tree.filter(item => item.type === 'folder');
    } else {
      const parentFolder = this.findFolderByPath(this.tree, parentPath);
      return parentFolder ? parentFolder.children.filter(item => item.type === 'folder') : [];
    }
  }

  findFolderByPath(tree: FolderData[], path: string): FolderData | null {
    for (const folder of tree) {
      if (folder.path === path) {
        return folder;
      }
      if (folder.children) {
        const found = this.findFolderByPath(folder.children as FolderData[], path);
        if (found) {
          return found;
        }
      }
    }
    return null;
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

  getNewFolderPath(oldPath: string, newFolderName: string): string {
    const segments = oldPath.split('/');
    segments.pop();
    segments.push(newFolderName);
    return segments.join('/');
  }

  renameFile(oldPath: string | undefined, newFileName: string): void {
    if (oldPath && this.selectedNode) {

      const oldFileName = this.originalFile?.name;
        if (oldFileName === newFileName) {
            this.cancelEditFile(null);
            return;
        }

      // Извлекаем имена всех файлов в текущей папке
      const existingFileNames = this.selectedFiles.map(file => file.name.toLowerCase());
  
      // Проверяем, существует ли файл с таким же именем
      if (existingFileNames.includes(newFileName.toLowerCase())) {
        console.log(existingFileNames.includes(newFileName.toLowerCase()))
        console.log(existingFileNames)
        this.cancelEditFile(null)
        alert('Файл с таким именем уже существует в этой папке.');
      } else {
        const newPath = this.getNewFilePath(oldPath, newFileName);
        this.productDocumentService.renameFile({ old_path: oldPath, new_path: newPath })
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe({
            next: () => {
              if (this.selectedNode) {
                this.loadFiles(this.selectedNode.path);
              }
            },
            error: () => alert('Произошла ошибка при переименовании файла.')
          });
      }
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
    } else if (mimeType.startsWith('image/svg+xml')) {
      return 'SVG';
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
