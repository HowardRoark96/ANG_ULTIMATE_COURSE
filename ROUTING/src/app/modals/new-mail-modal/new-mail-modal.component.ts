import { Component, Inject, Input, OnInit } from '@angular/core';
import { EmailService } from '../../services/email.service';
import { User } from '../../auth-form/interfaces/user.interface';
import { FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SuccessModalComponent } from '../success-modal/success-modal.component';

@Component({
  selector: 'app-new-mail-modal',
  styleUrls: ['new-mail-modal.component.scss'],
  templateUrl: 'new-mail-modal.component.html'
})
export class NewMailModalComponent implements OnInit {
  title: string;
  users: User[];
  showError: boolean = false;
  formReset: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  form = this.fb.group({
    to: [[], [Validators.required]],
    theme: ['', [Validators.pattern(/\w/)]],
    text: ['', [Validators.required, Validators.pattern(/\w/)]]
  })

  get isTextEmpty() {
    return (
      this.form.get('text')?.hasError('required')
      && this.showError
    );
  }

  get isUserSelected() {
    return (
      this.form.get('to')?.hasError('required')
      && this.showError
    );
  }

  get isTextOnlySpaces() {
    return (
      this.form.get('text')?.hasError('pattern')
      && this.showError
    );
  }

  get isThemeOnlySpaces() {
    return (
      this.form.get('theme')?.hasError('pattern')
      && this.showError
    );
  }

  constructor(
    private emailService: EmailService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<NewMailModalComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.title = data.title;
  }

  ngOnInit(): void {
    this.emailService.getAllUsers()
      .subscribe(data => this.users = data);
  }

  searchUser(value: string) {
    const regExp = new RegExp(value);

    const searchResult: User[] = [];

    this.users.forEach(user => user.login.match(regExp) ? searchResult.push(user) : null);

    return searchResult;
  }

  senMail() {
    if (this.form.valid) {
      const users = this.form.get('to')?.value as unknown as User[];

      users?.forEach(user => {
        this.emailService.sendMail(
          null,
          user,
          this.form.get('text')?.value as string,
          this.form.get('theme')?.value as string
        ).subscribe(() => {
          this.close();

          const dialogConfig = new MatDialogConfig();

          dialogConfig.panelClass = 'dialog-container';
          dialogConfig.position = { top: '35px'};
          dialogConfig.hasBackdrop = false;
          dialogConfig.enterAnimationDuration = '500ms';
          dialogConfig.exitAnimationDuration = '500ms';

          dialogConfig.data = {
            info: 'Mail sent successfully.'
          };

          this.dialog.open(SuccessModalComponent, dialogConfig);
        });
      });

      this.showError = false;
    }
    else {
      this.showError = true;
    }
  }

  close() {
    this.dialogRef.close();
  }
}
