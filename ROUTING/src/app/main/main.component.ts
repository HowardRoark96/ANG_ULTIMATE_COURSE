import { Component, OnInit } from '@angular/core';
import { Folder } from './interfaces/folder.interface';
import { EmailService } from '../services/email.service';
import { map } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../auth-form/interfaces/user.interface';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MoveMailModalComponent } from '../modals/move-mail-modal/move-mail-modal.component';
import { NewMailModalComponent } from '../modals/new-mail-modal/new-mail-modal.component';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  folders: Folder[];
  selectedFolderIndex: number = 0;
  user: User;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private emailService: EmailService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.user = this.authService.user.getValue();

    this.route.data
      .pipe(map(data => data?.['folders']))
      .subscribe(data => this.folders = data);
  }

  onFolderClick(index: number) {
    this.selectedFolderIndex = index;
    this.router.navigate(['folder/' + this.folders[index].entityId]);
  }

  onFolderCreated(folder: Folder) {
    this.folders.push(folder);
  }

  onDeleteFolder(event: Event, index: number) {
    this.emailService.deleteFolderEntityById(this.folders[index].entityId)
      .subscribe(() => {
          this.folders.splice(index, 1);

          if (this.selectedFolderIndex === index)
            this.onFolderClick(index - 1);
        }
      );

    event.preventDefault();
    event.stopPropagation();
  }

  onLogout() {
    this.authService.user.next({login: '', password: ''});

    localStorage.clear();

    this.router.navigate(['authorization']);
  }

  onNewMailClicked() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.panelClass = 'dialog-container';
    dialogConfig.autoFocus = false;

    dialogConfig.data = {
      title: 'Send message.'
    };

    const dialogRef = this.dialog.open(NewMailModalComponent, dialogConfig);
  }
}
