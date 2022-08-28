import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MainComponent } from './main.component';
import { MailBoxComponent } from './components/mail-box/mail-box.component';
import { MailComponent } from './components/mail-box/components/mail/mail.component';
import {
  CreateFolderBtnComponent
} from './components/mail-box/components/create-folder-btn/create-folder-btn.component';
import { MainFolderResolve } from '../resolvers/main-folder.resolve';
import { MailBoxResolve } from '../resolvers/mail-box.resolve';
import { MainGuard } from './main.guard';

const routes: Routes = [];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    CommonModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  declarations: [
    MainComponent,
    MailBoxComponent,
    MailComponent,
    CreateFolderBtnComponent
  ],
  providers: [
    MainFolderResolve,
    MailBoxResolve,
    MainGuard
  ],
  exports: [
    CreateFolderBtnComponent
  ]
})
export class MainModule { }
