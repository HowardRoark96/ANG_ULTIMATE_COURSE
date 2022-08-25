import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Folder } from '../../main/interfaces/folder.interface';
import { EmailService } from '../../services/email.service';

@Component({
  selector: 'app-move-mail-modal',
  templateUrl: './move-mail-modal.component.html',
  styleUrls: ['./move-mail-modal.component.scss']
})
export class MoveMailModalComponent implements OnInit {
  form: FormGroup;
  title: string;
  info: string;
  currentFolderId: number;
  folders: Folder[];

  get isSameFolder() {
    return (
      this.form.get('folderIndex')?.value === this.folders[this.currentFolderId].entityId
      && this.form.touched
    )
  }

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MoveMailModalComponent>,
    private emailService: EmailService,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.title = data.title;
    this.info = data.info;

    this.folders = this.emailService.folders.value;
    this.currentFolderId = this.folders.findIndex(folder => folder.entityId === data.currentFolderId);
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      folderIndex: [this.currentFolderId]
    });
  }

  save() {
    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }
}
