import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

interface RequestFolder {
  id: string,
  name: string
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  static url = 'https://email-manager-6f4a0-default-rtdb.firebaseio.com/';

  constructor(
    private http: HttpClient
  ) {
  }

  createFolder(name: string): Observable<any> {
    const params = {
      name,
      mails: [],
      canDelete: true,
      canEdit: true
    };

    return this.http
      .post<any>(`${EmailService.url}.json`, params)
      .pipe(
        map(res => {
          console.log(res);
          return res;
        })
      );
  }

  createSystemFolder(name: string): Observable<any> {
    const params = {
      name,
      canDelete: false,
      canEdit: false
    };

    return this.http
      .post<any>(`${EmailService.url}.json`, params)
      .pipe(
        map(res => {
          console.log(res);
          return res;
        })
      );
  }

  getAllFolders(): Observable<any[]> {
    return this.http
      .get<any[]>(`${EmailService.url}.json`)
      .pipe(
        map(res => {
          if (!res) {
            return [];
          }

          const temp = Object.keys(res).map(key => ({...res[key], id: key}));

          console.log(temp);

          return temp;
        })
      );
  }

  getFolderByName(name: string): Observable<any> {
    return this.http
      .get<any>(`${EmailService.url}/${name}.json`)
      .pipe(
        map(res => {
          if (!res) {
            return [];
          }

          return Object.keys(res).map(key => ({...res[key], id: key}))[0];
        })
      );
  }

  checkFolderName(name: string): Observable<boolean> {
    return this.getAllFolders()
      .pipe(
        map(res => res.some(folder => folder.name === name))
      );
  }

  deleteFolderById(id: string): Observable<void> {
    return this.http.delete<void>(`${EmailService.url}/${id}.json`);
  }
}
