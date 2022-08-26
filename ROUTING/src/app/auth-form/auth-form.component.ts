import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { of, switchMap } from 'rxjs';
import { User } from './interfaces/user.interface';
import { Router } from '@angular/router';
import { EmailService } from '../services/email.service';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss']
})
export class AuthFormComponent implements OnInit {
  form: FormGroup = this.fb.group({
      'login': ['', [Validators.required]],
      'password': ['', [Validators.required]],
    }
  )

  ctx: Object | null = null;

  get isValidLogin() {
    return !(
      this.form.get('login')?.hasError('required')
      && this.form.get('login')?.touched
    );
  }

  get isValidPassword() {
    return !(
      this.form.get('password')?.hasError('required')
      && this.form.get('password')?.touched
    );
  }

  get isUserExistsAsync() {
    return !this.form.get('login')?.hasError('userNotExists');
  }

  get isValidUserNameAsync() {
    return !this.form.get('login')?.hasError('userAlreadyExists');
  }

  get isPasswordCorrectAsync() {
    return !this.form.get('password')?.hasError('passwordIncorrect');
  }

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private emailService: EmailService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.changeFormToLogIn();
  }

  changeFormToSingUp() {
    this.form.reset();

    this.ctx = {
      $implicit: this.form,
      title: 'Sign up',
      submitBtnText: 'Sign up',
      onSubmit: this.onSingUp.bind(this),
      formSwitcherText: 'Have an account?',
      formSwitcherLinkText: 'Log in',
      onChangeFormMode: this.changeFormToLogIn.bind(this)
    }
  }

  changeFormToLogIn() {
    this.form.reset();

    this.ctx = {
      $implicit: this.form,
      title: 'Log in',
      submitBtnText: 'Login',
      onSubmit: this.onLogin.bind(this),
      formSwitcherText: 'Don\'t have an account?',
      formSwitcherLinkText: 'Create one',
      onChangeFormMode: this.changeFormToSingUp.bind(this)
    }
  }

  onLogin() {
    const user = {
      login: this.form.get('login')?.value,
      password: this.form.get('password')?.value
    };

    this.authService.login(user)
      .pipe(
        switchMap(res => {
          if (!res) {
            this.form.get('login')?.setErrors({ userNotExists: true });
            return of();
          }

          if (res.password !== user.password) {
            this.form.get('password')?.setErrors({ passwordIncorrect: true });
            return of();
          }

          return of(res);
        })
      ).subscribe(user => {
        this.authService.setCurrentUser(user as User);

        localStorage.setItem(
          'currentUser',
          JSON.stringify({ login: (user as User).login, password: (user as User).password, id: (user as User).id})
        );

        this.router.navigate(['/folder']);
      });
  }

  onSingUp() {
    this.validateUserName()
      .pipe(
        switchMap(res => {
          if (res) {
            this.form.get('login')?.setErrors({ userAlreadyExists: true });
            return of();
          }

          const user = {
            login: this.form.get('login')?.value,
            password: this.form.get('password')?.value
          };

          return this.authService.signUp(user);
        })
      ).subscribe((user: User) => {
        this.authService.setCurrentUser(user as User);

        localStorage.setItem(
          'currentUser',
          JSON.stringify({ login: user.login, password: user.password, id: user.id})
        );

        this.emailService.initNewUser().subscribe(() => this.router.navigate(['folder/']));
      });
  }

  validateUserName() {
    return this.authService.checkUserName(this.form.get('login')?.value);
  }

  validateUserPassword() {
    return this.authService.checkUserName(this.form.get('login')?.value);
  }
}
