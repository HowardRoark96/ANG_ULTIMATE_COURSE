import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class MainGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const currentUser = localStorage.getItem('currentUser');

    if (!currentUser) {
      this.router.navigate(['authorization']);

      return of(false);
    }

    return this.authService.login(JSON.parse(currentUser))
      .pipe(
        switchMap(user => {
          if (!user && user.password !== JSON.parse(currentUser).password) {
            this.router.navigate(['authorization']);

            return of(false);
          }

          this.authService.setCurrentUser(user);

          return of(true);
        })
      );
  }
}
