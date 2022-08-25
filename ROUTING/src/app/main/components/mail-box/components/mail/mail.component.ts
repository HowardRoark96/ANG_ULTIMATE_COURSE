import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Mail } from '../../../../interfaces/mail.interface';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MoveMailModalComponent } from '../../../../../modals/move-mail-modal/move-mail-modal.component';
import { EmailService } from '../../../../../services/email.service';

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.scss']
})
export class MailComponent implements OnInit {
  isMailSelected: boolean = false;

  @Input() mail: Mail;
  @Input() folderId: string;
  @Output() onMailDelete: EventEmitter<never> = new EventEmitter<never>();
  @Output() onMailMove: EventEmitter<never> = new EventEmitter<never>();

  constructor(
    private elRef: ElementRef,
    private dialog: MatDialog,
    private emailService: EmailService
  ) { }

  ngOnInit(): void { }

  onExpandClick(event: Event, state: boolean) {
    event.preventDefault();
    event.stopPropagation();

    this.isMailSelected = state;
    if (!this.mail.isReaden && this.isMailSelected)
      this.mail.isReaden = true;

    if (!this.isMailSelected)
      this.elRef.nativeElement.getElementsByClassName('mail-text')[0].scrollTop = 0;
  }

  makeAsUnread(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.mail.isReaden = false;
    this.isMailSelected = false;
  }

  moveToFolder(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    const dialogConfig = new MatDialogConfig();

    dialogConfig.panelClass = 'dialog-container';

    dialogConfig.data = {
      id: 1,
      title: `You are going to move email from '${this.mail.from}' to another folder.`,
      info: 'Select a folder to move:',
      currentFolderId: this.folderId
    };

    const dialogRef = this.dialog.open(MoveMailModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      toFolderId => {
        if(toFolderId?.folderIndex) {
          this.emailService.moveMail(this.folderId, toFolderId.folderIndex, this.mail)
            .subscribe(() => this.onMailMove.emit());
        }
      }
    );
  }
}
