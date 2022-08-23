import { Component, OnInit } from '@angular/core';
import { EmailService } from './services/email.service';
import { Folder } from './mail-box/interfaces/folder.interface';
import { forkJoin, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  folders: Folder[];
  selectedFolderIndex: number = 0;

  constructor(
    private emailService: EmailService
  ) {
  }

  ngOnInit() {
    this.emailService.getAllFolders()
      .pipe(
        switchMap(res => {
          console.log('Switch res:', res)

          if (!res.length) {
            return forkJoin([
              this.emailService.createSystemFolder('Inbox'),
              this.emailService.createSystemFolder('Trash'),
            ])
          }
          return of(res);
        })
      )
      .subscribe(res => this.folders = res);
  }

  onFolderClick(index: number) {
    this.selectedFolderIndex = index;
    //
    // // this.emailService.addFolder('Folder').subscribe(res => console.log(res));
    // // this.emailService.addFolder('Inbox').subscribe(res => console.log(res));
    // //
    // // this.emailService.getFolderByName('Inbox').subscribe(res => console.log(res));
    // this.emailService.getAllFolders().subscribe(res => console.log(res));
  }

  refreshFolders(event: boolean) {
    console.log(event);
    this.emailService.getAllFolders().subscribe(res => this.folders = res);
  }

  deleteFolder(index: number) {
    this.emailService.deleteFolderById(this.folders[index].id)
      .subscribe(
        {
          next: () => this.folders.splice(index, 1),
          error: error => console.error('There was an error!', error)
        }
      );
  }
}
