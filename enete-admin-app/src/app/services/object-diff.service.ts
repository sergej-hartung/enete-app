import { Injectable } from '@angular/core';

interface ChangeResult {
  updated: any;
  added: any;
  deleted: any;
}

@Injectable({
  providedIn: 'root'
})
export class ObjectDiffService {

  

  public getChanges(original: any, updated: any): ChangeResult {
    const changes: ChangeResult = { updated: [], added: [], deleted: [] };
    this.compareObjects(original, updated, changes);
    return changes;
  }

  private compareObjects(original: any, updated: any, changes: ChangeResult, path: string[] = [], ids: string [] = []) {
    if (Array.isArray(original) && Array.isArray(updated)) {
      this.compareArrays(original, updated, changes, path, ids);
    } else if (typeof original === 'object' && typeof updated === 'object') {
      this.compareObjectProperties(original, updated, changes, path, ids);
    }else if (original !== updated) {
        let nestedResult = this.createNestedStructureWithLastKey(path, ids, updated);
        this.addOrUpdateItems(changes.updated, nestedResult)
    }
  }


  private compareArrays(originalArray: any[], updatedArray: any[], changes: ChangeResult, path: string[], ids:string []) {
    const originalIds = originalArray.map(item => item.id);
    const updatedIds = updatedArray.map(item => item.id);

    this.findDeletedItems(originalArray, updatedIds, changes, path, ids);
    this.findAddedAndUpdatedItems(originalArray, updatedArray, originalIds, changes, path, ids);

    // // Compare nested objects recursively
    // updatedArray.forEach((updatedItem, index) => {
    //   const originalItem = originalArray.find(item => item.id === updatedItem.id);
    //   if (originalItem) {
    //     this.compareObjects(originalItem, updatedItem, changes, path, [...ids, updatedItem.id]);
    //   }
    // });
    updatedArray.forEach(updatedItem => {
      const originalItem = originalArray.find(item => item.id === updatedItem.id);
      if (originalItem) {
        // Рекурсивно проверяем вложенные объекты
        this.compareObjects(originalItem, updatedItem, changes, [...path], [...ids, updatedItem.id || updatedItem.uniqueId]);
      }
    });
  }

  private findDeletedItems(originalArray: any[], updatedIds: any[], changes: ChangeResult, path: string[], ids:string []) {
    originalArray.forEach(originalItem => {
      if (!updatedIds.includes(originalItem.id)) {
        this.addToDeleted(changes, path, originalItem, ids);
      }
    });
  }

  private addToDeleted(changes: ChangeResult, path: string[], item: any, ids:string []) {
    let nestedResult = this.createNestedStructureWithLastKey(path, ids, [item]);
    this.addOrUpdateItems(changes.deleted, nestedResult)
  }

  private findAddedAndUpdatedItems(originalArray: any[], updatedArray: any[], originalIds: any[], changes: ChangeResult, path: string[], ids:string []) {
    updatedArray.forEach((updatedItem, updatedIndex) => {
      const originalIndex = originalIds.indexOf(updatedItem.id);
      if (originalIndex !== -1) {
        const originalItem = originalArray[originalIndex];
        if (!this.areObjectsEqual(originalItem, updatedItem) || originalIndex !== updatedIndex) {
          if(originalIndex !== updatedIndex){
            this.addToUpdated(changes, path, updatedItem, updatedIndex, ids);
          }
        }
      } else {      
        this.addToAdded(changes, path, updatedItem, updatedIndex, ids);
      }
    });
  }

  private addToUpdated(changes: ChangeResult, path: string[], item: any, updatedIndex: number, ids:string []) {
    const updatedCopy = { ...item };
    updatedCopy.position = updatedIndex + 1;

    let nestedResult = this.createNestedStructureWithLastKey([...path, 'position'], [...ids, item?.id], updatedIndex + 1);
    this.addOrUpdateItems(changes.updated, nestedResult)
  }
  
  private addToAdded(changes: ChangeResult, path: string[], item: any, addedIndex: number | null, ids:string []) {
    const addedCopy = { ...item };
    //console.log(addedCopy)
    if (addedIndex !== null) {
      addedCopy.position = addedIndex + 1;
    }

    let nestedResult = this.createNestedStructureWithLastKey(path, ids, [addedCopy]);
    this.addOrUpdateItems(changes.added, nestedResult)
  }

