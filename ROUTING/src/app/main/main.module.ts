import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainComponent } from './main.component';
import { MailBoxComponent } from './components/mail-box/mail-box.component';
import { MailComponent } from './components/mail-box/components/mail/mail.component';
import { MessengerBoxComponent } from './components/messenger-box/messenger-box.component';
import {
  CreateFolderBtnComponent
} from './components/mail-box/components/create-folder-btn/create-folder-btn.component';
import { MainFolderResolve } from '../resolvers/main-folder.resolve';
import { MailBoxResolve } from '../resolvers/mail-box.resolve';
import { SearchComponent } from './components/messenger-box/components/search/search.component';

const routes: Routes = [];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
    MatIconModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [
    MainComponent,
    MailBoxComponent,
    MailComponent,
    CreateFolderBtnComponent,
    MessengerBoxComponent,
    SearchComponent
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
