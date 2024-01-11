import { Injectable } from '@angular/core';
import { IDataService } from '../models/data-interface';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export abstract class DataService<T> implements IDataService<T> {
    
    protected _data = new BehaviorSubject<T[]>([]);
    public data$: Observable<T[]> = this._data.asObservable();
    protected _detailedData = new BehaviorSubject<T | null>(null);
    public detailedData$: Observable<T | null> = this._detailedData.asObservable();
    protected confirmActionSource = new Subject<{action: string, proceedCallback: () => void}>();
    public confirmAction$ = this.confirmActionSource.asObservable();
    protected successSubject = new Subject<string>();
    public success$ = this.successSubject.asObservable();
    protected errorSubject = new Subject<any>();
    public errors$ = this.errorSubject.asObservable();
    

    constructor(protected http: HttpClient, protected apiUrl: string) {}

    abstract fetchData(params?: any): void;
    // abstract getItemById(id: number): void;
    abstract fetchDetailedDataById(id: number): void;
    abstract addItem(item: T): void;
    abstract updateItem(item: T): void;
    abstract deleteItem(id: number): void;
    abstract resetDetailedData(): void;
    abstract confirmAction(action: string, proceedCallback: () => void): void;
    abstract filters: {[key: string]: string};
}
