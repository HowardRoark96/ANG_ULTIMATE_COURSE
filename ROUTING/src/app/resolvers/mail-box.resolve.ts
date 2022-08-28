import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { FolderEntity } from '../main/interfaces/folder.interface';
import { EmailService } from '../services/email.service';
import { EMPTY, Observable, of, switchMap } from 'rxjs';

@Injectable()
export class MailBoxResolve implements Resolve<FolderEntity | never> {
  constructor(
    private emailService: EmailService,
    private router: Router
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FolderEntity | never> {
    const folders = this.emailService.folders.getValue();

    if (!route.params['id'] || !folders.some(folder => folder.entityId === route.params['id'])) {
      this.router.navigate([`folder/${folders[0].entityId}`]);

      return EMPTY;
    }

    return this.emailService.getFolderById(route.params['id'])
      .pipe(
        switchMap(data => data ? of(data) : EMPTY)
      );
  }
}
