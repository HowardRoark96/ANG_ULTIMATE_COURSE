import { Component, Input, OnInit } from '@angular/core';
import { Folder } from '../../interfaces/folder.interface';

@Component({
  selector: 'app-mail-box',
  styleUrls: ['mail-box.component.scss'],
  templateUrl: 'mail-box.component.html'
})
export class MailBoxComponent implements OnInit {
  @Input() folder: Folder;

  ngOnInit() { }

  onMailDelete(mailIndex: number) {

  }

  onMailMove(mailIndex: number) {
    this.folder.mails?.splice(mailIndex, 1);
  }
}
