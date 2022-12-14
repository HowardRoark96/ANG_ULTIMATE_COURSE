import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, of, switchMap } from 'rxjs';
import { EmailService } from '../../../../../services/email.service';
import { Folder } from '../../../../interfaces/folder.interface';

@Component({
  selector: 'app-create-folder-btn',
  templateUrl: './create-folder-btn.component.html',
  styleUrls: ['./create-folder-btn.component.scss']
})
export class CreateFolderBtnComponent implements OnInit {
  @Output() folderCreated = new EventEmitter<Folder>;

  isFormShown: boolean = false;

  get isValid() {
    return !(
      this.form.get('name')?.hasError('required')
      && this.form.get('name')?.touched
    );
  }

  get isFolderExists() {
    return this.form.get('name')?.hasError('folderAlreadyExists');
  }

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required]]
  });

  constructor(
    private fb: FormBuilder,
    private emailService: EmailService
  ) { }

  ngOnInit(): void { }

  showHideForm() {
    this.isFormShown = !this.isFormShown;
    this.form.reset();
  }

  createNewFolder() {
    this.validateFolderName()
      .pipe(
        switchMap(res => {
          if (res) {
            this.form.get('name')?.setErrors(res);
            return of();
          }

          return this.emailService.createFolderEntity(this.form.get('name')?.value);
        })
      )
      .subscribe(res => {
        this.form.reset();
        this.isFormShown = !this.isFormShown;
        this.folderCreated.emit(res.folder);
      });
  }

  validateFolderName() {
    return this.emailService.checkFolderName(this.form.get('name')?.value)
      .pipe(
        map(res => {
          return res ? { folderAlreadyExists: true } : null;
        })
      );
  }
}
