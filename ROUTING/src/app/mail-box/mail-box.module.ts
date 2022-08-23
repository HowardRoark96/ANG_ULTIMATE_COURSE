import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MailBoxComponent } from './mail-box.component';
import { MailComponent } from './components/mail/mail.component';
import { MatIconModule } from '@angular/material/icon';
import { CreateFolderBtnComponent } from './components/create-folder-btn/create-folder-btn.component';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
    MatIconModule,
    ReactiveFormsModule
  ],
  declarations: [
    MailBoxComponent,
    MailComponent,
    CreateFolderBtnComponent
  ],
  exports: [
    MailBoxComponent,
    CreateFolderBtnComponent
  ]
})
export class MailBoxModule {

}
