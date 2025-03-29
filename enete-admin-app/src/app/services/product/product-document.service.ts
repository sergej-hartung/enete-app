import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductDocumentService {
  private apiUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  createFolder(data: { path: string, folder_name: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/products/create-folder`, data);
  }

  uploadFile(data: { path: string, file: File }): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', data.file);
    formData.append('path', data.path);
    return this.http.post(`${this.apiUrl}/products/upload-file`, formData);
  }

  getTree(): Observable<any> {
    return this.http.get(`${this.apiUrl}/products/tree`);
  }


  getFiles(folder: string, search: string = '', mime_type: string = ''): Observable<any> {
    let params = new HttpParams().set('folder', folder);
    if (search) {
      params = params.set('search', search);
    }
    if(mime_type){
      params = params.set('mime_type', mime_type);
    }
    return this.http.get(`${this.apiUrl}/products/files`, { params });
  }

  getFileContent(path: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/products/file-content`, { params: { path }, responseType: 'blob' });
  }

  getFileById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/products/file-content/${id}`);
  }

  getFileContentById(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/products/file-content/${id}`, { responseType: 'blob' });
  }

  deleteFolder(path: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/products/delete-folder`, { body: { path } });
  }

  deleteFile(path: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/products/delete-file`, { body: { path } });
  }

  renameFolder(data: { old_path: string, new_path: string }): Observable<any> {
    return this.http.patch(`${this.apiUrl}/products/rename-folder`, data);
  }

  renameFile(data: { old_path: string, new_path: string }): Observable<any> {
    return this.http.patch(`${this.apiUrl}/products/rename-file`, data);
  }
}