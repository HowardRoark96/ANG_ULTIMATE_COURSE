import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, switchMap } from 'rxjs';
import { User } from '../auth-form/interfaces/user.interface';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class AuthService {
  static url = 'https://email-manager-6f4a0-default-rtdb.firebaseio.com/';

  public user: BehaviorSubject<User> = new BehaviorSubject<User>({login: '', password: ''});

  constructor(
    private http: HttpClient
  ) { }

  login(user: User): Observable<any> {
    return this.http.get<any>(`${AuthService.url}/${user.login}.json`)
      .pipe(
        map(res => {
          return res ? Object.keys(res).map(key => ({...res[key], id: key}))[0] as User : null;
        })
      );
  }

  signUp(user: User): Observable<any> {
    const params = {
      login: user.login,
      password: user.password
    };

    return this.http.post<any>(`${AuthService.url}/${user.login}.json`, params)
      .pipe(
        switchMap(res => {
          params['id'] = res.name;

          return this.http.post<any>(`${AuthService.url}/users.json`,  {login: params.login, id: res.name});
        }),
        map(res => params)
      );
  }

  setCurrentUser(user: User) {
    this.user.next(user);
  }

  checkUserName(userName: string): Observable<boolean> {
    return this.http
      .get<boolean>(`${AuthService.url}/${userName}.json`)
      .pipe(
        map(res => {
          if (!res) return false;

          const temp = Object.keys(res).map(key => ({...res[key], id: key}));

          return temp.some(user => user.login === userName);
        })
      );
  }

  checkUserPassword(userName: User): Observable<boolean> {
    return this.http
      .get<boolean>(`${AuthService.url}.json`)
      .pipe(
        map(res => {
          if (!res) return false;

          const temp = Object.keys(res).map(key => ({...res[key], id: key}));

          return temp.some(user => user.login === userName);
        })
      );
  }
}