  private compareObjectProperties(originalObj: any, updatedObj: any, changes: ChangeResult, path: string[], ids:string []) {
    for (const key in originalObj) {
      if (Object.prototype.hasOwnProperty.call(originalObj, key)) {
        if (!updatedObj.hasOwnProperty(key)) {
          this.addToDeleted(changes, [...path, key], originalObj[key], [...ids, originalObj.id]);
        } else {
         const newIds = [...ids];
         if (originalObj[key]?.id || originalObj[key]?.id) {
             newIds.push(updatedObj[key]?.id || originalObj[key]?.id);
         }
          this.compareObjects(originalObj[key], updatedObj[key], changes, [...path, key], newIds);
        }
      }
    }

    for (const key in updatedObj) {
      if (Object.prototype.hasOwnProperty.call(updatedObj, key) && !originalObj.hasOwnProperty(key)) {
        this.addToAdded(changes, [...path, key], updatedObj[key], null, ids);
      }
    }
  }

  // Функция для создания вложенной структуры с учётом последнего ключа
  private createNestedStructureWithLastKey(path: string[], ids: string[], updatedValue: any): any {
    let result: any = {};
    let current = result;

    // Создаем вложенную структуру по пути
    for (let i = 0; i < path.length - 1; i++) { // Проходим только до предпоследнего ключа
        const key = path[i];
        const id = ids[i];
        
        if (!current[key]) {
            current[key] = [];
        }


        // Проверяем, есть ли уже объект с таким id
        let existingItem = current[key].find((item: any) => item.id === id);
       
        if (!existingItem) {
            existingItem = { id };
            current[key].push(existingItem);
        }
        
        current = existingItem; // Уходим на уровень вложенности
    }

    // Устанавливаем изменённое значение на последнем уровне (ключ из path)
    
    const lastKey = path[path.length - 1];
    current[lastKey] = updatedValue;

    return result;
  }

  /**
     * Добавление новых элементов или обновление существующих
     * @param newItems - массив новых элементов
     */
  private addOrUpdateItems(updated: any[],newItem: any) {

    const [newKey] = Object.keys(newItem); // Получаем ключ (например, "calc_matrix")

    // Проверяем, существует ли объект с таким же ключом в существующем массиве
    const existingItem = updated.find(item => item[newKey]);

    if (existingItem) {
      // Если существует, обновляем существующий объект
      this.mergeObjects(existingItem[newKey], newItem[newKey]);
    } else {
      // Если не существует, добавляем новый объект
      updated.push(newItem);
      return
    }

  }

  /**
  * Объединяет новые данные с существующими
  * @param existingArray - существующий массив объектов
  * @param newArray - новый массив объектов
  */
  private mergeObjects(existingArray: any[], newArray: any[]) {
    newArray.forEach(newObj => {
      

      const existingObj = existingArray.find(obj =>
       (obj.id && obj.id === newObj.id)  || (obj.uniqueId && obj.uniqueId === newObj.uniqueId)
      );

      if (existingObj) {
        // Обновляем существующий объект (например, добавляем атрибуты)
        Object.keys(newObj).forEach(key => {
          if (Array.isArray(newObj[key])) {
            // Если это массив (например, "attributs"), объединяем массивы
            if (!existingObj[key]) {
              existingObj[key] = [];
            }
            this.mergeObjects(existingObj[key], newObj[key]);
          } else {
            // Если это простое значение, обновляем
            existingObj[key] = newObj[key];
          }
        });
      } else {
        // Если объект с таким id не найден, добавляем новый
        existingArray.push(newObj);
      }
    });
  }


  private areObjectsEqual(obj1: any, obj2: any): boolean {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  hasDifferences(obj1: any, obj2: any): boolean {
    return JSON.stringify(obj1) !== JSON.stringify(obj2);
  }

  getDifferences(obj1: any, obj2: any): any {
    const differences: any = {};
    
    const compareObjects = (o1: any, o2: any, path: string = '') => {
      for (const key in o2) {
        if (Object.prototype.hasOwnProperty.call(o2, key)) {
          const currentPath = path ? `${path}.${key}` : key;
          
          if (!(key in o1)) {
            differences[currentPath] = o2[key];
          } else if (typeof o2[key] === 'object' && o2[key] !== null && !Array.isArray(o2[key])) {
            compareObjects(o1[key], o2[key], currentPath);
          } else if (JSON.stringify(o1[key]) !== JSON.stringify(o2[key])) {
            differences[currentPath] = o2[key];
          }
        }
      }
    };

    compareObjects(obj1, obj2);
    return differences;
  }
}
