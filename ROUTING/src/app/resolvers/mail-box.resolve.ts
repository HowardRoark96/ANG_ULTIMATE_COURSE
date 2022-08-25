import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Folder, FolderEntity } from '../main/interfaces/folder.interface';
import { EmailService } from '../services/email.service';
import { EMPTY, forkJoin, map, Observable, of, switchMap } from 'rxjs';

@Injectable()
export class MailBoxResolve implements Resolve<FolderEntity> {
  constructor(
    private emailService: EmailService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FolderEntity> {
    return this.emailService.getFolderById(route.params['id']);
  }
}
