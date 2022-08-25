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
  @Output() onMailMoveOrDelete: EventEmitter<never> = new EventEmitter<never>();

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

    if (!this.mail.isReaden && this.isMailSelected){
      this.mail.isReaden = true;
      this.emailService.makeAsUnread(this.folderId, this.mail.id,  this.mail.isReaden).subscribe();
    }

    if (!this.isMailSelected)
      this.elRef.nativeElement.getElementsByClassName('mail-text')[0].scrollTop = 0;
  }

  onMakeAsUnread(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.mail.isReaden = !this.mail.isReaden;
    this.isMailSelected = false;

    this.emailService.makeAsUnread(this.folderId, this.mail.id,  this.mail.isReaden).subscribe();
  }

  onMove(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    const dialogConfig = new MatDialogConfig();

    dialogConfig.panelClass = 'dialog-container';

    dialogConfig.data = {
      title: `You are going to move email from '${this.mail.from}' to another folder.`,
      info: 'Select a folder to move:',
      currentFolderId: this.folderId
    };

    const dialogRef = this.dialog.open(MoveMailModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      toFolderId => {
        if(toFolderId?.folderIndex) {
          this.emailService.moveMail(this.folderId, toFolderId.folderIndex, this.mail)
            .subscribe(() => this.onMailMoveOrDelete.emit());
        }
      }
    );
  }

  onDelete(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    const trashFolder = this.emailService.folders.getValue().find(folder => folder.name === 'Trash');

    if (trashFolder && trashFolder.entityId === this.folderId) {
      this.emailService.deleteMailById(this.folderId, this.mail.id)
        .subscribe(() => this.onMailMoveOrDelete.emit());
    }
    else {
      this.emailService.moveMail(this.folderId, trashFolder?.entityId as string, this.mail)
        .subscribe(() => this.onMailMoveOrDelete.emit());
    }
  }
}
