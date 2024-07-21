import { Component, Input, Output, EventEmitter } from '@angular/core';

interface FileData {
  id: number;
  name: string;
  path: string;
  type: 'file';
  size: number;
  mime_type: string;
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
  selector: 'app-tree-node-modal',
  templateUrl: './tree-node-modal.component.html',
  styleUrls: ['./tree-node-modal.component.scss']
})
export class TreeNodeModalComponent {
  @Input() node!: FolderData;
  @Output() selectNode = new EventEmitter<FolderData | null>();
  //@Output() saveEditedFolder = new EventEmitter<FolderData>();
  //@Output() createNewFolder = new EventEmitter<FolderData>();

  get isSelected(): boolean {
    return this.node.isSelected || false;
  }

  startEditing(event: MouseEvent) {
    event.stopPropagation();
    this.node.isEditing = true;
  }

  toggleFolders(event: Event, iconClick: boolean = false) {
    event.stopPropagation();
    console.log('toogle Folders')
    if (iconClick) {
      event.stopPropagation();
    }
    this.node.isOpen = !this.node.isOpen;
  }

  toggleFiles(event: Event) {
    event.stopPropagation();
    console.log('toogle Filses')
    if (!this.isSelected) {
      this.selectNode.emit(this.node);
    } else {
      this.selectNode.emit(null);
    }
  }

  // onEditFolderBlur(event: FocusEvent) {
  //   event.stopPropagation();
  //   setTimeout(() => {
  //     if (this.node.isEditing) {
  //       this.node.isEditing = false;
  //       this.saveEditedFolder.emit(this.node);
  //     }
  //   }, 0);
  // }

  // onNewFolderBlur(event: FocusEvent) {
  //   setTimeout(() => {
  //     if (this.node.isNew) {
  //       this.node.isNew = false;
  //       this.createNewFolder.emit(this.node);
  //     }
  //   }, 0);
  // }

  // onNewFolderKeydown(event: KeyboardEvent) {
  //   if (event.key === 'Enter') {
  //     this.onNewFolderBlur(new FocusEvent('blur'));
  //   } else if (event.key === 'Escape') {
  //     this.node.isNew = false;
  //   }
  // }

  // onEditFolderKeydown(event: KeyboardEvent) {
  //   if (event.key === 'Enter') {
  //     this.onEditFolderBlur(new FocusEvent('blur'));
  //   } else if (event.key === 'Escape') {
  //     this.node.isEditing = false;
  //   }
  // }

  hasChildren(): boolean {
    return this.node.children.some(child => child.type === 'folder');
  }

  // createFolder(event: MouseEvent) {
  //   event.stopPropagation();
  //   this.createNewFolder.emit();
  // }
}

