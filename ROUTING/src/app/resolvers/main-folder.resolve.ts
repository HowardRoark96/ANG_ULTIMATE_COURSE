import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Folder } from '../main/interfaces/folder.interface';
import { EmailService } from '../services/email.service';
import { forkJoin, Observable, of, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class MainFolderResolve implements Resolve<Folder[]>{
  constructor(
    private emailService: EmailService,
    private authService: AuthService
  ) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Folder[]> {
    if (!this.authService.user.value.id) return of([]);

    return this.emailService.getAllUserFolders(this.authService.user.value);
  }
}
