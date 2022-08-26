import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Folder } from '../main/interfaces/folder.interface';
import { EmailService } from '../services/email.service';
import { EMPTY, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { User } from '../auth-form/interfaces/user.interface';

@Injectable()
export class MainFolderResolve implements Resolve<Folder[] | never> {
  constructor(
    private emailService: EmailService,
    private authService: AuthService,
    private router: Router
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Folder[] | never> {
    const currentUser = localStorage.getItem('currentUser');

    if (!currentUser) {
      this.router.navigate(['authorization']);

      return EMPTY
    }

    this.authService.setCurrentUser(JSON.parse(currentUser) as User);

    return this.emailService.getAllUserFolders(this.authService.user.value);
  }
}
