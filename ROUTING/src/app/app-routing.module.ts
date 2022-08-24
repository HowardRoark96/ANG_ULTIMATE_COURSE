import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { MainFolderResolve } from './resolvers/main-folder.resolve';
import { AuthFormRoutingModule } from './auth-form/auth-form-routing.module';

const ROUTES: Routes = [
  {
    path: 'main',
    component: MainComponent,
    resolve: {
      folders:  MainFolderResolve
    }
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
