import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, map, Observable, switchMap } from 'rxjs';
import { AuthService } from './auth.service';
import { User } from '../auth-form/interfaces/user.interface';
import { Folder, FolderEntity } from '../main/interfaces/folder.interface';
import { Mail } from '../main/interfaces/mail.interface';

interface RequestObject {
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

  private getConvertedObjectArrayWithoutId(value: object): object[] {
    return Object.keys(value).map(key => ({...value[key]}));
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


    return this.createFolderEntity('Inbox', true)
      .pipe(
        switchMap(() => this.createFolderEntity('Trash', true)),
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
  };

  createFolderEntity(name: string, isSystemFolder: boolean = false): Observable<any> {
    const params = {
      name,
      canDelete: !isSystemFolder,
      canEdit: !isSystemFolder
    };

    return this.http
      .post<any>(`${EmailService.url}/${this.authService.user.value.login}/${this.authService.user.value.id}/foldersEntities.json`, params)
      .pipe(
        map((data: RequestObject) => ({...params, id: data.name})),
        switchMap((data: FolderEntity) => this.createFolder(data))
      );
  }

  private createFolder(folderEntity: FolderEntity): Observable<{ folder: Folder, folderEntity: FolderEntity }> {
    const folder = {
      name: folderEntity.name,
      entityId: folderEntity.id,
      canDelete: folderEntity.canDelete,
      canEdit: folderEntity.canEdit
    };

    return this.http
      .post<RequestObject>(`${EmailService.url}/${this.authService.user.value.login}/${this.authService.user.value.id}/folders.json`, folder)
      .pipe(
        map((data: RequestObject) => {
          const resultData = {
            folder: ({ ...folder, id: data.name}),
            folderEntity: ({ ...folderEntity, mails: [] })
          };

          this.folders.next([...this.folders.getValue(), resultData.folder]);

          return resultData;
        })
      );
  }

  getAllUserFolders(user: User): Observable<Folder[]> {
    return this.http
      .get<Folder[]>(`${EmailService.url}/${user.login}/${user.id}/folders.json`)
      .pipe(
        map((data: Folder[]) => {
          const folders = this.getConvertedObjectArray(data) as Folder[];

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

  deleteFolderEntityById(id: string): Observable<never> {
    return this.http
      .delete<never>(`${EmailService.url}/${this.authService.user.value.login}/${this.authService.user.value.id}/foldersEntities/${id}.json`)
      .pipe(
        switchMap(() => this.deleteFolderById(id))
      );
  }

  private deleteFolderById(entityId: string): Observable<never> {
    const newFolders = this.folders.getValue();
    const index = newFolders.findIndex(folder => folder.entityId === entityId);

    return this.http
      .delete<never>(`${EmailService.url}/${this.authService.user.value.login}/${this.authService.user.value.id}/folders/${newFolders[index].id}.json`)
      .pipe(
        map(res => {
          newFolders.splice(index,1)
          this.folders.next(newFolders);

          return res;
        })
      );
  }

  deleteMailById(folderId: string, mailId: string): Observable<void> {
    return this.http.delete<void>(`${EmailService.url}/${this.authService.user.value.login}/${this.authService.user.value.id}/foldersEntities/${folderId}/mails/${mailId}.json`);
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
            .post<any>(`${EmailService.url}/${toUser.login}/${toUser.id}/foldersEntities/${toUserFolder[0].entityId}/mails.json`, params);
        })
      );
  }

  getFolderById(id: string): Observable<FolderEntity | null> {
    return this.http
      .get<FolderEntity>(`${EmailService.url}/${this.authService.user.value.login}/${this.authService.user.value.id}/foldersEntities/${id}.json`)
      .pipe(
        map((folder: FolderEntity) => {
          if (folder) {
            folder.mails = folder.mails ? this.getConvertedObjectArray(folder.mails) as Mail[] : [];

            return ({...folder, id});
          }

          return null;
        })
      );
  }

  moveMail(fromFolderId: string, toFolderId: string, mail: Mail): Observable<void> {
    return this.http
      .post<void>(`${EmailService.url}/${this.authService.user.value.login}/${this.authService.user.value.id}/foldersEntities/${toFolderId}/mails.json`, ({...mail, id: null}))
      .pipe(
        switchMap(() => this.deleteMailById(fromFolderId, mail.id))
      );
  }

  makeAsUnread(folderEntityId: string, mailId: string, isReaden: boolean): Observable<never> {
    return this.http
      .put<never>(`${EmailService.url}/${this.authService.user.value.login}/${this.authService.user.value.id}/foldersEntities/${folderEntityId}/mails/${mailId}/isReaden.json`, isReaden);
  }
}
