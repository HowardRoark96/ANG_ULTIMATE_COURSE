import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Folder } from '../main/interfaces/folder.interface';
import { EmailService } from '../services/email.service';
import { EMPTY, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class MainFolderResolve implements Resolve<Folder[]> {
  constructor(
    private emailService: EmailService,
    private authService: AuthService,
    private router: Router
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Folder[] | never> {
    if (!this.authService.user.value.id) {
      this.router.navigate(['login']);

      return EMPTY
    }

    return this.emailService.getAllUserFolders(this.authService.user.value);
  }
}
