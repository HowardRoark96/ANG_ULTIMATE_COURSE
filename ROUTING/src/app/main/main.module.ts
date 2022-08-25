import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MainComponent } from './main.component';
import { MailBoxComponent } from './components/mail-box/mail-box.component';
import { MailComponent } from './components/mail-box/components/mail/mail.component';
import { HelperBoxComponent } from './components/helper-box/helper-box.component';
import {
  CreateFolderBtnComponent
} from './components/mail-box/components/create-folder-btn/create-folder-btn.component';
import { MainFolderResolve } from '../resolvers/main-folder.resolve';
import { MailBoxResolve } from '../resolvers/mail-box.resolve';

const routes: Routes = [];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
    MatIconModule,
    ReactiveFormsModule
  ],
  declarations: [
    MainComponent,
    MailBoxComponent,
    MailComponent,
    CreateFolderBtnComponent,
    HelperBoxComponent
  ],
  providers: [
    MainFolderResolve,
    MailBoxResolve
  ],
  exports: [
    MailBoxComponent,
    CreateFolderBtnComponent
  ]
})
export class MainModule {

}
