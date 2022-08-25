import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, map, Observable, switchMap } from 'rxjs';
import { AuthService } from './auth.service';
import { User } from '../auth-form/interfaces/user.interface';
import { Folder } from '../main/interfaces/folder.interface';
import { Mail } from '../main/interfaces/mail.interface';

interface RequestFolder {
  id: string,
  name: string
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  static url = 'https://email-manager-6f4a0-default-rtdb.firebaseio.com/';

  public folders: BehaviorSubject<Folder[]> = new BehaviorSubject<Folder[]>([]);

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getConvertedObjectArray(value: object): object[] {
    return Object.keys(value).map(key => ({...value[key], id: key}));
  }

  initNewUser(): Observable<any> {
    const textAboutApplication = `Hello, <strong>${this.authService.user.value.login}</strong>!</br></br>` +
      'The <strong>\'EMAIL MANAGER\'</strong> application allows you to conveniently manage your conversations.</br></br>' +
      'Some tools for working with the application are listed below:</br>' +
      ' - chat with registered users</br>' +
      ' - delete messages</br>' +
      ' - mark messages as unread</br>' +
      ' - create and delete folders as you wish*</br>' +
      ' - move specific emails to other folders</br>' +
      ' - rename existing folders*</br></br>' +
      '<strong>* with the exception of the system folders \'Inbox\' and \'Trash\'</strong>';

    const textAccountInformation = `Hello, <strong>${this.authService.user.value.login}</strong>!</br></br>` +
      'Your account information:</br></br>' +
      `<strong>login - ${this.authService.user.value.login}</strong></br>` +
      `<strong>password - ${this.authService.user.value.password}</strong>`;


    return this.createSystemFolder('Inbox')
      .pipe(
        switchMap(() => this.createSystemFolder('Trash')),
        switchMap(() => {
          return forkJoin([
            this.sendMail(
              'System Info',
              this.authService.user.value,
              textAboutApplication
            ),
            this.sendMail(
              'System Info',
              this.authService.user.value,
              textAccountInformation
            )
          ]);
        })
      );
  }

  createFolder(name: string): Observable<any> {
    const params = {
      name,
      mails: [],
      canDelete: true,
      canEdit: true
    };

    return this.http
      .post<any>(`${EmailService.url}/${this.authService.user.value.login}/${this.authService.user.value.id}/folders.json`, params);
  }

  createSystemFolder(name: string): Observable<any> {
    const params = {
      name,
      canDelete: false,
      canEdit: false
    };

    return this.http
      .post<any>(`${EmailService.url}/${this.authService.user.value.login}/${this.authService.user.value.id}/folders.json`, params)
      .pipe(
        map(() => params)
      );
  }

  getAllUserFolders(user: User): Observable<Folder[]> {
    return this.http
      .get<Folder[]>(`${EmailService.url}/${user.login}/${user.id}/folders.json`)
      .pipe(
        map(res => {
          if (!res) {
            return [] as Folder[];
          }

          const folders = this.getConvertedObjectArray(res) as Folder[];

          folders.forEach(folder => folder.mails = folder.mails ? this.getConvertedObjectArray(folder.mails) as Mail[] : []);

          this.folders.next(folders);

          return folders;
        })
      );
  }

  checkFolderName(name: string): Observable<boolean> {
    return this.getAllUserFolders(this.authService.user.value)
      .pipe(
        map(res => res.some(folder => folder.name === name))
      );
  }

  deleteFolderById(id: string): Observable<void> {
    return this.http.delete<void>(`${EmailService.url}/${this.authService.user.value.login}/${this.authService.user.value.id}/folders/${id}.json`);
  }

  deleteMailById(folderId: string, mailId: string): Observable<void> {
    return this.http.delete<void>(`${EmailService.url}/${this.authService.user.value.login}/${this.authService.user.value.id}/folders/${folderId}/mails/${mailId}.json`);
  }

  sendMail(fromUser: string, toUser: User, text: string): Observable<any> {
    const params = {
      from: fromUser,
      text,
      isReaden: false,
      receivingTime: 12345678
    };

    return this.getAllUserFolders(toUser)
      .pipe(
        switchMap(toUserFolder => {
          return this.http
            .post<any>(`${EmailService.url}/${toUser.login}/${toUser.id}/folders/${toUserFolder[0].id}/mails.json`, params);
        })
      );
  }

  getFolderById(id: string): Observable<Folder> {
    return this.http
      .get<Folder>(`${EmailService.url}/${this.authService.user.value.login}/${this.authService.user.value.id}/folders/${id}.json`)
      .pipe(
        map(res => ({...res, id}))
      );
  }

  moveMail(fromFolderId: string, toFolderId: string, mail: Mail): Observable<void> {
    return this.http
      .post<void>(`${EmailService.url}/${this.authService.user.value.login}/${this.authService.user.value.id}/folders/${toFolderId}/mails.json`, mail)
      .pipe(
        switchMap(res => {
          console.log('Moved mail response:', res);

          return this.deleteMailById(fromFolderId, mail.id);
        })
      );
  }
}
