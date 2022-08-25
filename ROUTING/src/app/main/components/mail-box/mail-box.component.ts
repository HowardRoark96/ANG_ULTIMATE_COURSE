import { Component, Input, OnInit } from '@angular/core';
import { FolderEntity } from '../../interfaces/folder.interface';
import { map } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-mail-box',
  styleUrls: ['mail-box.component.scss'],
  templateUrl: 'mail-box.component.html'
})
export class MailBoxComponent implements OnInit {
  @Input() folder: FolderEntity;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.data
      .pipe(
        map(data => data?.['folder'])
      ).subscribe(data => {
      this.folder = data;
    });
  }

  onMailMoveOrDelete(mailIndex: number) {
    this.folder.mails?.splice(mailIndex, 1);
  }
}
