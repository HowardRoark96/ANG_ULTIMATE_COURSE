import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Folder } from './interfaces/folder.interface';
import { EmailService } from '../services/email.service';
import { map } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { User } from '../auth-form/interfaces/user.interface';
import { ActivatedRoute, Router } from '@angular/router';


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
    private cd: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.user = this.authService.user.value;

    if (!this.user.id) this.router.navigate(['login']);

    this.route.data.pipe(map(data => data?.['folders'])).subscribe(res => this.folders = res);
  }

  onFolderClick(index: number) {
    this.selectedFolderIndex = index;
  }

  folderCreated(folderId: string) {
    this.emailService.getFolderById(folderId)
      .subscribe(folder => this.folders.push(folder));
  }

  deleteFolder(event: Event, index: number) {
    this.emailService.deleteFolderById(this.folders[index].id)
      .subscribe(() => {
          this.folders.splice(index, 1);

          if (this.selectedFolderIndex === index)
            this.selectedFolderIndex--;
        }
      );

    event.preventDefault();
    event.stopPropagation();
  }
}
