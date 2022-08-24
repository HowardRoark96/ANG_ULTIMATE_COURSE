import { Component, Input, OnInit } from '@angular/core';
import { Mail } from '../../../../interfaces/mail.interface';

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.scss']
})
export class MailComponent implements OnInit {
  isMailSelected: boolean = false;

  @Input() mail: Mail;

  constructor() {
  }

  ngOnInit(): void {
  }

  onExpandClick(event: Event, state: boolean) {
    this.isMailSelected = state;
    if (!this.mail.isReaden && this.isMailSelected)
      this.mail.isReaden = true;

    event.preventDefault();
    event.stopPropagation();
  }

  makeAsUnread(event: MouseEvent) {
    this.mail.isReaden = false;
    this.isMailSelected = false;
    event.preventDefault();
    event.stopPropagation();
  }
}
