import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { MainFolderResolve } from './resolvers/main-folder.resolve';
import { AuthFormRoutingModule } from './auth-form/auth-form-routing.module';
import { MailBoxComponent } from './main/components/mail-box/mail-box.component';
import { MailBoxResolve } from './resolvers/mail-box.resolve';

const ROUTES: Routes = [
  {
    path: 'main',
    component: MainComponent,
    resolve: {
      folders:  MainFolderResolve
    },
    children: [
      {
        path: 'folder/:id',
        component: MailBoxComponent,
        resolve: {
          folder: MailBoxResolve
        }
      },
    ]
  },
  {
    path: '**',
    redirectTo: 'main'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(ROUTES),
    AuthFormRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
