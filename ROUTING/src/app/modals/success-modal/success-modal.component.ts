import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-success-modal',
  templateUrl: './success-modal.component.html',
  styleUrls: ['./success-modal.component.scss']
})
export class SuccessModalComponent implements OnInit {
  title: string;
  info: string;

  constructor(
    private dialogRef: MatDialogRef<SuccessModalComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.title = data.title || 'Success.';
    this.info = data.info || 'Info.';
  }

  ngOnInit() {
    setTimeout( () => this.close(), 3000);
  }

  close() {
    this.dialogRef.close();
  }
}
