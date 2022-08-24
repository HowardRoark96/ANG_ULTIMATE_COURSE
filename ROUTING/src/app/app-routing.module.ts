import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthFormComponent } from './auth-form/auth-form.component';
import { MainComponent } from './main/main.component';
import { MainFolderResolve } from './resolvers/main-folder.resolve';

const ROUTES: Routes = [
  {
    path: 'main',
    component: MainComponent,
    resolve: {
      folders:  MainFolderResolve
    }
  },
  {
    path: 'login',
    component: AuthFormComponent
  },
  {
    path: '**',
    redirectTo: 'main'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(ROUTES)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
