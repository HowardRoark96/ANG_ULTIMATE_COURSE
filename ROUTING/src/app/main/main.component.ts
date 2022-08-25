import { Component, OnInit } from '@angular/core';
import { Folder } from './interfaces/folder.interface';
import { EmailService } from '../services/email.service';
import { map } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  folders: Folder[];
  selectedFolderIndex: number = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private emailService: EmailService
  ) {
  }

  ngOnInit() {
    this.route.data
      .pipe(map(data => data?.['folders']))
      .subscribe(data => {
        this.folders = data;
        this.router.navigate([`folder/${this.folders[0].entityId}`], { relativeTo: this.route });
      });
  }

  onFolderClick(index: number) {
    this.selectedFolderIndex = index;
    this.router.navigate(['folder/' + this.folders[index].entityId], { relativeTo: this.route });
  }

  onFolderCreated(folder: Folder) {
    this.folders.push(folder);
  }

  deleteFolder(event: Event, index: number) {
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
}
