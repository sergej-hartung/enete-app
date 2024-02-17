import { Observable, Subject } from 'rxjs';

// IDataService Interface: Defines the standard operations for data management
export interface IDataService<T> {
    // Observables for streaming data, detailed data, confirmation actions and errors
    data$: Observable<DataResponse<T[]> | null>;
    detailedData$: Observable<DataResponse<T> | null>;
    confirmAction$ : Observable<{action: string, proceedCallback: () => void}>;
    //success$: Observable<string>
    errors$: Observable<any>

    // Filters applied to the data fetch operations
    get filters(): {[key: string]: string} | undefined;

    // Standard CRUD operations and other necessary methods
    fetchData(params?: any): void;
    fetchDetailedDataById(id: number): void;
    addItem(item: T): void;
    updateItem(id: number, item: T): void;
    deleteItem(id: number): void;
    resetDetailedData(): void;
    confirmAction(action: string, proceedCallback: () => void): void
    // Другие необходимые методы
}

export interface DataResponse<T> {
    data: T;
    requestType: 'get' | 'post' | 'put' | 'patch' | 'delete';
    entityType: string;
  }
