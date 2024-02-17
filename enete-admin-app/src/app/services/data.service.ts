import { Injectable } from '@angular/core';
import { DataResponse, IDataService } from '../models/data-interface';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';


// DataService Class: Abstract class implementing IDataService, providing basic data operations
@Injectable({
    providedIn: 'root'
})
export abstract class DataService<T> implements IDataService<T> {
    // BehaviorSubjects to hold and stream the current state of the data
    protected _data = new BehaviorSubject<DataResponse<T[]> | null>(null);
    public data$: Observable<DataResponse<T[]> | null> = this._data.asObservable();

    protected _detailedData = new BehaviorSubject<DataResponse<T> | null>(null);
    public detailedData$: Observable<DataResponse<T> | null> = this._detailedData.asObservable();

    // Subjects for handling actions and notifications
    protected confirmActionSource = new Subject<{action: string, proceedCallback: () => void}>();
    public confirmAction$ = this.confirmActionSource.asObservable();
    //protected successSubject = new Subject<string>();
    //public success$ = this.successSubject.asObservable();
    protected errorSubject = new Subject<any>();
    public errors$ = this.errorSubject.asObservable();
    
    // Constructor injecting HttpClient and apiUrl for HTTP operations
    constructor(protected http: HttpClient, protected apiUrl: string) {}

    // Abstract methods for CRUD operations, to be implemented in derived classes
    abstract fetchData(params?: any): void;
    // abstract getItemById(id: number): void;
    abstract fetchDetailedDataById(id: number): void;
    abstract addItem(item: T): void;
    abstract updateItem(id: number, item: T): void;
    abstract deleteItem(id: number): void;
    abstract resetDetailedData(): void;
    abstract confirmAction(action: string, proceedCallback: () => void): void;
    get filters():{[key: string]: string} | undefined {
        return undefined
    }
}
