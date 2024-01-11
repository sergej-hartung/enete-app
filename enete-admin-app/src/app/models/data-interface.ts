import { Observable, Subject } from 'rxjs';

export interface IDataService<T> {
    data$: Observable<T[]>;
    detailedData$: Observable<T | null>;
    confirmAction$ : Observable<{action: string, proceedCallback: () => void}>;
    success$: Observable<string>
    errors$: Observable<any>

    filters: {[key: string]: string};
    fetchData(params?: any): void;
    fetchDetailedDataById(id: number): void;
    addItem(item: T): void;
    updateItem(item: T): void;
    deleteItem(id: number): void;
    resetDetailedData(): void;
    confirmAction(action: string, proceedCallback: () => void): void
    // Другие необходимые методы
}
