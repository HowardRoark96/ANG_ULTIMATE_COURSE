import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Folder } from '../main/interfaces/folder.interface';
import { EmailService } from '../services/email.service';
import { map, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class MainFolderResolve implements Resolve<Folder[] | never> {
  constructor(
    private emailService: EmailService,
    private authService: AuthService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Folder[]> {
    return this.emailService.getAllUserFolders(this.authService.user.value)
      .pipe(
      map((data: Folder[]) => {
        this.emailService.setCurrentFolders(data);

        return data;
      })
    );
  }
}
